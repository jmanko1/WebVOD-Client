import { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import "../styles/VideoUpload.css";
import { useNavigate } from "react-router-dom";

const MAX_VIDEO_SIZE = 536870912; // 512 MB
const MAX_THUMBNAIL_SIZE = 1048576; // 1 MB
const ALLOWED_VIDEO_EXT = ["mp4"];
const ALLOWED_VIDEO_MIME = ["video/mp4"];
const ALLOWED_THUMBNAIL_EXT = ["jpg", "jpeg"];
const ALLOWED_THUMBNAIL_MIME = ["image/jpeg"];
const CHUNK_SIZE = 5242880; // 5 MB

const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32
};
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const VideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [tags, setTags] = useState([]);

    const [availableCategories, setAvailableCategories] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);

    const [userThumbnailSrc, setUserThumbnailSrc] = useState(null);
    const [autoThumbnailSrc, setAutoThumbnailSrc] = useState(null);

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [submitMetaDataLoading, setSubmitMetaDataLoading] = useState(false);
    const thumbnailInputRef = useRef();

    const [uploadStarted, setUploadStarted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadedMB, setUploadedMB] = useState(0);

    const navigate = useNavigate();

    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const capitalizeFirstLetter = (text) => {
            if (!text) return "";
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        }

        const fetchCategories = async () => {
            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${api}/video/categories`);
                if(!response.ok) {
                    setMainError("Wystąpił błąd przy pobieraniu dostępnych kategorii filmu. Spróbuj ponownie później.");
                    return;
                }

                const fetchedCategories = await response.json();
                const formattedCategories = fetchedCategories.map(cat => capitalizeFirstLetter(cat));
                setAvailableCategories(formattedCategories);
                setSelectedCategory(formattedCategories[0]);
            } catch {
                setMainError("Wystąpił błąd przy pobieraniu dostępnych kategorii filmu. Spróbuj ponownie później.");
            }
        }

        fetchCategories();
        document.title = "Nowy film - WebVOD";
    }, []);

    useEffect(() => {
        const handleClick = (event) => {
            const anchor = event.target.closest("a");
            if (anchor && isUploading && videoId) {
                const targetPath = new URL(anchor.href, window.location.origin).pathname;

                if (targetPath !== "/upload") {
                    navigator.sendBeacon(`${api}/video/${videoId}/cancel-upload`);
                    sessionStorage.removeItem("isUploading");
                    setIsUploading(false);
                }
            }
        };

        const handleBeforeUnload = () => {
            if (isUploading && videoId) {
                navigator.sendBeacon(`${api}/video/${videoId}/cancel-upload`)
                sessionStorage.removeItem("isUploading");
            }
        };

        document.addEventListener("click", handleClick);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("click", handleClick);
        };
    }, [isUploading, videoId]);

    useEffect(() => {
        return () => {
            if (userThumbnailSrc) {
                URL.revokeObjectURL(userThumbnailSrc);
            }
        };
    }, [userThumbnailSrc]);

    const getFileExtension = (file) => file.name.split('.').pop().toLowerCase();
    const getMimeType = (file) => file.type;

    const clearError = (key) => setErrors(prev => ({ ...prev, [key]: null }));
    const setError = (key, message) => setErrors(prev => ({ ...prev, [key]: message }));

    const validateVideo = (file) => {
        clearError("videoError");

        if (!file) return setError("videoError", "Wybierz plik wideo.") && false;

        const ext = getFileExtension(file);
        if (!ALLOWED_VIDEO_EXT.includes(ext))
            return setError("videoError", "Plik wideo musi być MP4.") && false;

        const mime = getMimeType(file);
        if (!ALLOWED_VIDEO_MIME.includes(mime))
            return setError("videoError", "Nieprawidłowy typ pliku.") && false;

        if (file.size > MAX_VIDEO_SIZE)
            return setError("videoError", "Rozmiar wideo nie może przekraczać 512 MB.") && false;

        return true;
    };

    const validateTitle = () => {
        clearError("titleError");

        if (!title.trim()) return setError("titleError", "Podaj tytuł filmu.") && false;

        if (title.length < 5 || title.length > 100)
            return setError("titleError", "Tytuł musi mieć od 5 do 100 znaków.") && false;

        return true;
    };

    const validateDescription = () => {
        clearError("descriptionError");

        if (description && description.length > 500)
            return setError("descriptionError", "Opis może mieć maksymalnie 500 znaków.") && false;

        return true;
    };

    const validateThumbnail = () => {
        clearError("thumbnailError");

        if (!thumbnail) return true;

        const ext = getFileExtension(thumbnail);
        if (!ALLOWED_THUMBNAIL_EXT.includes(ext))
            return setError("thumbnailError", "Miniatura musi być JPG.") && false;

        const mime = getMimeType(thumbnail);
        if (!ALLOWED_THUMBNAIL_MIME.includes(mime))
            return setError("thumbnailError", "Nieprawidłowy typ pliku.") && false;

        if (thumbnail.size > MAX_THUMBNAIL_SIZE)
            return setError("thumbnailError", "Rozmiar miniatury nie może przekraczać 1 MB.") && false;

        return true;
    };

    const validateCategory = () => {
        clearError("categoryError");

        if (!availableCategories.includes(selectedCategory))
            return setError("categoryError", "Wybierz poprawną kategorię.") && false;

        return true;
    };

    const generateAutoThumbnail = (file) => {
        if (!file || !ALLOWED_VIDEO_MIME.includes(file.type)) return;

        const videoEl = document.createElement("video");
        const url = URL.createObjectURL(file);
        videoEl.src = url;
        videoEl.preload = "metadata";
        videoEl.muted = true;
        videoEl.playsInline = true;

        videoEl.addEventListener("loadedmetadata", () => {
            const randomTime = Math.random() * videoEl.duration;
            videoEl.currentTime = randomTime;
        });

        videoEl.addEventListener("seeked", async () => {
            const canvas = document.createElement("canvas");
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

            const src = canvas.toDataURL("image/jpeg")
            setAutoThumbnailSrc(src);

            const blob = await (await fetch(src)).blob();
            const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });

            setThumbnail(file);
            URL.revokeObjectURL(url);
        });
    };

    const generateUserThumbnail = (file) => {
        if (!ALLOWED_THUMBNAIL_MIME.includes(file?.type)) return;

        if (userThumbnailSrc && userThumbnailSrc.startsWith("blob:")) {
            URL.revokeObjectURL(userThumbnailSrc);
        }

        const imageUrl = URL.createObjectURL(file);
        setUserThumbnailSrc(imageUrl);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setVideo(file);

        if (!userThumbnailSrc) generateAutoThumbnail(file);
    };

    const handleUserThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setAutoThumbnailSrc(null);
        generateUserThumbnail(file);
    };

    const handleCancelThumbnail = () => {
        thumbnailInputRef.current.value = "";
        setUserThumbnailSrc(null);
        generateAutoThumbnail(video);
    };

    const handleTagAddition = (tag) => {
        clearError("tagError");

        if (tags.length >= 10)
            return setError("tagError", "Możesz dodać maksymalnie 10 tagów.");

        if (tag.text.includes(" "))
            return setError("tagError", "Tag nie może zawierać spacji.");

        if (tag.text.length > 20)
            return setError("tagError", "Tag może mieć maks. 20 znaków.");

        setTags([...tags, tag]);
    };

    const handleTagDelete = (i) => {
        clearError("tagError");
        setTags(tags.filter((_, index) => index !== i));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMainError(null);
        setSubmitMetaDataLoading(true);

        const isValid =
            validateVideo(video) &
            validateTitle() &
            validateDescription() &
            validateThumbnail() &
            validateCategory();

        if (!isValid) {
            setMainError("Popraw błędy w danych.");
            setSubmitMetaDataLoading(false);
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        const getVideoDuration = (videoFile) => {
            return new Promise((resolve) => {
                const videoEl = document.createElement("video");
                const objectUrl = URL.createObjectURL(videoFile);

                videoEl.preload = "metadata";
                videoEl.src = objectUrl;

                videoEl.onloadedmetadata = () => {
                    resolve(Math.round(videoEl.duration));
                    URL.revokeObjectURL(objectUrl);
                };
            });
        };

        const submitMetaData = async () => {
            
            const duration = await getVideoDuration(video);
            
            const videoMetaData = {
                title,
                description,
                category: availableCategories.indexOf(selectedCategory),
                tags: tags.map(tag => tag.text),
                duration
            };
            
            try {
                const metaDataResponse = await fetch(`${api}/video/new`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(videoMetaData)
                });

                if(metaDataResponse.status === 401) {
                    navigate("/logout");
                    return null;
                }

                if(!metaDataResponse.ok) {
                    const errorData = await metaDataResponse.json();

                    if (errorData.message) {
                        setMainError(errorData.message);
                    }
                    if (errorData.errors?.Title) {
                        setError("titleError", errorData.errors.Title);
                    }
                    if (errorData.errors?.Description) {
                        setError("descriptionError", errorData.errors.Description);
                    }
                    if (errorData.errors?.Category) {
                        setError("categoryError", errorData.errors.Category);
                    }
                    if (errorData.errors?.Tags) {
                        setError("tagsError", errorData.errors.Tags);
                    }

                    return null;
                }

                const newVideoId = await metaDataResponse.text();
                return newVideoId;
            } catch {
                setMainError("Wystąpił niespodziewany błąd w trakcie przesyłania filmu. Spróbuj ponownie później.");
                return null;
            }
        }

        const newVideoId = await submitMetaData();
        setSubmitMetaDataLoading(false);
        if (!newVideoId) return;

        setVideoId(newVideoId);

        const uploadThumbnail = () => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const img = new Image();

                    img.onload = () => {
                        const TARGET_WIDTH = 512;
                        const TARGET_HEIGHT = 288;
                        const targetRatio = 16 / 9;
                        const imgRatio = img.width / img.height;

                        let sx, sy, sWidth, sHeight;

                        if (imgRatio > targetRatio) {
                            sHeight = img.height;
                            sWidth = img.height * targetRatio;
                            sx = (img.width - sWidth) / 2;
                            sy = 0;
                        } else {
                            sWidth = img.width;
                            sHeight = img.width / targetRatio;
                            sx = 0;
                            sy = (img.height - sHeight) / 2;
                        }

                        const canvas = document.createElement("canvas");
                        canvas.width = TARGET_WIDTH;
                        canvas.height = TARGET_HEIGHT;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

                        canvas.toBlob(async (blob) => {
                            if (!blob) {
                                reject("Nie udało się przekonwertować miniatury.");
                                return;
                            }

                            const formData = new FormData();
                            formData.append("thumbnail", blob, "image.webp");

                            try {
                                const thumbnailResponse = await fetch(`${api}/video/${newVideoId}/thumbnail`, {
                                    method: "PUT",
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    },
                                    body: formData
                                });

                                if (thumbnailResponse.status === 401) {
                                    setIsUploading(false);
                                    sessionStorage.removeItem("isUploading");
                                    navigate("/logout");
                                    reject("Brak autoryzacji.");
                                    return;
                                }

                                if (!thumbnailResponse.ok) {
                                    const errorData = await thumbnailResponse.json();
                                    reject(errorData.message || "Błąd przesyłania miniatury.");
                                    return;
                                }

                                resolve();
                            } catch {
                                reject("Błąd sieci podczas przesyłania miniatury.");
                            }
                        }, "image/webp", 0.8);
                    };

                    img.onerror = () => reject("Nie udało się wczytać miniatury.");

                    img.src = e.target.result;
                };

                reader.onerror = () => reject("Błąd odczytu pliku miniatury.");

                reader.readAsDataURL(thumbnail);
            });
        };
        
        try {
            setIsUploading(true);
            setUploadStarted(true);
            sessionStorage.setItem("isUploading", "1");
            
            await uploadThumbnail();

            const totalChunks = Math.ceil(video.size / CHUNK_SIZE);

            for (let i = 0; i < totalChunks; i++) {
                const videoChunk = video.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                const formData = new FormData();
                formData.append("videoChunk", videoChunk);

                let attempt = 0;

                while (attempt < 2) {
                    try {
                        const chunkResponse = await fetch(`${api}/video/chunk`, {
                            method: "POST",
                            headers: {
                                "Video-Id": newVideoId,
                                "Chunk-Index": i,
                                "Total-Chunks": totalChunks
                            },
                            credentials: "include",
                            body: formData
                        });

                        if (chunkResponse.ok) {
                            setUploadedMB(prev => prev + Math.floor(videoChunk.size / 1048576));
                            break;
                        }

                        attempt++;
                        if (attempt >= 2) {
                            throw new Error("Wystąpił niespodziewany błąd w trakcie przesyłania filmu. Spróbuj ponownie później.");
                        }
                    } catch {
                        attempt++;
                        if (attempt >= 2) {
                            throw new Error("Wystąpił niespodziewany błąd w trakcie przesyłania filmu. Spróbuj ponownie później.");
                        }
                    }
                }
            }

            setUploadSuccess(true);

        } catch (error) {
            setMainError(error.message || error);
        } finally {
            sessionStorage.removeItem("isUploading");
            setIsUploading(false);
            setVideo(null);
            setThumbnail(null);
        }
    };

    return (
        uploadStarted ? (
            <div className="mt-5 mx-auto text-center" style={{maxWidth: "700px"}}>
                <div>
                    {mainError ? (
                        <img src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_960_720.png" alt="error" style={{maxWidth: "200px"}} />
                    ) : (
                        uploadSuccess ? (
                            <img src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_960_720.png" alt="success" style={{maxWidth: "200px"}} />
                        ) : (
                            <img src="https://cdn.pixabay.com/photo/2021/10/11/00/59/upload-6699084_960_720.png" alt="upload" style={{maxWidth: "200px"}} />
                        )
                    )}
                </div>
                {uploadSuccess ? (
                    <div className="alert alert-success mt-5" role="alert">
                        Film został przesłany. Trwa jego przetwarzanie. Kiedy film zostanie przetworzony, będzie on dostępny publicznie.
                    </div>
                ) : (
                    !mainError && video && (
                        <>
                            <div className="progress mt-5">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${uploadedMB / (video.size / 1048576) * 100}%`}}>{Math.round(uploadedMB / (video.size / 1048576) * 100)}%</div>
                            </div>
                            <div className="mt-4">
                                <div>Trwa przesyłanie filmu. Nie zamykaj i nie odświeżaj strony.</div>
                                <div>Przesłano: {uploadedMB} MB / {Math.round(video.size / 1048576)} MB</div>
                            </div>
                        </>
                    )
                )}
                {mainError && (
                    <div className="alert alert-danger mt-5" role="alert">
                        {mainError}
                    </div>
                )}
            </div>
        ) : (
            <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{ maxWidth: "800px" }}>
                <h1 style={{ fontSize: "28px" }}>Nowy film</h1>
                <form className="mt-4" onSubmit={handleSubmit}>

                    {/* Wideo */}
                    <div className="mb-3">
                        <label htmlFor="video" className="form-label">Plik wideo (wymagane)</label>
                        <input
                            type="file"
                            id="video"
                            accept="video/mp4"
                            onChange={handleVideoChange}
                            className={`form-control mx-auto ${errors.videoError ? "is-invalid" : ""}`}
                            style={{ maxWidth: "500px" }}
                            autoFocus
                        />
                        <div className="form-text">Dopuszczalne typy: mp4. Zalecany format 16:9. Maksymalny rozmiar: 512 MB.</div>
                        {errors.videoError && <div className="invalid-feedback">{errors.videoError}</div>}
                    </div>

                    {/* Tytuł */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Tytuł (wymagane)</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`form-control mx-auto ${errors.titleError ? "is-invalid" : ""}`}
                            style={{ maxWidth: "500px", backgroundColor: "#f4f1f7" }}
                        />
                        {errors.titleError && <div className="invalid-feedback">{errors.titleError}</div>}
                    </div>

                    {/* Opis */}
                    <div className="mb-3" id="description-div">
                        <label htmlFor="description" className="form-label">Opis</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`form-control mx-auto ${errors.descriptionError ? "is-invalid" : ""}`}
                            rows={5}
                            cols={60}
                            maxLength={500}
                            style={{ maxWidth: "500px" }}
                            id="description"
                        />
                        <div className="form-text" id="description-counter">{description.length}/500</div>
                        {errors.descriptionError && <div className="invalid-feedback">{errors.descriptionError}</div>}
                    </div>

                    {/* Miniatura */}
                    <div className="mb-3">
                        <label htmlFor="thumbnail" className="form-label">Miniatura</label>
                        <input
                            type="file"
                            accept="image/jpeg"
                            id="thumbnail"
                            ref={thumbnailInputRef}
                            onChange={handleUserThumbnailChange}
                            className={`form-control mx-auto ${errors.thumbnailError ? "is-invalid" : ""}`}
                            style={{ maxWidth: "500px" }}
                        />
                        <div className="form-text">Dopuszczalne typy: jpg/jpeg. Zalecany format 16:9. Maksymalny rozmiar: 1 MB.</div>
                        {errors.thumbnailError && <div className="invalid-feedback">{errors.thumbnailError}</div>}
                        {userThumbnailSrc && (
                            <>
                                <div className="mt-2">
                                    <button className="btn btn-danger" onClick={handleCancelThumbnail}>Anuluj</button>
                                </div>
                                <div className="mt-2 row justify-content-center">
                                    <div className="ratio ratio-16x9 p-0" style={{maxWidth: "350px"}}>
                                        <img src={userThumbnailSrc} alt="Miniatura" className="img-fluid object-fit-cover w-100 h-100" />
                                    </div>
                                </div>
                            </>
                        )}
                        {!userThumbnailSrc && autoThumbnailSrc && (
                            <div className="mt-3 row justify-content-center">
                                <div className="ratio ratio-16x9 p-0" style={{maxWidth: "350px"}}>
                                    <img src={autoThumbnailSrc} alt="Miniatura" className="img-fluid object-fit-cover w-100 h-100" />
                                </div>
                                <div className="form-text">Automatyczna miniatura</div>
                            </div>
                        )}
                    </div>

                    {/* Kategoria */}
                    <div className="mb-3">
                        <label className="form-label" htmlFor="category">Kategoria (wymagane)</label>
                        <select
                            value={selectedCategory}
                            id="category"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`form-select mx-auto ${errors.categoryError ? "is-invalid" : ""}`}
                            style={{ maxWidth: "500px", backgroundColor: "#f4f1f7" }}
                        >
                            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        {errors.categoryError && <div className="invalid-feedback">{errors.categoryError}</div>}
                    </div>

                    {/* Tagi */}
                    <div className="mb-3" id="tags">
                        <label className="form-label">Tagi ({tags.length})</label>
                        <ReactTags
                            tags={tags}
                            delimiters={delimiters}
                            handleDelete={handleTagDelete}
                            handleAddition={handleTagAddition}
                            inputFieldPosition="bottom"
                            autocomplete
                            placeholder="Dodaj tag"
                            allowDragDrop={false}
                            autoFocus={false}
                        />
                        <div className="form-text">Umieść przecinek, enter lub spację po każdym tagu.</div>
                        {errors.tagError && <div className="invalid-feedback d-inline">{errors.tagError}</div>}
                    </div>

                    {/* Submit */}
                    <div>
                        <button type="submit" className="btn btn-primary" disabled={submitMetaDataLoading}>Prześlij</button>
                    </div>
                    {submitMetaDataLoading && (
                        <div className="spinner-border mt-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                    {mainError && (
                        <div className="text-danger mt-3">{mainError}</div>
                    )}
                </form>
            </div>
        )
    );
};

export default VideoUpload;
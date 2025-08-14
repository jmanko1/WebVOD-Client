import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import "../styles/VideoUpload.css";

const MAX_THUMBNAIL_SIZE = 1048576;
const ALLOWED_THUMBNAIL_EXT = ["jpg", "jpeg"];
const ALLOWED_THUMBNAIL_MIME = ["image/jpeg"];

const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32
};
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const VideoEdit = () => {
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [tags, setTags] = useState([]);

    const [availableCategories, setAvailableCategories] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);
    const [userThumbnailSrc, setUserThumbnailSrc] = useState("");
    const [presentThumbnailSrc, setPresentThumbnailSrc] = useState("");

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const thumbnailInputRef = useRef();

    const [success, setSuccess] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const navigate = useNavigate();
    const api = import.meta.env.VITE_API_URL;

    const capitalizeFirstLetter = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    useEffect(() => {
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
            } catch {
                setMainError("Wystąpił błąd przy pobieraniu dostępnych kategorii filmu. Spróbuj ponownie później.");
            }
        }

        document.title = "Zaktualizuj film - WebVOD";
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchVideoData = async () => {
            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${api}/video/${id}/update`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(response.status === 401) {
                    navigate("/logout");
                    return;
                }

                if(!response.ok) {
                    const errorData = await response.json();
                    setErrors((prev) => ({
                        ...prev,
                        videoData: {
                            status: response.status,
                            message: errorData.message
                        }
                    }));

                    return;
                }

                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setPresentThumbnailSrc(data.thumbnailPath);
                setUserThumbnailSrc(data.thumbnailPath);
                setSelectedCategory(capitalizeFirstLetter(data.category));

                const mappedTags = data.tags.map(tag => (
                    {
                        id: tag,
                        text: tag,
                        className: ""
                    }
                ));
                setTags(mappedTags);
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    videoData: {
                        status: 500,
                        message: "Wystąpił niespodziewany błąd. Spróbuj ponownie później."
                    }
                }));
            }
        }

        fetchVideoData();
    }, [id]);

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

    const generateUserThumbnail = (file) => {
        if (!ALLOWED_THUMBNAIL_MIME.includes(file?.type)) return;

        if (userThumbnailSrc && userThumbnailSrc.startsWith("blob:")) {
            URL.revokeObjectURL(userThumbnailSrc);
        }

        const imageUrl = URL.createObjectURL(file);
        setUserThumbnailSrc(imageUrl);
    };

    const handleUserThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        generateUserThumbnail(file);
    };

    const handleCancelThumbnail = () => {
        thumbnailInputRef.current.value = "";
        setThumbnail(null);
        setUserThumbnailSrc(presentThumbnailSrc);
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

        const isValid =
            validateTitle() &
            validateDescription() &
            validateThumbnail() &
            validateCategory();

        if (!isValid) {
            setMainError("Popraw błędy w danych.");
            return;
        }

        setUpdateLoading(true);

        const updateVideoMetaData = async () => {
            const videoMetaData = {
                title,
                description,
                category: availableCategories.indexOf(selectedCategory),
                tags: tags.map(tag => tag.text)
            };

            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return false;
            }

            try {
                const metaDataResponse = await fetch(`${api}/video/${id}/update`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    method: "PUT",
                    body: JSON.stringify(videoMetaData)
                });

                if(metaDataResponse.status === 401) {
                    navigate("/logout");
                    return false;
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

                    return false;
                }

                return true;
            } catch {
                setMainError("Wystąpił niespodziewany błąd w trakcie aktualizacji filmu. Spróbuj ponownie później.");
                return false;
            }
        };

        const updateThumbnail = async () => {
            return new Promise((resolve) => {
                if (!thumbnail) return resolve(true);

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
                                setError("thumbnailError", "Nie udało się przekonwertować miniatury.");
                                return resolve(false);
                            }

                            const formData = new FormData();
                            formData.append("thumbnail", blob, "image.webp");

                            const token = localStorage.getItem("jwt");
                            if (!token) {
                                navigate("/login");
                                return resolve(false);
                            }

                            try {
                                const thumbnailResponse = await fetch(`${api}/video/${id}/thumbnail`, {
                                    method: "PUT",
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    },
                                    body: formData
                                });

                                if (thumbnailResponse.status === 401) {
                                    navigate("/logout");
                                    return resolve(false);
                                }

                                if (!thumbnailResponse.ok) {
                                    const errorData = await thumbnailResponse.json();
                                    
                                    if (errorData.message) {
                                        setMainError(errorData.message);
                                    }
                                    if (errorData.errors?.Thumbnail) {
                                        setError("thumbnailError", errorData.errors.Thumbnail);
                                    }

                                    return resolve(false);
                                }

                                return resolve(true);
                            } catch {
                                setMainError("Wystąpił niespodziewany błąd w trakcie aktualizacji filmu. Spróbuj ponownie później.");
                                return resolve(false);
                            }
                        }, "image/webp", 0.8);
                    };

                    img.onerror = () => {
                        setMainError("Nie udało się wczytać miniatury.");
                        resolve(false);
                    };

                    img.src = e.target.result;
                };

                reader.onerror = () => {
                    setMainError("Błąd odczytu pliku miniatury.");
                    resolve(false);
                };

                reader.readAsDataURL(thumbnail);
            });
        };


        const updateMetaDataResult = await updateVideoMetaData();
        if(!updateMetaDataResult) {
            setUpdateLoading(false);
            return;
        }

        const updateThumbnailResult = await updateThumbnail();
        setUpdateLoading(false);
        if(!updateThumbnailResult)
            return;

        setSuccess("Film został pomyślnie zaktualizowany.");
    };

    if(errors.videoData) {
        return (
            <div className="mt-5 text-center">
                {errors.videoData.status === 404 ? (
                    <div>
                        <figure className="inline-block w-full">
                            <img
                                src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7899.jpg"
                                className="w-full h-auto"
                                alt="404"
                                style={{ maxWidth: "350px" }}
                            />
                            <figcaption className="mt-2">{errors.videoData.message}</figcaption>
                        </figure>
                    </div>
                ) : (
                        errors.videoData.status === 403 ? (
                            <div>
                                <figure className="inline-block w-full">
                                    <img
                                        src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_960_720.png"
                                        alt="403"
                                        className="w-full h-auto"
                                        style={{maxWidth: "200px"}}
                                    />
                                    <figcaption className="mt-4">{errors.videoData.message}</figcaption>
                                </figure>
                            </div>
                        ) : (
                            <div>{errors.videoData.message}</div>
                        )
                    )
                }
                <div className="mt-4">
                    <Link to="/videos-manager" className="text-decoration-none">Powrót</Link>
                </div>
            </div>
        )
    }

    if(success) {
        return (
            <div className="mt-5 mx-auto text-center">
                <div>
                    <figure className="inline-block w-full">
                        <img
                            src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_960_720.png"
                            alt="success"
                            className="w-full h-auto"
                            style={{maxWidth: "200px"}}
                        />
                        <figcaption className="mt-4">{success}</figcaption>
                    </figure>
                </div>
                <div className="mt-4">
                    <Link to="/videos-manager" className="text-decoration-none">Powrót</Link>
                </div>
            </div>
        );
    }

    if(!presentThumbnailSrc) {
        return (
            <div className="mt-5 mx-auto text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{ maxWidth: "800px" }}>
            <h1 style={{ fontSize: "28px" }}>Zaktualizuj film</h1>
            <form className="mt-4" onSubmit={handleSubmit}>

                {/* Tytuł */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Tytuł</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`form-control mx-auto ${errors.titleError ? "is-invalid" : ""}`}
                        style={{ maxWidth: "500px", backgroundColor: "#f4f1f7" }}
                        autoFocus
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
                    <div className="form-text">Dopuszczalne typy: jpg/jpeg. Zalecany format 16:9. Maksymalny rozmiar: 1 MB</div>
                    {errors.thumbnailError && <div className="invalid-feedback">{errors.thumbnailError}</div>}
                    {userThumbnailSrc != presentThumbnailSrc && (
                        <div className="mt-2">
                            <button className="btn btn-danger" onClick={handleCancelThumbnail}>Anuluj</button>
                        </div>
                    )}
                    <div className="mt-3 row justify-content-center">
                        <div className="ratio ratio-16x9 p-0" style={{maxWidth: "350px"}}>
                            <img src={userThumbnailSrc.startsWith("blob:") ? userThumbnailSrc : api + userThumbnailSrc} alt="Miniatura" className="img-fluid object-fit-cover w-100 h-100" />
                        </div>
                        <div className="form-text">
                            {thumbnail ? "Podgląd nowej miniatury" : "Obecna miniatura"}
                        </div>
                    </div>
                </div>

                {/* Kategoria */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="category">Kategoria</label>
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
                    <label className="form-label">Tagi</label>
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
                    <button type="submit" className="btn btn-primary" disabled={updateLoading}>Zapisz</button>
                </div>
                {updateLoading && (
                    <div className="spinner-border mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {mainError && (
                    <div className="text-danger mt-3">{mainError}</div>
                )}
            </form>
            <div className="mt-4">
                <Link to="/videos-manager" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    );
}

export default VideoEdit;
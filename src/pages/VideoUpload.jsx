import { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import "../styles/VideoUpload.css";

// Stałe
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_VIDEO_EXT = ["mp4"];
const ALLOWED_VIDEO_MIME = ["video/mp4"];
const ALLOWED_THUMBNAIL_EXT = ["jpg", "jpeg", "png"];
const ALLOWED_THUMBNAIL_MIME = ["image/jpeg", "image/png"];

const KeyCodes = {
    comma: 188,
    enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const VideoUpload = () => {
    // Stany
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);

    const [categories, setCategories] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);
    const [userThumbnailSrc, setUserThumbnailSrc] = useState(null);
    const [autoThumbnailSrc, setAutoThumbnailSrc] = useState(null);

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const thumbnailInputRef = useRef();

    // Init categories (jeśli byłyby z API)
    useEffect(() => {
        const fetchedCategories = [
            "Edukacja", "Film", "Gry", "Blog", "Muzyka", "Nauka", 
            "Rozrywka", "Sport", "Poradnik", "Podróże"
        ];

        setCategory(fetchedCategories[0]);
        setCategories(fetchedCategories);
    }, []);

    useEffect(() => {
        return () => {
          if (userThumbnailSrc) {
            URL.revokeObjectURL(userThumbnailSrc);
          }
        };
      }, [userThumbnailSrc]);

    // Pomocnicze
    const getFileExtension = (file) => file.name.split('.').pop().toLowerCase();
    const getMimeType = (file) => file.type;

    const clearError = (key) => setErrors(prev => ({ ...prev, [key]: null }));
    const setError = (key, message) => setErrors(prev => ({ ...prev, [key]: message }));

    // =========================
    // ✅ Walidacje
    // =========================

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
            return setError("videoError", "Rozmiar wideo nie może przekraczać 500 MB.") && false;

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
            return setError("thumbnailError", "Miniatura musi być JPG/PNG.") && false;

        const mime = getMimeType(thumbnail);
        if (!ALLOWED_THUMBNAIL_MIME.includes(mime))
            return setError("thumbnailError", "Nieprawidłowy typ pliku.") && false;

        if (thumbnail.size > MAX_THUMBNAIL_SIZE)
            return setError("thumbnailError", "Rozmiar miniatury nie może przekraczać 2 MB.") && false;

        return true;
    };

    const validateCategory = () => {
        clearError("categoryError");
        if (!categories.includes(category))
            return setError("categoryError", "Wybierz poprawną kategorię.") && false;

        return true;
    };

    // =========================
    // ✅ Generowanie miniatur
    // =========================

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
            console.log(file);
            setThumbnail(file);

            URL.revokeObjectURL(url);
        });
    };

    const generateUserThumbnail = (file) => {
        if (!ALLOWED_THUMBNAIL_MIME.includes(file?.type)) return;
        // Clean up poprzedniego URL
        // if (userThumbnailSrc && userThumbnailSrc.startsWith("blob:")) {
        //     URL.revokeObjectURL(userThumbnailSrc);
        // }
        const imageUrl = URL.createObjectURL(file);
        setUserThumbnailSrc(imageUrl);
    };

    // =========================
    // ✅ Obsługa zdarzeń
    // =========================

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

    const handleCancelThumbnail = (e) => {
        e.preventDefault();
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setMainError(null);
        console.log(video, title, description, thumbnail, category, tags);

        const isValid =
            validateVideo(video) &
            validateTitle() &
            validateDescription() &
            validateThumbnail() &
            validateCategory();

        if (!isValid) {
            setMainError("Popraw błędy w danych.");
            return;
        }

        console.log("✅ Przesyłanie...");
    };

    // =========================
    // ✅ JSX (UI)
    // =========================

    return (
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
                    <div className="form-text">Dopuszczalne typy: mp4. Zalecany format 16:9.</div>
                    {errors.videoError && <div className="invalid-feedback">{errors.videoError}</div>}
                </div>

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
                        accept="image/png, image/jpeg"
                        id="thumbnail"
                        ref={thumbnailInputRef}
                        onChange={handleUserThumbnailChange}
                        className={`form-control mx-auto ${errors.thumbnailError ? "is-invalid" : ""}`}
                        style={{ maxWidth: "500px" }}
                    />
                    <div className="form-text">Dopuszczalne typy: jpg/jpeg/png. Zalecany format 16:9.</div>
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
                    <label className="form-label" htmlFor="category">Kategoria</label>
                    <select
                        value={category}
                        id="category"
                        onChange={(e) => setCategory(e.target.value)}
                        className={`form-select mx-auto ${errors.categoryError ? "is-invalid" : ""}`}
                        style={{ maxWidth: "500px", backgroundColor: "#f4f1f7" }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                    <div className="form-text">Umieść przecinek po każdym tagu.</div>
                    {errors.tagError && <div className="invalid-feedback d-inline">{errors.tagError}</div>}
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary">Prześlij</button>

                {mainError && (
                    <div className="text-danger mt-3">{mainError}</div>
                )}
            </form>
        </div>
    );
};

export default VideoUpload;
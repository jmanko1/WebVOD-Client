import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

import "../styles/VideoUpload.css";

// Stałe
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_THUMBNAIL_EXT = ["jpg", "jpeg", "png"];
const ALLOWED_THUMBNAIL_MIME = ["image/jpeg", "image/png"];

const KeyCodes = {
    comma: 188,
    enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const VideoEdit = () => {
    const { id } = useParams();
    // const [video, setVideo] = useState(null);

    // Stany
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);

    const [categories, setCategories] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);
    const [userThumbnailSrc, setUserThumbnailSrc] = useState(null);
    const [presentThumbnailSrc, setPresentThumbnailSrc] = useState(null);

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const thumbnailInputRef = useRef();

    // Init categories (jeśli byłyby z API)
    useEffect(() => {
        const fetchedCategories = [
            "Edukacja", "Film", "Gry", "Blog", "Muzyka", "Nauka", 
            "Rozrywka", "Sport", "Poradnik", "Podróże"
        ];

        setCategories(fetchedCategories);

        const videoData = {
            title: "Fajny film",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            category: "Film",
            tags: ["batman", "warner", "dceu", "superman", "dc"],
            thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png"
        };

        // setVideo(videoData);
        setTitle(videoData.title);
        setDescription(videoData.description);
        setCategory(videoData.category);
        
        setTags(videoData.tags.map(tag => ({ id: tag, text: tag })));
        setUserThumbnailSrc(videoData.thumbnail);
        setPresentThumbnailSrc(videoData.thumbnail);

    }, [id]);

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

    const handleUserThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        generateUserThumbnail(file);
    };

    const handleCancelThumbnail = (e) => {
        e.preventDefault();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setMainError(null);

        console.log(title, description, thumbnail, category, tags);

        const isValid =
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
                    {userThumbnailSrc != presentThumbnailSrc && (
                        <div className="mt-2">
                            <button className="btn btn-danger" onClick={handleCancelThumbnail}>Anuluj</button>
                        </div>
                    )}
                    <div className="mt-3">
                        <img src={userThumbnailSrc} alt="Miniatura" style={{ maxWidth: "450px", maxHeight: "254px", width: "100%", height:"auto" }} />
                        <div className="form-text">
                            {thumbnail ? "Podgląd nowej miniatury" : "Obecna miniatura"}
                        </div>
                    </div>
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
                <button type="submit" className="btn btn-primary">Zapisz</button>
                
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
import { useEffect, useRef, useState } from "react";
import "../styles/VideoUpload.css";

const VideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);

    const [errors, setErrors] = useState({});

    const [categories, setCategories] = useState([]);

    const thumbnailInputRef = useRef();

    useEffect(() => {
        const options = ["Blog", "Komedia", "Gry", "Horror"];
        setCategories(options);
        setCategory(options[0]);
    }, []);

    const getFileExtension = (file) => {
        return file.name.split('.').pop().toLowerCase();
    }

    const getMimeType = (file) => {
        return file.type;
    }

    const validateVideo = () => {
        setErrors((prev) => ({...prev, ["videoError"]: null,}));

        if(video == null) {
            setErrors((prev) => ({...prev, ["videoError"]: "Wybierz plik wideo.",}));    
            return false;
        }

        const allowedExtensions = ["mp4"];
        const allowedMimeTypes = ["video/mp4"];

        const ext = getFileExtension(video);
        if (!allowedExtensions.includes(ext)) {
            setErrors((prev) => ({...prev, ["videoError"]: "Plik wideo musi być z roszerzeniem .mp4.",}));    
            return false;
        }

        const mimeType = getMimeType(video);
        if(!allowedMimeTypes.includes(mimeType)) {
            setErrors((prev) => ({...prev, ["videoError"]: "Podaj prawidłowy plik mp4.",}));
            return false;
        }

        const maxSize = 500 * 1024 * 1024 // 500 MB
        if(video.size > maxSize) {
            setErrors((prev) => ({...prev, ["videoError"]: "Rozmiar pliku wideo nie może przekraczać 500 MB.",}));
            return false;
        }

        return true;
    }

    const validateTitle = () => {
        setErrors((prev) => ({...prev, ["titleError"]: null,}));

        if(title == null || title.trim() == "") {
            setErrors((prev) => ({...prev, ["titleError"]: "Podaj tytuł filmu.",}));    
            return false;
        }

        if(title.length < 5 || title.length > 100) {
            setErrors((prev) => ({...prev, ["titleError"]: "Tytuł filmu może mieć od 5 do 100 znaków.",}));    
            return false;
        }

        return true;
    }

    const validateDescription = () => {
        setErrors((prev) => ({...prev, ["descriptionError"]: null,}));

        if(description != null && description.length > 500) {
            setErrors((prev) => ({...prev, ["descriptionError"]: "Opis filmu może mieć maksymalnie 500 znaków.",}));
            return false;  
        }

        return true;
    }

    const validateThumbnail = () => {
        setErrors((prev) => ({...prev, ["thumbnailError"]: null,}));

        if(thumbnail == null) return true;

        const allowedExtensions = ["jpg", "jpeg", "png"];
        const allowedMimeTypes = ["image/jpeg", "image/png"];

        const ext = getFileExtension(thumbnail);
        if (!allowedExtensions.includes(ext)) {
            setErrors((prev) => ({...prev, ["thumbnailError"]: "Miniatura musi być z rozszerzeniem .jpg/.jpeg/.png.",}));    
            return false;
        }

        const mimeType = getMimeType(thumbnail);
        if(!allowedMimeTypes.includes(mimeType)) {
            setErrors((prev) => ({...prev, ["thumbnailError"]: "Podaj prawidłowy plik graficzny.",}));
            return false;
        }

        const maxSize = 5 * 1024 * 1024; // 5 MB
        if(thumbnail.size > maxSize) {
            setErrors((prev) => ({...prev, ["thumbnailError"]: "Rozmiar miniatury nie może przekraczać 5 MB.",}));
            return false;
        }

        return true;
    }

    const validateCategory = () => {
        setErrors((prev) => ({...prev, ["categoryError"]: null,}));

        if(!categories.includes(category)) {
            setErrors((prev) => ({...prev, ["categoryError"]: "Wybierz prawidłową kategorię filmu.",}));
            return false;
        }
        
        return true;
    }

    const handleCancelThumbnail = () => {
        setThumbnail(null);
        thumbnailInputRef.current.value = "";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        validateVideo();
        validateTitle();
        validateDescription();
        validateThumbnail();
        validateCategory();
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "650px"}}>
            <h1 style={{fontSize: "28px"}}>Nowy film</h1>
            <form className="mt-4 mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="video" className="form-label">Plik wideo (*)</label>
                    <input
                        type="file"
                        style={{maxWidth: "500px"}}
                        onChange={(e) => setVideo(e.target.files[0])}
                        className={`form-control mx-auto ${errors.videoError ? "is-invalid" : ""}`}
                        id="video"
                    />
                    {errors.videoError &&
                        <div className="invalid-feedback">{errors.videoError}</div>                
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Tytuł (*)</label>
                    <input
                        type="text"
                        style={{maxWidth: "500px", backgroundColor: "#f4f1f7"}}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`form-control mx-auto ${errors.titleError ? "is-invalid" : ""}`}
                        id="title" 
                    />
                    {errors.titleError &&
                        <div className="invalid-feedback">{errors.titleError}</div>                
                    }
                </div>
                <div className="mb-3" id="description-div">
                    <label htmlFor="description" className="form-label">Opis</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`form-control mx-auto ${errors.descriptionError ? "is-invalid" : ""}`}
                        id="description"
                        rows={5}
                        cols={60}
                        maxLength={500}
                    >
                    </textarea>
                    <div id="description-counter">{description?.length || 0}/500</div>
                    {errors.descriptionError &&
                        <div className="invalid-feedback">{errors.descriptionError}</div>                
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="thumbnail" className="form-label">Miniatura</label>
                    <input
                        type="file"
                        ref={thumbnailInputRef}
                        style={{maxWidth: "500px"}}
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        className={`form-control mx-auto ${errors.thumbnailError ? "is-invalid" : ""}`}
                        id="thumbnail" 
                    />
                    {thumbnail && (
                        <button
                            className="btn btn-danger mt-2"
                            onClick={handleCancelThumbnail}
                        >Anuluj
                        </button>
                    )}
                    {errors.thumbnailError &&
                        <div className="invalid-feedback">{errors.thumbnailError}</div>                
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Kategoria (*)</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`form-select mx-auto ${errors.categoryError ? "is-invalid" : ""}`}
                        style={{maxWidth: "500px", backgroundColor: "#f4f1f7"}}
                    >
                        {categories.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {errors.categoryError &&
                        <div className="invalid-feedback">{errors.categoryError}</div>                
                    }
                </div>
                <button type="submit" className="btn btn-primary">Prześlij</button>
            </form>
        </div>
    );
}

export default VideoUpload;
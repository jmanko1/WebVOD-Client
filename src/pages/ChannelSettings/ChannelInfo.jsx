import ChannelSettingsMenu from "../../components/ChannelSettings/ChannelSettingsMenu";
import { useEffect, useRef, useState } from "react";

import "../../styles/ChannelInfo.css";

const ChannelInfo = () => {
    const [userData, setUserData] = useState(null);

    const [newDescription, setNewDescription] = useState("");
    const [newImage, setNewImage] = useState(null);

    const [viewedImage, setViewedImage] = useState(null);
    const imageRef = useRef();
    const maxImageSize = 2 * 1024 * 1024; // 2 MB
    const allowedImageExts = ["jpg", "jpeg", "png"];
    const allowedImageMimes = ["image/jpeg", "image/png"];

    const [errors, setErrors] = useState({});
    const clearError = (key) => setErrors(prev => ({ ...prev, [key]: null }));
    const setError = (key, message) => setErrors(prev => ({ ...prev, [key]: message }));

    const [success, setSuccess] = useState(null);

    const maxDescriptionLength = 60;

    useEffect(() => {
        const data = {
            id: 1,
            login: "tomek123",
            email: "tomek123@gmail.com",
            description: "Welcome to The Silent Strategist—the ultimate channel for mastering power, control, and influence through Stoicism and Dark Psychology. Power isn’t given—it’s taken. If you want to stay two steps ahead in relationships, command respect, and build an unshakable mindset, we provide proven psychological tactics to help you dominate every aspect of life. Inspired by Machiavelli, Sun Tzu, and Marcus Aurelius, we focus on No Contact, emotional detachment, power moves, and silent influence—helping you turn pain into power and make them regret underestimating you.",
            imageURL: null,
            signupDate: "2025-01-25"
        }

        if(!data.description)
            data.description = "Brak opisu";

        setUserData(data);
        setViewedImage(data.imageURL ? data.imageURL : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg");
    }, []);

    const submitDescription = (e) => {
        e.preventDefault();
        setSuccess(null);
        clearError("descriptionError");

        if(!newDescription.trim()) {
            setError("descriptionError", "Podaj opis.");
            return;
        }

        if(newDescription.length > 500) {
            setError("descriptionError", "Nowy opis może mieć maksymalnie 500 znaków.");
            return;
        }

        setUserData((prevData) => ({
            ...prevData,
            description: newDescription
        }));

        setNewDescription("");

        const modalElement = document.getElementById("descriptionModal");
        const modal = window.bootstrap.Modal.getInstance(modalElement) || window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
        
        setSuccess("Opis kanału został zaktualizowany.");
        setTimeout(() => {
            setSuccess(null);
        }, 2000);
    }

    const generateImageView = (file) => {
        if (!allowedImageMimes.includes(file?.type)) return;

        if (viewedImage && viewedImage.startsWith("blob:")) {
            URL.revokeObjectURL(viewedImage);
        }

        const imageUrl = URL.createObjectURL(file);
        setViewedImage(imageUrl);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewImage(file);
        generateImageView(file);
    }

    const getFileExtension = (file) => file.name.split('.').pop().toLowerCase();
    const getMimeType = (file) => file.type;

    const submitImage = (e) => {
        e.preventDefault();

        clearError("imageError");

        if (!newImage) {
            setError("imageError", "Wybierz zdjęcie.");
            return;
        }

        const ext = getFileExtension(newImage);
        if(!allowedImageExts.includes(ext)) {
            setError("imageError", "Nieprawidłowe rozszerzenie pliku.");
            return;
        }

        const mime = getMimeType(newImage);
        if(!allowedImageMimes.includes(mime)) {
            setError("imageError", "Nieprawidłowy typ pliku.");
            return;
        }

        if (newImage.size > maxImageSize) {
            setError("imageError", "Rozmiar pliku nie może przekraczać 2 MB.");
            return;
        }

        const modalElement = document.getElementById("imageModal");
        const modal = window.bootstrap.Modal.getInstance(modalElement) || window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();

        setUserData((prevData) => ({
            ...prevData,
            imageURL: viewedImage
        }));

        setNewImage(null);
        imageRef.current.value = "";
        setSuccess("Zdjęcie profilowe zostało zaktualizowane.");
        setTimeout(() => {
            setSuccess(null);
        }, 2000);
    }

    if(!userData) {
        return <p>Ładowanie...</p>
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-3 offset-1 border-end border-secondary">
                        <ChannelSettingsMenu element={0} />
                    </div>
                    <div className="col-7">
                        <div className="box-title">
                            <h1>Informacje o kanale</h1>
                        </div>
                        <div className="box-description">
                            Zarządzaj adresem email przypisanym do Twojego konta, opisem kanału i zdjęciem profilowym.
                        </div>
                        {success && (
                            <div className="text-success">
                                {success}
                            </div>
                        )}
                        <div className="box mt-3">
                            <div className="item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="label">Nazwa użytkownika</div>
                                    <div className="subtext">{userData.login}</div>
                                </div>
                            </div>
                            <div className="item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="label">Adres email</div>
                                    <div className="subtext">{userData.email}</div>
                                </div>
                            </div>
                            <div style={{ cursor: "pointer" }} className="item d-flex justify-content-between align-items-center" data-bs-toggle="modal" data-bs-target="#descriptionModal">
                                <div>
                                    <div className="label">Opis kanału</div>
                                    <div className="subtext">
                                        {userData.description.length > maxDescriptionLength ? (
                                            userData.description.slice(0, maxDescriptionLength) + "..."
                                        ) : (
                                            userData.description
                                        )}
                                    </div>
                                </div>
                                <i className="arrow fa-solid fa-chevron-right"></i>
                            </div>
                            <div style={{ cursor: "pointer" }} className="item d-flex justify-content-between align-items-center" data-bs-toggle="modal" data-bs-target="#imageModal">
                                <div>
                                    <div className="label">Zdjęcie profilowe</div>
                                </div>
                                <i className="arrow fa-solid fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="descriptionModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title fs-5" id="descriptionModalLabel">Zmiana opisu kanału</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body mt-2 mb-2">
                            <form onSubmit={submitDescription}>
                                <div className="new-description-div">
                                    <label className="form-label">Nowy opis kanału</label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className={`mx-auto new-description-textarea form-control ${errors.descriptionError ? "is-invalid" : ""}`}
                                        rows={7}
                                        maxLength={500}
                                    />
                                    <div 
                                        className="form-text new-description-counter"
                                        style={errors.descriptionError ? { bottom: "30px" } : {}}
                                    >
                                        {newDescription.length}/500
                                    </div>
                                    {errors.descriptionError && <div className="invalid-feedback">{errors.descriptionError}</div>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
                            <button onClick={submitDescription} type="button" className="btn btn-primary">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="imageModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title fs-5" id="imageModalLabel">Zmiana zdjęcia profilowego</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body mt-2 mb-2 text-center">
                            <form onSubmit={submitImage}>
                                <div className="mb-2">
                                    <img src={viewedImage} alt="Zdjęcie profilowe" style={{ maxWidth: "150px", maxHeight: "150px", width: "100%", height:"auto" }} />
                                    <div className="form-text">
                                        {newImage ? "Podgląd nowego zdjęcia profilowego" : "Obecne zdjęcie profilowe"}
                                    </div>
                                </div>
                                <div className="new-description-div">
                                    <label className="form-label">Nowe zdjęcie profilowe</label>
                                    <input
                                        type="file"
                                        id="video"
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageChange}
                                        className={`form-control mx-auto ${errors.imageError ? "is-invalid" : ""}`}
                                        ref={imageRef}
                                    />
                                    <div className="form-text">Dopuszczalne typy: jpg/jpeg/png. Zalecany format 1:1.</div>
                                    {errors.imageError && <div className="invalid-feedback">{errors.imageError}</div>}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
                            <button onClick={submitImage} type="button" className="btn btn-primary">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChannelInfo;
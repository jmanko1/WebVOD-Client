import ChannelSettingsMenu from "../../components/ChannelSettings/ChannelSettingsMenu";
import { useEffect, useRef, useState } from "react";

import "../../styles/ChannelInfo.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const ChannelInfo = () => {
    const { user, setUser } = useUser();

    const [newDescription, setNewDescription] = useState("");
    const [newImage, setNewImage] = useState(null);

    const [viewedImage, setViewedImage] = useState(null);
    const imageRef = useRef();
    
    const maxNewDescriptionLength = 1000;
    const maxImageSize = 1048576; // 1 MB
    const allowedImageExts = ["jpg", "jpeg"];
    const allowedImageMimes = ["image/jpeg"];
    const api = import.meta.env.VITE_API_URL;

    const [errors, setErrors] = useState({});
    const clearError = (key) => setErrors(prev => ({ ...prev, [key]: null }));
    const setError = (key, message) => setErrors(prev => ({ ...prev, [key]: message }));

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [mainError, setMainError] = useState(null);

    const maxVisibleDescriptionLength = 60;

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/login");
            return;
        }

        if (user) {
            setViewedImage(user.imageUrl);
        }

        document.title = "Ustawienia - WebVOD";
    }, [user]);

    const hideDescriptionModal = () => {
        const modalElement = document.getElementById("descriptionModal");
        const modal = window.bootstrap.Modal.getInstance(modalElement) || window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
    }

    const hideImageModal = () => {
        const modalElement = document.getElementById("imageModal");
        const modal = window.bootstrap.Modal.getInstance(modalElement) || window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
    }

    const submitDescription = async (e) => {
        e.preventDefault();

        setSuccess(null);
        setMainError(null);
        clearError("descriptionError");

        if(!newDescription.trim()) {
            setError("descriptionError", "Podaj opis.");
            return;
        }

        if(newDescription.length > maxNewDescriptionLength) {
            setError("descriptionError", `Opis kanału może mieć maksymalnie ${maxNewDescriptionLength} znaków.`);
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token) {
            hideDescriptionModal();
            navigate("/logout");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${api}/user/my-profile/description`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newDescription)
            });

            if(response.status == 401) {
                hideDescriptionModal();
                navigate("/logout");
                return;
            }

            if(!response.ok) {
                const errorData = await response.json();

                if (errorData.message) {
                    setMainError(errorData.message);
                }
                else if (errorData.errors?.description) {
                    setError("descriptionError", errorData.errors.description[0]);
                }

                return;
            }

            if(response.ok) {
                setUser((prev) => ({
                    ...prev,
                    "description": newDescription
                }));

                setNewDescription("");
                hideDescriptionModal();
                
                setSuccess("Opis kanału został zaktualizowany.");
                setTimeout(() => {
                    setSuccess(null);
                }, 4000);
            }
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
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

    const submitImage = async (e) => {
        e.preventDefault();

        setSuccess(null);
        setMainError(null);
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
            setError("imageError", `Rozmiar pliku nie może przekraczać ${maxImageSize / 1024 / 1024} MB.`);
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token) {
            hideImageModal();
            navigate("/logout");
            return;
        }

        setLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const MAX_DIM = 512;

                const size = Math.min(img.width, img.height);
                const sx = (img.width - size) / 2;
                const sy = (img.height - size) / 2;

                const canvas = document.createElement("canvas");
                canvas.width = MAX_DIM;
                canvas.height = MAX_DIM;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(
                    img,
                    sx, sy, size, size,
                    0, 0, MAX_DIM, MAX_DIM
                );

                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        setMainError("Nie udało się przekonwertować obrazu.");
                        setLoading(false);
                        return;
                    }

                    const formData = new FormData();
                    formData.append("image", blob, "image.webp");

                    try {
                        const response = await fetch(`${api}/user/my-profile/image`, {
                            method: "PUT",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            },
                            body: formData
                        });

                        if (response.status === 401) {
                            hideImageModal();
                            navigate("/logout");
                            return;
                        }

                        if (!response.ok) {
                            const errorData = await response.json();
                            if (errorData.message) {
                                setMainError(errorData.message);
                            }
                            return;
                        }

                        const newImageUrl = await response.text();
                        setUser((prev) => ({
                            ...prev,
                            imageUrl: api + newImageUrl
                        }));

                        hideImageModal();
                        setNewImage(null);
                        imageRef.current.value = "";
                        setSuccess("Zdjęcie profilowe zostało zaktualizowane.");
                        setTimeout(() => {
                            setSuccess(null);
                        }, 4000);
                    } catch {
                        setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
                    } finally {
                        setLoading(false);
                    }

                }, "image/webp", 0.8);
            };

            img.onerror = () => {
                setMainError("Nie udało się wczytać obrazu.");
                setLoading(false);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(newImage);
    }

    if(!user) {
        return;
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
                            <div class="alert alert-success mt-3" role="alert">
                                {success}
                            </div>
                        )}
                        <div className="box mt-3">
                            <div className="item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="label">Nazwa użytkownika</div>
                                    <div className="subtext">{user.login}</div>
                                </div>
                            </div>
                            <div className="item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="label">Adres email</div>
                                    <div className="subtext">{user.email}</div>
                                </div>
                            </div>
                            <div style={{ cursor: "pointer" }} className="item d-flex justify-content-between align-items-center" data-bs-toggle="modal" data-bs-target="#descriptionModal">
                                <div>
                                    <div className="label">Opis kanału</div>
                                    <div className="subtext">
                                        {user.description.length > maxVisibleDescriptionLength ? (
                                            user.description.slice(0, maxVisibleDescriptionLength) + "..."
                                        ) : (
                                            user.description
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
                                        maxLength={maxNewDescriptionLength}
                                    />
                                    <div 
                                        className="form-text new-description-counter"
                                        style={errors.descriptionError ? { bottom: "30px" } : {}}
                                    >
                                        {newDescription.length}/{maxNewDescriptionLength}
                                    </div>
                                    {errors.descriptionError && <div className="invalid-feedback">{errors.descriptionError}</div>}
                                </div>
                                {loading && (
                                    <div className="text-center">
                                        <div className="spinner-border mt-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {mainError && (
                                    <div className="text-center text-danger mt-2">
                                        {mainError}
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Zamknij</button>
                            <button onClick={submitDescription} disabled={loading} type="button" className="btn btn-primary">Zapisz</button>
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
                                <div className="mb-2 row justify-content-center">
                                    <div className="ratio ratio-1x1 p-0" style={{maxWidth: "150px"}}>
                                        <img src={viewedImage} alt="Zdjęcie profilowe" className="img-fluid object-fit-cover w-100 h-100 rounded-circle" />
                                    </div>
                                    <div className="form-text">
                                        {newImage ? "Podgląd nowego zdjęcia profilowego" : "Obecne zdjęcie profilowe"}
                                    </div>
                                </div>
                                <div className="new-description-div">
                                    <label className="form-label">Nowe zdjęcie profilowe</label>
                                    <input
                                        type="file"
                                        id="video"
                                        accept="image/jpeg"
                                        onChange={handleImageChange}
                                        className={`form-control mx-auto ${errors.imageError ? "is-invalid" : ""}`}
                                        ref={imageRef}
                                    />
                                    <div className="form-text">Dopuszczalne typy: jpg/jpeg. Maksymalny rozmiar: {maxImageSize / 1024 / 1024} MB. Zalecany format 1:1.</div>
                                    {errors.imageError && <div className="invalid-feedback">{errors.imageError}</div>}
                                </div>
                                {loading && (
                                    <div className="text-center">
                                        <div className="spinner-border mt-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {mainError && (
                                    <div className="text-center text-danger mt-2">
                                        {mainError}
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Zamknij</button>
                            <button onClick={submitImage} disabled={loading} type="button" className="btn btn-primary">Zapisz</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChannelInfo;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/VideosManager.css";
import { formatDate, formatDuration } from "../utils/datetime";

const VideosManager = () => {
    const [userVideos, setUserVideos] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [userVideosLoading, setUserVideosLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const [titlePatternInput, setTitlePatternInput] = useState("");
    const [titlePattern, setTitlePattern] = useState("");

    const [idToRemove, setIdToRemove] = useState(null);

    const [error, setError] = useState(null);
    const [removeError, setRemoveError] = useState(null);
    const [removeSuccess, setRemoveSuccess] = useState(null);
    const [removeLoading, setRemoveLoading] = useState(false);

    const navigate = useNavigate();

    const maxTitleLength = 50;
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
         const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        document.title = "Menedżer filmów - WebVOD";
    }, []);

    useEffect(() => {
        const fetchUserVideos = async () => {
            if(isScrollEnd)
                return;

            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            setUserVideosLoading(true);
    
            try {
                const response = await fetch(`${api}/user/my-profile/videos?page=${page}&size=${size}${titlePattern ? "&search=" + titlePattern : ""}`, {
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
                    setError(errorData.message);
                    return;
                }

                const data = await response.json();

                if(data.length < size)
                    setIsScrollEnd(true);
                
                setUserVideos((prev) => [...prev, ...data]);
            } catch {
                setError("Wystąpił niespodziewany błąd w trakcie pobierania filmów. Spróbuj ponownie później.");
            } finally {
                setUserVideosLoading(false);
            }
        };

        fetchUserVideos();
    }, [page, isScrollEnd]);

    useEffect(() => {
        const handleScroll = () => {
        if (userVideosLoading || isScrollEnd) return;

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [userVideosLoading, isScrollEnd]);

    const handleVideoDelete = async () => {
        if(!idToRemove) return;

        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        setRemoveError(null);
        setRemoveSuccess(null);
        setRemoveLoading(true);

        try {
            const response = await fetch(`${api}/video/${idToRemove}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                method: "DELETE"
            });

            if(response.status === 401) {
                navigate("/logout");
                return;
            }

            if(!response.ok) {
                const errorData = await response.json();
                if(errorData.message) {
                    setRemoveError(errorData.message);
                    setTimeout(() => setRemoveError(null), 4000);
                }

                return;
            }

            setRemoveSuccess("Film został pomyślnie usunięty.");
            setUserVideos(userVideos.filter(video => video.id !== idToRemove));

            setTimeout(() => setRemoveSuccess(null), 4000);
        } catch {
            setRemoveError("Wystąpił niespodziewany błąd w trakcie usuwania filmu. Spróbuj ponownie później.");
            setTimeout(() => setRemoveError(null), 4000);
        } finally {
            setRemoveLoading(false);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();

        setTitlePattern(titlePatternInput);
        setUserVideos([]);
        setPage(1);
        setIsScrollEnd(false);
    }

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col">
                    <form onSubmit={handleSearch} className="d-flex" role="search">
                        <input
                            className="form-control rounded-end-0 border border-end-0 border-secondary"
                            style={{ width: "300px" }}
                            type="search"
                            placeholder="Wyszukaj..."
                            value={titlePatternInput}
                            onChange={(e) => setTitlePatternInput(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary rounded-start-0" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>
            {error ? (
                <div className="mt-4 text-center alert alert-danger" role="alert">
                    {error}
                </div>
            ) : (
                <>
                    {removeLoading && (
                        <div className="text-center mb-3">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {removeError && (
                        <div className="text-center alert alert-danger mb-3" role="alert">
                            {removeError}
                        </div>
                    )}
                    {removeSuccess && (
                        <div className="text-center alert alert-success mb-3" role="alert">
                            {removeSuccess}
                        </div>                        
                    )}
                    {userVideos.map((video) => {
                        const isPublished = video.status === "PUBLISHED";
                        return (
                            <div className="row align-items-center mb-4 mb-lg-3" key={video.id}>
                                <div className="col-12 col-lg-2">
                                    <div className="ratio ratio-16x9">
                                        {isPublished ? (
                                            <Link to={`/videos/${video.id}`}>
                                                <img
                                                    className="img-fluid object-fit-cover w-100 h-100"
                                                    src={api + video.thumbnailPath}
                                                    alt="Miniatura"
                                                />
                                                <span className="videos-manager-thumbnail-duration">
                                                    {formatDuration(video.duration)}
                                                </span>
                                            </Link>
                                        ) : (
                                            <img
                                                className="img-fluid object-fit-cover w-100 h-100"
                                                alt="Uwaga"
                                                src="https://cdn.pixabay.com/photo/2021/09/07/11/12/caution-6603630_960_720.jpg"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 col-lg-2 videos-manager-title mt-2 mt-lg-0">
                                    {isPublished ? (
                                        <Link to={`/videos/${video.id}`}>
                                            {video.title.length > maxTitleLength
                                                ? video.title.slice(0, maxTitleLength) + "..."
                                                : video.title}
                                        </Link>
                                    ) : (
                                        video.title.length > maxTitleLength
                                            ? video.title.slice(0, maxTitleLength) + "..."
                                            : video.title
                                    )}
                                </div>

                                {isPublished ? (
                                    <>
                                        <div className="col-12 col-lg-2 text-lg-center">
                                            {video.viewsCount.toLocaleString("pl-PL")} wyświetleń
                                        </div>
                                        <div className="col-12 col-lg-2 text-lg-center">
                                            {formatDate(video.uploadDate)}
                                        </div>
                                        <div className="d-none d-lg-inline col-lg-2 text-lg-center mt-2 mt-lg-0">
                                            <Link className="btn btn-primary" role="button" to={`/videos-manager/${video.id}`}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                <span className="ms-1">Edytuj</span>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col-12 col-lg-6 text-lg-center">
                                        Przesyłanie filmu trwa lub zostało przerwane.
                                    </div>
                                )}

                                <div className={`d-none d-lg-inline col-lg-2 text-lg-center mt-2 mt-lg-0`}>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => setIdToRemove(video.id)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteConfirmModal"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                        <span className="ms-1">Usuń</span>
                                    </button>
                                </div>

                                <div className="col-12 mt-2 d-inline d-lg-none">
                                    {isPublished && (
                                        <Link className="btn btn-primary" role="button" to={`/videos-manager/${video.id}`}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                            <span className="ms-1">Edytuj</span>
                                        </Link>
                                    )}
                                    <button
                                        className={`btn btn-danger ${isPublished ? "ms-2" : ""}`}
                                        onClick={() => setIdToRemove(video.id)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteConfirmModal"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                        <span className="ms-1">Usuń</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {userVideosLoading && (
                        <div className="text-center mt-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </>
            )}
            

            <div className="modal fade" id="deleteConfirmModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Potwierdzenie usunięcia filmu</h5>
                        <button onClick={() => setIdToRemove(null)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Czy na pewno chcesz usunąć wybrany film? Tej czynności nie będzie można cofnąć.</p>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => setIdToRemove(null)} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Anuluj</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleVideoDelete}>Usuń</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default VideosManager;
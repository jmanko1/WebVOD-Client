import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/VideosManager.css";
import { formatDate, formatDatetime, formatDuration } from "../utils/datetime";

const VideosManager = () => {
    const [userVideos, setUserVideos] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [userVideosLoading, setUserVideosLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const [titlePatternInput, setTitlePatternInput] = useState("");
    const [titlePattern, setTitlePattern] = useState("");

    const [idToRemove, setIdToRemove] = useState(null);
    const [videoIdForTagsModal, setVideoIdForTagsModal] = useState(null);
    const [videoTitleForTagsModal, setVideoTitleForTagsModal] = useState(null);

    const [error, setError] = useState(null);
    const [removeError, setRemoveError] = useState(null);
    const [removeSuccess, setRemoveSuccess] = useState(null);
    const [removeLoading, setRemoveLoading] = useState(false);


    const [proposals, setProposals] = useState([]);
    const [currentProposalsPage, setCurrentProposalsPage] = useState(1);
    const [hasMoreProposals, setHasMoreProposals] = useState(true);
    const [proposalsLoading, setProposalsLoading] = useState(false);
    const [proposalsError, setProposalsError] = useState(null);
    const [proposalsSuccess, setProposalsSuccess] = useState(null);

    const proposalsListRef = useRef(null);

    const navigate = useNavigate();

    const maxTitleLength = 50;
    const api = import.meta.env.VITE_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"

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
    }, [page, isScrollEnd, titlePattern]);

    useEffect(() => {
        setUserVideos([]);
        setPage(1);
        setUserVideosLoading(false);
        setIsScrollEnd(false);
    }, [titlePattern]);

    useEffect(() => {
        setProposals([]);
        setCurrentProposalsPage(1);
        setProposalsLoading(false);
        setHasMoreProposals(true);

        setProposalsError(null);
        setProposalsSuccess(null);
    }, [videoIdForTagsModal]);

    useEffect(() => {
        const handleScroll = () => {
            if (userVideosLoading || isScrollEnd) return;

            const scrollTop = window.scrollY || window.pageYOffset;
            const clientHeight = window.innerHeight;
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
        setUserVideosLoading(false)
    }

    useEffect(() => {
        const fetchTagsPropositions = async () => {
            if(!hasMoreProposals || !videoIdForTagsModal)
                return;

            setProposalsLoading(true);
    
            const token = localStorage.getItem("jwt");
            if (!token)
                return;

            try {
                const response = await fetch(`${api}/video/${videoIdForTagsModal}/tag-proposals?page=${currentProposalsPage}&size=${size}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(response.ok) {
                    const data = await response.json();

                    if(data.length < size)
                        setHasMoreProposals(false);
                    
                    setProposals((prev) => [...prev, ...data]);
                }
            } catch {
                setProposalsError("Wystąpił niespodziewany błąd w trakcie pobierania propozycji tagów.");
            } finally {
                setProposalsLoading(false);
            }
        };

        fetchTagsPropositions();
    }, [videoIdForTagsModal, currentProposalsPage, hasMoreProposals]);

    useEffect(() => {
        const container = proposalsListRef.current;
        if (!container || !videoIdForTagsModal) return;

        const handleScroll = () => {
            if (proposalsLoading || !hasMoreProposals) return;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10)
                setCurrentProposalsPage(prev => prev + 1);
        };
        
        container.addEventListener('scroll', handleScroll);

        return () => container.removeEventListener('scroll', handleScroll);
    }, [videoIdForTagsModal, proposalsLoading, hasMoreProposals]);

    const accept = async (id) => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        setProposalsSuccess(null);
        setProposalsError(null);

        try {
            const response = await fetch(`${api}/video/tag-proposals/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 401) {
                navigate("/logout");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message) {
                    setProposalsError(errorData.message);
                }

                return;
            }

            const videoId = proposals.find(p => p.id === id)?.videoId;

            setProposalsSuccess("Propozycja tagów została zaakceptowana.");
            setProposals(proposals.filter(p => p.id !== id));
            setUserVideos(prev =>
                prev.map(v =>
                    v.id === videoId ? { ...v, tagsPropositionsCount: (v.tagsPropositionsCount ?? 0) - 1 } : v
                )
            );

        } catch {
            setProposalsError("Wystąpił niespodziewany błąd.")
        }
    }

    const reject = async (id) => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        setProposalsSuccess(null);
        setProposalsError(null);

        try {
            const response = await fetch(`${api}/video/tag-proposals/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 401) {
                navigate("/logout");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message) {
                    setProposalsError(errorData.message);
                }

                return;
            }

            const videoId = proposals.find(p => p.id === id)?.videoId;

            setProposalsSuccess("Propozycja tagów została odrzucona.");
            setProposals(proposals.filter(p => p.id !== id));
            setUserVideos(prev =>
                prev.map(v =>
                    v.id === videoId ? { ...v, tagsPropositionsCount: (v.tagsPropositionsCount ?? 0) - 1 } : v
                )
            );
        } catch {
            setProposalsError("Wystąpił niespodziewany błąd.")
        }
    }

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col">
                    <h1 style={{fontSize: "28px"}}>Menedżer filmów</h1>
                </div>
            </div>
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
                <div className="mt-3 text-center row">
                    <div className="col">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {removeLoading && (
                        <div className="row text-center mb-3">
                            <div className="col">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {removeError && (
                        <div className="row text-center mb-3">
                            <div className="col">
                                <div className="alert alert-danger" role="alert">
                                    {removeError}
                                </div>
                            </div>
                        </div>
                    )}
                    {removeSuccess && (
                        <div className="row text-center mb-3">
                            <div className="col">
                                <div className="alert alert-success" role="alert">
                                    {removeSuccess}
                                </div>  
                            </div>
                        </div>
                    )}
                    {userVideos.map((video) => {
                        const isPublished = video.status === "PUBLISHED";
                        return (
                            <div className="row align-items-center mb-4 mb-xl-3" key={video.id}>
                                <div className="col-12 col-xl-2">
                                    <div className="ratio ratio-16x9">
                                        {isPublished ? (
                                            <Link to={`/videos/${video.id}`}>
                                                <img
                                                    className="img-fluid object-fit-cover w-100 h-100"
                                                    src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath}
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

                                <div className="col-12 col-xl-2 videos-manager-title mt-2 mt-xl-0">
                                    {isPublished ? (
                                        <Link to={`/videos/${video.id}`} title={video.title}>
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
                                        <div className="col-12 col-xl-2 text-xl-center">
                                            {video.viewsCount.toLocaleString("pl-PL")} wyświetleń
                                        </div>
                                        <div className="col-12 col-xl-2 text-xl-center">
                                            {formatDate(video.uploadDate)}
                                        </div>
                                        <div className="col-12 col-xl-4 text-xl-center mt-2 mt-xl-0">
                                            {video.tagsProposalsEnabled && (
                                                <button
                                                    className="btn btn-success me-2 me-xl-1"
                                                    role="button"
                                                    onClick={() => {setVideoIdForTagsModal(video.id); setVideoTitleForTagsModal(video.title)}}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#videoManagerTagProposalsModal"
                                                >
                                                    <i className="fa-solid fa-tags"></i>
                                                    <span className="ms-1">Propozycje tagów{video.tagsPropositionsCount > 0 && ` (${video.tagsPropositionsCount})`}</span>
                                                </button>
                                            )}
                                            <Link className={`${!video.tagsProposalsEnabled ? "offset-xl-5" : ""} btn btn-primary me-xl-1`} role="button" to={`/videos-manager/${video.id}`}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                <span className="ms-1">Edytuj</span>
                                            </Link>
                                            <button
                                                className="btn btn-danger ms-2 ms-xl-0"
                                                onClick={() => setIdToRemove(video.id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteConfirmModal"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                                <span className="ms-1">Usuń</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    video.status === "FAILED" ? (
                                        <>
                                            <div className="col-12 col-xl-6 text-xl-center">
                                                Przesyłanie/Przetwarzanie filmu zakończyło się niepowodzeniem.
                                            </div>
                                            <div className="col-xl-2 text-xl-center mt-2 mt-xl-0">
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
                                        </>
                                    ) : (
                                        video.status === "UPLOADING" ? (
                                            <div className="col-12 col-xl-6 text-xl-center">
                                                Film jest w trakcie przesyłania.
                                            </div>
                                        ) : (
                                            <div className="col-12 col-xl-6 text-xl-center">
                                                Film jest w trakcie przetwarzania.
                                            </div>
                                        )
                                    )
                                )}

                                {/* <div className="col-12 mt-2 d-inline d-xl-none">
                                    {isPublished ? (
                                        <>
                                            <button
                                                className="btn btn-success me-2"
                                                role="button"
                                                onClick={() => {setVideoIdForTagsModal(video.id); setVideoTitleForTagsModal(video.title)}}
                                                data-bs-toggle="modal"
                                                data-bs-target="#videoManagerTagProposalsModal"
                                            >
                                                <i className="fa-solid fa-tags"></i>
                                                <span className="ms-1">Propozycje tagów{video.tagsPropositionsCount > 0 && ` (${video.tagsPropositionsCount})`}</span>
                                            </button>
                                            <Link className="btn btn-primary" role="button" to={`/videos-manager/${video.id}`}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                <span className="ms-1">Edytuj</span>
                                            </Link>
                                            <button
                                                className={`btn btn-danger ${isPublished ? "ms-2" : ""}`}
                                                onClick={() => setIdToRemove(video.id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteConfirmModal"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                                <span className="ms-1">Usuń</span>
                                            </button>
                                        </>
                                    ) : (
                                        video.status === "FAILED" && 
                                        <button
                                            className={`btn btn-danger ${isPublished ? "ms-2" : ""}`}
                                            onClick={() => setIdToRemove(video.id)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteConfirmModal"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                            <span className="ms-1">Usuń</span>
                                        </button>
                                    )}
                                </div> */}
                            </div>
                        );
                    })}
                    {userVideosLoading && (
                        <div className="row mt-4 text-center">
                            <div className="col">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="modal fade" id="videoManagerTagProposalsModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Propozycje tagów dla filmu {videoTitleForTagsModal}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <ul ref={proposalsListRef} className="list-group" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {proposals.map((p) => (
                                    <li className="list-group-item" key={p.id}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <a 
                                                        href={`/channels/${p.author.login}`}
                                                        style={{ textDecoration: "none" }}
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-black"
                                                    >
                                                        <img
                                                            src={api + p.author.imageUrl}
                                                            alt={p.author.login}
                                                            className="rounded-circle me-2"
                                                            width="36"
                                                            height="36"
                                                        />
                                                    </a>
                                                    <a 
                                                        href={`/channels/${p.author.login}`}
                                                        style={{ textDecoration: "none" }}
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-black fw-bold"
                                                    >
                                                        {p.author.login}
                                                    </a>
                                                </div>
                                                <small className="text-muted d-block">
                                                    Zgłoszono: {formatDatetime(p.createdAt)}
                                                </small>
                                                <small className="text-muted d-block mb-2">
                                                    Ważne do: {formatDatetime(p.validUntil)}
                                                </small>
                                                <div className="mb-2">
                                                    {p.tags.map((tag) => (
                                                        <span className="badge bg-primary me-1" key={tag}>
                                                        {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                {p.comment && (
                                                    <p className="fst-italic mb-1">Komentarz: {p.comment}</p>
                                                )}
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => accept(p.id)}
                                                >
                                                    Akceptuj
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => reject(p.id)}
                                                >
                                                    Odrzuć
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {proposalsLoading && (
                                    <div className="text-center mt-2">
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <div className="modal-footer d-flex justify-content-between align-items-center">
                            <div>
                                {proposalsSuccess && !proposalsError && (
                                    <div className="text-success">
                                        {proposalsSuccess}
                                    </div>
                                )}
                                {!proposalsSuccess && proposalsError && (
                                    <div className="text-danger">
                                        {proposalsError}
                                    </div>                                
                                )}
                            </div>
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
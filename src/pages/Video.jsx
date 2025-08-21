import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { useUser } from "../contexts/UserContext";
import { formatDate, formatDatetime } from "../utils/datetime";

import "../styles/Video.css";

const Video = () => {
    const { id } = useParams();
    const { user } = useUser();

    const [watchedVideo, setWatchedVideo] = useState(null);
    
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [recommendedVideosLoading, setRecommendedVideosLoading] = useState(false);

    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);
    const commentsRef = useRef();

    const [newComment, setNewComment] = useState("");
    const [newCommentSubmitLoading, setNewCommentSubmitLoading] = useState(false);
    const [newCommentSubmitSuccess, setNewCommentSubmitSuccess] = useState(null);

    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    // const [saved, setSaved] = useState(false);

    const [pressedLike, setPressedLike] = useState(false);
    // const [pressedSave, setPressedSave] = useState(false);

    const [descriptionSliced, setDescriptionSliced] = useState(true);

    const [videoLoading, setVideoLoading] = useState(false);
    const [mainError, setMainError] = useState(null);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const maxDescriptionLength = 150;
    const api = import.meta.env.VITE_API_URL;
    const recommendationsApi = import.meta.env.VITE_RECOMMENDATIONS_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"

    useEffect(() => {
        fetchVideoData();
        isVideoLiked();
        fetchRecommendedVideos();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            if(isScrollEnd)
                return;

            setCommentsLoading(true);
    
            try {
                const response = await fetch(`${api}/video/${id}/comments?page=${page}&size=${size}`);
                if(response.ok) {
                    const data = await response.json();

                    if(data.length < size)
                        setIsScrollEnd(true);

                    data.forEach(comment => {
                        comment.author.imageUrl = comment.author.imageUrl ? api + comment.author.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg"
                    });
                    
                    setComments((prev) => [...prev, ...data]);
                }
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    comments: "Wystąpił niespodziewany błąd w trakcie pobierania komentarzy. Spróbuj ponownie później."
                }));
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchComments();
    }, [watchedVideo, id, page, isScrollEnd]);
 
    useEffect(() => {
        const container = commentsRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (commentsLoading || isScrollEnd) return;

            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10)
                setPage(prev => prev + 1);
        };

        container.addEventListener('scroll', handleScroll);

        return () => container.removeEventListener('scroll', handleScroll);
    }, [watchedVideo, id, commentsLoading, isScrollEnd]);

    const fetchVideoData = async () => {
        setVideoLoading(true);
        setMainError(null);
        setErrors({});
        setWatchedVideo(null);
        setComments([]);
        setDescriptionSliced(true);

        setPage(1);
        setCommentsLoading(false);
        setIsScrollEnd(false);

        setNewCommentSubmitSuccess(null)
        setPressedLike(false);
        setCopied(false);
        setNewCommentSubmitLoading(false);

        try {
            const token = localStorage.getItem("jwt");
            let response;
            
            if(!token) {
                response = await fetch(`${api}/video/${id}`);
            } else {
                response = await fetch(`${api}/video/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
            }

            if(!response.ok) {
                const errorData = await response.json();
                setMainError({
                    status: response.status,
                    message: errorData.message
                });
                document.title = "Brak filmu - WebVOD";

                return;
            }

            const data = await response.json();
            document.title = `${data.title} - WebVOD`;

            data.author.imageUrl = data.author.imageUrl ? api + data.author.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg";

            setWatchedVideo(data);
        } catch {
            setMainError({
                status: 500,
                message: "Wystąpił niespodziewany błąd. Spróbuj ponownie później."
            });
            document.title = "Brak filmu - WebVOD";
        } finally {
            setVideoLoading(false);
        }
    }

    const isVideoLiked = async () => {
        const token = localStorage.getItem("jwt");
        if(!token)
            return;

        try {
            const response = await fetch(`${api}/video/${id}/like`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(!response.ok)
                return;

            const data = await response.json();
            setLiked(data);
        } catch {
            ;
        }
    };

    const fetchRecommendedVideos = async () => {
        setRecommendedVideos([]);
        setRecommendedVideosLoading(true);

        try {
            const response = await fetch(`${recommendationsApi}/similar-videos?id=${id}&n=10`)

            if(!response.ok) {
                const errorData = await response.json();
                
                if(errorData.message) {
                    setErrors((prev) => ({
                        ...prev,
                        recommendedVideos: errorData.message
                    }));
                }

                return;
            }

            const recommendedVideos = await response.json();
            setRecommendedVideos(recommendedVideos);
        } catch {
            setErrors((prev) => ({
                ...prev,
                recommendedVideos: `Wystąpił niespodziewany błąd w trakcie próby pobrania podobnych filmów. Spróbuj ponownie później.`
            }));
        } finally {
            setRecommendedVideosLoading(false);
        }
    }

    const handleLike = async () => {
        if(pressedLike) return;

        const token = localStorage.getItem("jwt");
        if(!token || !user) {
            navigate("/logout");
            return;
        }

        try {
            const method = liked ? "DELETE" : "POST";

            const response = await fetch(`${api}/video/${id}/like`, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(!response.ok) {
                const errorData = await response.json();
                setErrors((prev) => ({
                    ...prev,
                    like: errorData
                }));
                
                return;
            }

            setWatchedVideo((prev) => liked ? ({
                ...prev,
                likesCount: prev.likesCount - 1
            }) : ({
                ...prev,
                likesCount: prev.likesCount + 1
            }));

            setLiked(!liked);
            setPressedLike(true);
            setTimeout(() => {setPressedLike(false)}, 3000);
        } catch {
            setErrors((prev) => ({
                ...prev,
                like: `Wystąpił niespodziewany błąd w trakcie próby ${liked ? "anulowania " : ""}polubienia filmu. Spróbuj ponownie później.`
            }));
        }
    };

    const handleDescriptionSlice = () => {
        setDescriptionSliced(!descriptionSliced);
    };

    const handleCopyLink = async () => {
        if (copied) return;

        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
        setErrors((prev) => ({
            ...prev,
            newCommentSubmit: null
        }));
    }
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            setErrors((prev) => ({
                ...prev,
                newCommentSubmit: "Podaj treść komentarza."
            }));
            return;
        }

        if(newComment.length > 500) {
            setErrors((prev) => ({
                ...prev,
                newCommentSubmit: "Komentarz może mieć maksymalnie 500 znaków."
            }));
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token || !user) {
            navigate("/logout");
            return;
        }

        const form = {
            videoId: id,
            content: newComment
        }

        setNewCommentSubmitLoading(true);

        try {
            const response = await fetch(`${api}/comment`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if(!response.ok) {
                const errorData = await response.json();

                if (errorData.message) {
                    setErrors((prev) => ({
                        ...prev,
                        newCommentSubmit: errorData.message
                    }));
                }
                if (errorData.errors?.VideoId) {
                    setErrors((prev) => ({
                        ...prev,
                        newCommentSubmit: errorData.errors.VideoId
                    }));
                } 
                if (errorData.errors?.Content) {
                    setErrors((prev) => ({
                        ...prev,
                        newCommentSubmit: errorData.errors.Content
                    }));
                } 

                return;
            }

            const newCommentId = await response.text();
            setComments([
                { 
                    id: newCommentId,
                    author: {
                        id: user.id,
                        login: user.login,
                        imageUrl: user.imageUrl
                    }, 
                    content: newComment, 
                    uploadDate: new Date().toISOString() 
                }, ...comments]);
            setNewComment("");
            setWatchedVideo((prev) => ({
                ...prev,
                commentsCount : prev.commentsCount + 1
            }));
            setNewCommentSubmitSuccess("Komentarz został dodany.");
            setTimeout(() => setNewCommentSubmitSuccess(null), 4000)
        } catch {
            setErrors((prev) => ({
                ...prev,
                newCommentSubmit: "Wystąpił niespodziewany błąd w trakcie dodawania komentarza. Spróbuj ponownie później."
            }));
        } finally {
            setNewCommentSubmitLoading(false);
        }
    }
    
    const handleCommentRemove = async (commentId) => {
        const token = localStorage.getItem("jwt");
        if(!token || !user) {
            navigate("/logout");
            return;
        }

        try {
            const response = await fetch(`${api}/comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(!response.ok) {
                const errorData = await response.json();
                setErrors((prev) => ({
                    ...prev,
                    commentRemove : errorData.message
                }));
                setTimeout(() => {
                    setErrors((prev) => ({
                        ...prev,
                        commentRemove : null
                    }));
                }, 4000);

                return;
            }

            setComments(prev => prev.filter(comment => comment.id !== commentId));
            setWatchedVideo((prev) => ({
                ...prev,
                commentsCount : prev.commentsCount - 1
            }));
        } catch {
            setErrors((prev) => ({
                ...prev,
                commentRemove : "Wystąpił niespodziewany błąd w trakcie usuwania komentarza. Spróbuj ponownie później."
            }));
            setTimeout(() => {
                setErrors((prev) => ({
                    ...prev,
                    commentRemove : null
                }));
            }, 4000);
        }
    }

    // const handleSaveVideo = () => {
    //     if(pressedSave) return;

    //     setSaved(!saved);
    //     setPressedSave(true);
    //     setTimeout(() => setPressedSave(false), 3000);
    // }

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    
        if (h > 0) 
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    if (mainError) {
        return (
            <div className="mt-4 text-center">
                {mainError.status === 404 ? (
                    <figure className="inline-block w-full">
                        <img
                            src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7899.jpg"
                            className="w-full h-auto"
                            alt="404"
                            style={{ maxWidth: "450px" }}
                        />
                        <figcaption className="mt-2">{mainError.message}</figcaption>
                    </figure>
                ) : (
                    mainError.message
                )}
            </div>
        );
    }

    if(videoLoading) {
        return (
            <div className="mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if(!watchedVideo) return null;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Sekcja wideo */}
                <div className="col-12 col-xl-8">
                    <>
                        <VideoPlayer url={api + watchedVideo.videoPath} />
                        <div className="mt-3">
                            <h1 className="mb-0">{watchedVideo.title}</h1>
                        </div>
                        {/* Sekcja informacji o filmie */}
                        <div className="container mt-3">
                            <div className="row align-items-center">
                                <div className="col-auto p-0 d-none d-md-block">
                                    <Link to={`/channels/${watchedVideo.author.login}`}>
                                        <img
                                            src={watchedVideo.author.imageUrl}
                                            alt="Autor"
                                            className="img-fluid rounded-circle"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="col p-0 ps-md-2">
                                    <h3>
                                        <Link className="text-decoration-none text-black" to={`/channels/${watchedVideo.author.login}`}>{watchedVideo.author.login}</Link>
                                    </h3>
                                </div>
                                <div className="col-auto offset-3 p-0">
                                    {user ? (
                                        <button 
                                            type="button" 
                                            className="btn btn-danger me-2"
                                            title={liked ? "Anuluj polubienie" : "Polub ten film"}
                                            onClick={handleLike}
                                            disabled={pressedLike}
                                        >
                                            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`}></i>
                                            <span className="ms-1">{watchedVideo.likesCount.toLocaleString("pl-PL")}</span>
                                        </button>
                                    ) : (
                                        <Link
                                            to="/login"
                                            type="button"
                                            className="btn btn-danger me-2"
                                            title="Polub ten film"
                                        >
                                            <i className="fa-regular fa-heart"></i>
                                            <span className="ms-1">{watchedVideo.likesCount.toLocaleString("pl-PL")}</span>
                                        </Link>
                                    )}
                                    <button 
                                        type="button" 
                                        className="btn btn-primary me-2" 
                                        onClick={handleCopyLink}
                                        title={copied ? "Skopiowano" : "Skopiuj link"}
                                    >
                                        <i className={`bi bi-${copied ? 'check-lg' : 'clipboard'}`}></i>
                                    </button>
                                    {/* <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={handleSaveVideo}
                                        title={saved ? "Anuluj zapisanie filmu" : "Zapisz film"}
                                    >
                                        <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark`}></i>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            {watchedVideo.viewsCount.toLocaleString("pl-PL")} wyświetleń, {formatDatetime(watchedVideo.uploadDate)}
                        </div>
                        {errors.like && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {errors.like}
                            </div>
                        )}
                        <div className="description">
                            {watchedVideo.description.length > 0 && (
                                <div>
                                    {descriptionSliced && (watchedVideo.description.length > maxDescriptionLength)
                                        ? watchedVideo.description.slice(0, maxDescriptionLength) + "..."
                                        : watchedVideo.description}
                                </div>
                            )}
                            {watchedVideo.description.length > maxDescriptionLength && (
                                <div>
                                    <button className="btn btn-link p-0 text-decoration-none" style={{fontSize: "15px"}} onClick={handleDescriptionSlice}>
                                        {descriptionSliced ? "Pokaż więcej" : "Pokaż mniej"}
                                    </button>
                                </div>
                            )}
                            <div className={watchedVideo.description.length > 0 ? "mt-2" : ""}>
                                Kategoria: {watchedVideo.category.charAt(0).toUpperCase() + watchedVideo.category.slice(1).toLowerCase()}
                            </div>
                            {watchedVideo.tags.length > 0 && (
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <span>Tagi:</span>
                                    {watchedVideo.tags.map((tag) => (
                                        <Link to={`/tags/${tag}`} key={tag} style={{textDecoration: "none"}} className="ms-1">#{tag}</Link>
                                    ))}
                                </div>
                            )}
                        </div>
                        {user && user.id === watchedVideo.author.id && (
                            <div className="mt-3">
                                <Link to={`/videos-manager/${watchedVideo.id}`} role="button" className="btn btn-primary">Edytuj film</Link>
                            </div>
                        )}
                    </>
                    
                    {/* Sekcja komentarzy */}
                    <div className="mt-4">
                        {errors.comments && (
                            errors.comments
                        )}
                        {comments && !errors.comments && (
                            <>
                                <div className="comments-title mb-3">
                                    <h3>Komentarze ({watchedVideo.commentsCount.toLocaleString("pl-PL")}):</h3>
                                </div>
                                {user && (
                                    <div className="comments-input mb-3">
                                        <form onSubmit={handleCommentSubmit}>
                                            <div className="mb-2">
                                                <textarea
                                                    placeholder="Dodaj komentarz"
                                                    className={`form-control ${errors.newCommentSubmit ? 'is-invalid' : ''}`}
                                                    maxLength={500}
                                                    style={{resize: "none"}}
                                                    rows={4}
                                                    value={newComment}
                                                    onChange={handleNewCommentChange}
                                                >
                                                </textarea>
                                                {errors.newCommentSubmit && (
                                                    <div className="invalid-feedback">
                                                        {errors.newCommentSubmit}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <button className="btn btn-primary" type="submit" disabled={newCommentSubmitLoading || !newComment.trim()}>Dodaj</button>
                                            </div>
                                            {newCommentSubmitLoading && (
                                                <div className="spinner-border mt-3" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            )}
                                            {newCommentSubmitSuccess && (
                                                <div className="alert alert-success mt-3" role="alert">
                                                    {newCommentSubmitSuccess}
                                                </div>
                                            )}
                                            {errors.commentRemove && (
                                                <div className="alert alert-danger mt-3" role="alert">
                                                    {errors.commentRemove}
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                )}
                                <div ref={commentsRef} className="comments-tab container p-0" style={comments.length > 0 ? {border: "1px solid #ddd"} : {}}>
                                    {comments.map(comment => (
                                        <div className="m-0 pt-2 pb-2 row mb-2" key={comment.id}>
                                            <div className="col-auto d-none d-md-block">
                                                <Link to={`/channels/${comment.author.login}`}>
                                                    <img
                                                        src={comment.author.imageUrl}
                                                        alt="Autor"
                                                        className="img-fluid rounded-circle"
                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                        loading="lazy"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="col">
                                                <div>
                                                    <span className="fw-bold">
                                                        <Link className="text-decoration-none text-black" to={`/channels/${comment.author.login}`}>{comment.author.login}</Link>
                                                    </span>
                                                    <span className="ms-1" style={{fontSize: "14px"}}>{formatDatetime(comment.uploadDate)}</span>
                                                    {user && user.id === comment.author.id && (
                                                        <span
                                                            className="ms-2 fw-bold"
                                                            style={{fontSize: "15px", color: "#0d6efd", cursor: "pointer"}}
                                                            onClick={() => handleCommentRemove(comment.id)}
                                                        >
                                                            Usuń
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {commentsLoading && (
                                        <div className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>  
                            </>
                        )}
                        {!comments && !errors.comments && (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Sekcja polecanych filmów */}
                <div className="col-12 mt-4 mt-xl-0 col-xl-4">
                    <div className="mb-3">
                        <h2 className="fw-bold">Podobne filmy</h2>
                    </div>
                    {recommendedVideosLoading && (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {errors.recommendedVideos && (
                        <div className="alert alert-danger" role="alert">
                            {errors.recommendedVideos}
                        </div>
                    )}
                    {recommendedVideos && recommendedVideos.length > 0 && (
                        <div className="container p-0">
                            {recommendedVideos.map(video => (
                                <div className="row mb-3" key={video.id}>
                                    <div className="col pe-0">
                                        <div className="thumbnail-container ratio ratio-16x9">
                                            <Link to={`/videos/${video.id}`}>
                                                <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath} alt="Miniatura" />
                                                <span className="thumbnail-duration">{formatDuration(video.duration)}</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col ps-0">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col title">
                                                    <Link to={`/videos/${video.id}`}>
                                                        {video.title.length > 50 ? video.title.slice(0, 50) + "..." : video.title}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col author">
                                                    <Link className="text-decoration-none text-black" to={`/channels/${video.authorLogin}`}>{video.authorLogin}</Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col details">{video.viewsCount.toLocaleString("pl-PL")} <i className="fa-solid fa-eye"></i>, {formatDate(video.uploadDate)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={`toast position-fixed end-0 bottom-0 align-items-center ${pressedLike && 'fade show'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {liked ?
                            "Polubiono film."
                            :
                            "Anulowano polubienie filmu."
                        }
                    </div>
                    <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            {/* <div className={`toast position-fixed end-0 bottom-0 align-items-center ${pressedSave && 'fade show'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {saved ?
                            "Zapisano film."
                            :
                            "Anulowano zapis filmu."
                        }
                    </div>
                    <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div> */}
            <div className={`toast position-fixed end-0 bottom-0 align-items-center ${copied && 'fade show'}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">Skopiowano link do schowka.</div>
                    <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    );
};

export default Video;
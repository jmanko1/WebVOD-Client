import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Video.css";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";

const Video = () => {
    const { id } = useParams();

    const [watchedVideo, setWatchedVideo] = useState(null);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [comments, setComments] = useState([]);

    const [newComment, setNewComment] = useState("");

    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    const [pressedLike, setPressedLike] = useState(false);
    const [pressedSave, setPressedSave] = useState(false);

    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [descriptionSliced, setDescriptionSliced] = useState(true);

    const maxDescriptionLength = 150;

    useEffect(() => {
        
        const videoData = {
            title: "Fajny film",
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            views: 105623,
            likes: 10942,
            comments: 1897,
            date: "2022-07-03",
            // src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            src: "http://localhost:8080/uploads/videos/507f1f77bcf86cd799439011/master.m3u8",
            // src: "https://static.videezy.com/system/resources/previews/000/008/452/original/Dark_Haired_Girl_Pensive_Looks_at_Camera.mp4",
            author: {
                id: 1,
                login: "tomek123",
                imageURL: "https://marszalstudio.pl/wp-content/uploads/2024/01/fajne-zdjecia-profilowe-12.webp"
            },
        };

        setWatchedVideo(videoData);
        setLikesCount(videoData.likes);

        setRecommendedVideos([
            {
                id: 1,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                author: {
                    id: 1,
                    login: "tomek123"
                },
                views: 72062,
                date: "2021-06-24",
                duration: 1163,
            },
            {
                id: 2,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                author: {
                    id: 1,
                    login: "tomek123"
                },
                views: 72062,
                date: "2021-06-24",
                duration: 1163,
            },
            {
                id: 3,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                author: {
                    id: 1,
                    login: "tomek123"
                },
                views: 72062,
                date: "2021-06-24",
                duration: 1163,
            },
        ]);

        setComments([
            {
                id: 2,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: {
                    id: 1,
                    login: "tomek123",
                    imageURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2025-03-21 14:02:00"
            },
            {
                id: 3,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: {
                    id: 1,
                    login: "tomek123",
                    imageURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2025-03-21 14:02:00"
            },
            {
                id: 4,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: {
                    id: 1,
                    login: "tomek123",
                    imageURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2025-03-21 14:02:00"
            },
            {
                id: 5,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: {
                    id: 1,
                    login: "tomek123",
                    imageURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                date: "2025-03-21 14:02:00"
            }
        ]);

        setCommentsCount(videoData.comments);

    }, [id]);

    const handleLike = () => {
        if(pressedLike) return;

        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
        setPressedLike(true);
        
        setTimeout(() => {setPressedLike(false)}, 3000);
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

    const getFormattedDate = () => {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear());

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    };

    const formatDatetime = (datetimeString) => {
        const [date, time] = datetimeString.split(" ");

        const [year, month, day] = date.split("-");
        const [hours, minutes] = time.split(":");

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;

        setComments([
            { 
                id: Date.now(),
                author: {
                    id: 1,
                    login: "tomek123",
                    imageURL: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                }, 
                content: newComment, 
                date: getFormattedDate() 
            }, ...comments]);
        setNewComment("");
        setCommentsCount((prev) => prev + 1);
    }

    const handleSaveVideo = () => {
        if(pressedSave) return;

        setSaved(!saved);
        setPressedSave(true);
        setTimeout(() => setPressedSave(false), 3000);
    }

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    
        if (h > 0) 
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Sekcja wideo */}
                <div className="col-12 col-xxl">
                    {watchedVideo ? (
                        <>
                            <VideoPlayer url={watchedVideo.src} />
                            <div className="mt-3">
                                <h1 className="mb-0">{watchedVideo.title}</h1>
                            </div>
                            {/* Sekcja informacji o filmie */}
                            <div className="container mt-3">
                                <div className="row align-items-center">
                                    <div className="col-auto p-0 d-none d-md-block">
                                        <Link to={`/channels/${watchedVideo.author.id}`}>
                                            <img
                                                src={watchedVideo.author.imageURL}
                                                alt="Autor"
                                                className="img-fluid rounded-circle"
                                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                            />
                                        </Link>
                                    </div>
                                    <div className="col p-0 ps-md-2">
                                        <h3>
                                            <Link className="text-decoration-none text-black" to={`/channels/${watchedVideo.author.id}`}>{watchedVideo.author.login}</Link>
                                        </h3>
                                    </div>
                                    <div className="col-auto offset-3 p-0">
                                        <button 
                                            type="button" 
                                            className="btn btn-danger me-2"
                                            title={liked ? "Anuluj polubienie" : "Polub ten film"}
                                            onClick={handleLike}
                                        >
                                            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`}></i>
                                            <span className="ms-1">{likesCount.toLocaleString("pl-PL")}</span>
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary me-2" 
                                            onClick={handleCopyLink}
                                            title={copied ? "Skopiowano" : "Skopiuj link"}
                                        >
                                            <i className={`bi bi-${copied ? 'check-lg' : 'clipboard'}`}></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleSaveVideo}
                                            title={saved ? "Anuluj zapisanie filmu" : "Zapisz film"}
                                        >
                                            <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark`}></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                {watchedVideo.views.toLocaleString("pl-PL")} wyświetleń, {formatDate(watchedVideo.date)}
                            </div>
                            <div className="description">
                                <div>
                                    {descriptionSliced && watchedVideo.description.length > maxDescriptionLength
                                        ? watchedVideo.description.slice(0, maxDescriptionLength) + "..."
                                        : watchedVideo.description}
                                </div>
                                {watchedVideo.description.length > maxDescriptionLength && (
                                    <div>
                                        <button className="btn btn-link p-0 text-decoration-none" style={{fontSize: "15px"}} onClick={handleDescriptionSlice}>
                                            {descriptionSliced ? "Pokaż więcej" : "Pokaż mniej"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>Ładowanie...</p>
                    )}
                    
                    {/* Sekcja komentarzy */}
                    <div className="mt-3">
                        {comments && watchedVideo ? (
                            <>
                                <div className="comments-title mb-3">
                                    <h3>Komentarze ({commentsCount.toLocaleString("pl-PL")}):</h3>
                                </div>
                                <div className="comments-input mb-3">
                                    <form onSubmit={handleCommentSubmit}>
                                        <div className="mb-2">
                                            <textarea
                                                placeholder="Dodaj komentarz"
                                                className="form-control"
                                                maxLength={500}
                                                style={{resize: "none"}}
                                                rows={4}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            >
                                            </textarea>
                                        </div>
                                        <button className="btn btn-primary" type="submit">Dodaj</button>
                                    </form>
                                </div>
                                <div className="comments-tab container p-0">
                                    {comments.map(comment => (
                                        <div className="m-0 pt-2 pb-2 row mb-2" key={comment.id}>
                                            <div className="col-auto d-none d-md-block">
                                                <img
                                                    src={comment.author.imageURL}
                                                    alt="Autor"
                                                    className="img-fluid rounded-circle"
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="col">
                                                <div>
                                                    <span className="fw-bold">
                                                        <Link className="text-decoration-none text-black" to={`/channels/${comment.author.id}`}>{comment.author.login}</Link>
                                                    </span>
                                                    <span style={{fontSize: "14px"}}> ({formatDatetime(comment.date)})</span>
                                                </div>
                                                <div>
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>  
                            </>
                        ) : (
                            <p>Ładowanie...</p>
                        )}
                    </div>
                </div>

                {/* Sekcja polecanych filmów */}
                <div className="col-12 mt-4 mt-xxl-0 col-xxl-4">
                    <h2 className="fw-bold">Podobne filmy</h2>
                    {recommendedVideos ? (
                        <div className="container p-0">
                            {recommendedVideos.map(video => (
                                <div className="row mb-3" key={video.id}>
                                    <div className="col pe-0">
                                        <div className="thumbnail-container ratio ratio-16x9">
                                            <Link to={`/videos/${video.id}`}>
                                                <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnail} alt="Miniatura" />
                                                <span className="thumbnail-duration">{formatDuration(video.duration)}</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col ps-0">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col title">
                                                    <Link to={`/videos/${video.id}`}>
                                                        {video.title.length > 70 ? video.title.slice(0, 70) + "..." : video.title}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col author">
                                                    <Link className="text-decoration-none text-black" to={`/channels/${video.author.id}`}>{video.author.login}</Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col details">{video.views.toLocaleString("pl-PL")}, {formatDate(video.date)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Ładowanie...</p>
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
            <div className={`toast position-fixed end-0 bottom-0 align-items-center ${pressedSave && 'fade show'}`} role="alert" aria-live="assertive" aria-atomic="true">
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
            </div>
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
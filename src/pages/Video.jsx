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
            title: "Dark Haired Girl Pensive Looks at Camera",
            description: 'Oto szesnasty odcinek mojej serii Zagrajmy w Wiedźmin 2: Edycja Rozszerzona (lub jak kto woli: Zagrajmy w Wiedźmin 2: Zabójcy Królów). Tym razem wykonujemy zadanie fabularne "Róża pamięci", a Geralt przeżywa ulotne chwile z Triss w łaźni;). Produkcja została stworzona przez polskie studio CD Projekt RED, a ja przechodzę wersję na PC.',
            views: 105623,
            likes: 10942,
            comments: 1897,
            date: "03.07.2022",
            src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            // src: "https://static.videezy.com/system/resources/previews/000/008/452/original/Dark_Haired_Girl_Pensive_Looks_at_Camera.mp4",
            authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
            author: "The Cranberries"
        };

        setWatchedVideo(videoData);
        setLikesCount(videoData.likes);

        setRecommendedVideos([
            {
                id: 1,
                thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
                title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
                author: "Szablo Mario",
                views: 72062,
                date: "24.06.2021",
                duration: 1163,
            },
            {
                id: 2,
                thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
                title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
                author: "Szablo Mario",
                views: 72062,
                date: "24.06.2021",
                duration: 1163,
            },
            {
                id: 3,
                thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
                title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
                author: "Szablo Mario",
                views: 72062,
                date: "24.06.2021",
                duration: 1163,
            }
        ]);

        setComments([
            {
                id: 1,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 2,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 3,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 4,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 5,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 6,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 7,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
            },
            {
                id: 8,
                authorImageSrc: "https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj",
                author: "tomek123",
                content: " Kiedy rozum śpi, budzą się demony. Na zakuty lewacki łeb jest tylko jeden sposób: bliskie spotkanie 3 stopnia. Niech ta pani zamieszka na jakiś czas w Paryżu w dzielnicy zdominowanej przez migrantów. Jest szansa, że to wróci jej rozum.",
                date: "21.03.2025 14:02"
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

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) return;

        setComments([{ id: Date.now(), author: "Anon", content: newComment, date: getFormattedDate() }, ...comments]);
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
                                    <div className="col-1 p-0">
                                        <img 
                                            // className="rounded-5" 
                                            src={watchedVideo.authorImageSrc}
                                            alt="Autor"
                                            style={{ width: "50px", height: "50px" }} 
                                        />
                                    </div>
                                    <div className="col p-0">
                                        <h3>{watchedVideo.author}</h3>
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
                                {watchedVideo.views.toLocaleString("pl-PL")} wyświetleń, {watchedVideo.date}
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
                                            <div className="col-1 d-none d-md-inline">
                                                <img src={comment.authorImageSrc} style={{width: "50px", height: "50px"}} />
                                            </div>
                                            <div className="col">
                                                <div>
                                                    <span className="fw-bold">{comment.author}</span>
                                                    <span style={{fontSize: "14px"}}> ({comment.date})</span>
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
                <div className="col-12 mt-4 mt-xxl-0 col-xxl">
                    <h2 className="fw-bold">Podobne filmy</h2>
                    {recommendedVideos ? (
                        <div className="container p-0">
                            {recommendedVideos.map(video => (
                                <div className="row mb-3" key={video.id}>
                                    <div className="col">
                                        <div className="thumbnail-container">
                                            <Link to={`/video/${video.id}`}>
                                                <img className="thumbnail" src={video.thumbnail} alt="Miniatura" />
                                                <span className="thumbnail-duration">{formatDuration(video.duration)}</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col title">
                                                    <Link to={`/video/${video.id}`}>
                                                        {video.title.length > 75 ? video.title.slice(0, 75) + "..." : video.title}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col author">{video.author}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col details">{video.views.toLocaleString("pl-PL")} wyświetleń, {video.date}</div>
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
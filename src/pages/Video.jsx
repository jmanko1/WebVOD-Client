import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/Video.css";

const Video = () => {
    const { id } = useParams();
    
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(25521);
    const [copied, setCopied] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
    };

    const handleCopyLink = async () => {
        if (copied) return;

        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const recommendedVideos = [
        {
            id: 1,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            author: "Szablo Mario",
            views: "72 062 wyświetleń",
            date: "24.06.2021",
            duration: "19:23",
        },
        {
            id: 2,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            author: "Szablo Mario",
            views: "72 062 wyświetleń",
            date: "24.06.2021",
            duration: "19:23",
        }
    ];

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Sekcja wideo */}
                <div className="col">
                    <video controls>
                        <source 
                            src="https://static.videezy.com/system/resources/previews/000/008/452/original/Dark_Haired_Girl_Pensive_Looks_at_Camera.mp4" 
                            type="video/mp4" 
                        />
                    </video>
                    <h1 className="mt-2">Dark Haired Girl Pensive Looks at Camera</h1>

                    {/* Sekcja informacji o filmie */}
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-1 p-0">
                                <img 
                                    className="rounded-5" 
                                    src="https://yt3.ggpht.com/Pk-75p67kN439_PkvOvIywqwXw4X8-3iBYP0KahdMliVznX5BNkti8Q4yEz7NcENMtEErjVJ=s88-c-k-c0x00ffffff-no-rj" 
                                    alt="Autor"
                                    style={{ width: "50px", height: "50px" }} 
                                />
                            </div>
                            <div className="col p-0">
                                <h3>TheCranberries</h3>
                            </div>
                            <div className="col-auto offset-3 p-0">
                                <button 
                                    type="button" 
                                    className="btn btn-danger me-2" 
                                    onClick={handleLike}
                                >
                                    <i className={`fa-${liked ? "solid" : "regular"} fa-heart`}></i>
                                    <span className="ms-1">{likes.toLocaleString("pl-PL")}</span>
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={handleCopyLink}
                                >
                                    <i className="fa-solid fa-share"></i>
                                    <span className="ms-1">{copied ? "Skopiowano" : "Skopiuj link"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sekcja polecanych filmów */}
                <div className="col">
                    <h2>Podobne filmy</h2>
                    <div className="container p-0">
                        {recommendedVideos.map(video => (
                            <div className="row mb-3" key={video.id}>
                                <div className="col">
                                    <div className="thumbnail-container">
                                        <Link to={`/video/${video.id}`}>
                                            <img className="thumbnail" src={video.thumbnail} alt="Miniatura" />
                                            <span className="thumbnail-duration">{video.duration}</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col title">{video.title}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col author">{video.author}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col details">{video.views}, {video.date}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;
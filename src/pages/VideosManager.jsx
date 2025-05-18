import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/VideosManager.css";

const VideosManager = () => {
    const [videos, setVideos] = useState(null);

    useEffect(() => {
        const fetchedVideos = [
            {
                id: 1,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                views: 72062,
                date: "2024-06-24",
                duration: 1162
            },
            {
                id: 2,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                views: 72062,
                date: "2024-06-24",
                duration: 1162
            },
            {
                id: 3,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                views: 72062,
                date: "2024-06-24",
                duration: 1162
            },
            {
                id: 4,
                thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
                title: "Fajny film",
                views: 72062,
                date: "2024-06-24",
                duration: 1162
            }
        ];

        setVideos(fetchedVideos);
    }, []);

    const maxTextLength = 70;

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    
        if (h > 0) 
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    };

    const handleVideoDelete = (idToRemove) => {
        setVideos(videos.filter(video => video.id !== idToRemove))
    }

    const handleSearch = (e) => {
        e.preventDefault();
    }

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col">
                    <form onSubmit={handleSearch} className="d-flex" role="search">
                        <input
                            className="form-control rounded-end-0 border border-end-0 border-secondary"
                            style={{width: "300px"}}
                            type="search"
                            placeholder="Wyszukaj..."
                            aria-label="Search" 
                        />
                        <button className="btn btn-outline-secondary rounded-start-0" type="submit">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>
            {videos ? (
                videos.map(video => (
                    <div className="row align-items-center mb-4 mb-xl-3" key={video.id}>
                        <div className="col-12 col-xl-2">
                            <div className="videos-manager-thumbnail-container">
                                <Link to={`/videos/${video.id}`}>
                                    <img className="videos-manager-thumbnail" src={video.thumbnail} alt="Miniatura" />
                                    <span className="videos-manager-thumbnail-duration">{formatDuration(video.duration)}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="col-12 col-xl-2 videos-manager-title mt-2 mt-xl-0">
                            <Link to={`/videos/${video.id}`}>
                                {video.title.length > maxTextLength ? video.title.slice(0, maxTextLength) + "..." : video.title}
                            </Link>
                        </div>
                        <div className="col-12 col-xl-2 text-xl-center">
                            {video.views.toLocaleString("pl-PL")} wyświetleń
                        </div>
                        <div className="col-12 col-xl-2 text-xl-center">
                            {formatDate(video.date)}
                        </div>
                        <div className="d-none d-xl-inline col-xl-2 text-xl-center mt-2 mt-xl-0">
                            <Link className="btn btn-success" role="button" to={`/videos-manager/${video.id}`}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span className="ms-1">Edytuj</span>
                            </Link>
                        </div>
                        <div className="d-none d-xl-inline col-xl-2 text-xl-center mt-2 mt-xl-0">
                            <button className="btn btn-danger" onClick={() => handleVideoDelete(video.id)}>
                                <i className="fa-solid fa-trash-can"></i>
                                <span className="ms-1">Usuń</span>
                            </button>
                        </div>
                        <div className="col-12 mt-2 d-inline d-xl-none">
                            <Link className="btn btn-success" role="button" to={`/videos-manager/${video.id}`}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span className="ms-1">Edytuj</span>
                            </Link>
                            <button className="btn btn-danger ms-2" onClick={() => handleVideoDelete(video.id)}>
                                <i className="fa-solid fa-trash-can"></i>
                                <span className="ms-1">Usuń</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Ładowanie...</p>
            )}
        </div>
    );
}

export default VideosManager;
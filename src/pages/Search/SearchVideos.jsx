import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDate, formatDuration } from "../../utils/datetime";

import "../../styles/SearchVideos.css";

const SearchVideos = () => {
    const { query } = useParams();

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const api = import.meta.env.VITE_API_URL;
    const recommendationsApi = import.meta.env.VITE_RECOMMENDATIONS_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"
    const maxTitleLength = 50;

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${recommendationsApi}/search-videos?query=${query}&n=30`);

                if(!response.ok) {
                    const errorData = await response.json();
                    
                    if(errorData.message) {
                        setError(errorData.message);
                    }

                    return;
                }

                const videos = await response.json();
                setVideos(videos);
            } catch {
                setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        }

        setError(null);
        document.title = `Wyniki wyszukiwania dla "${query}"`;
        window.scrollTo(0, 0);
        fetchVideos();
    }, [query]);

    return (
        <div className="container mt-4">
            <div className="row mb-2">
                <div className="col">
                    <h1 style={{fontSize: "28px"}}>Wyniki wyszukiwania dla "{query}":</h1>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link className="nav-link active" to={`/search-videos/${query}`}>Filmy</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={`/search-channels/${query}`}>Kanały</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {loading && (
                <div className="row text-center mb-3">
                    <div className="col">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="row text-center mb-3">
                    <div className="col">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </div>
                </div>
            )}
            {!error && videos.map((video) => (
                <div className="row mb-3" key={video.id}>
                    <div className="col-12 col-sm-4 col-lg-3 pe-sm-0">
                        <div className="search-videos-thumbnail-container ratio ratio-16x9">
                            <Link to={`/videos/${video.id}`}>
                                <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath} alt="Miniatura" />
                                <span className="search-videos-thumbnail-duration">{formatDuration(video.duration)}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-sm-8 col-lg-9 ps-0 ps-sm-2">
                        <div className="container">
                            <div className="row">
                                <div className="col search-videos-title">
                                    <Link to={`/videos/${video.id}`}>
                                        {video.title.length > maxTitleLength ? video.title.slice(0, maxTitleLength) + "..." : video.title}
                                    </Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col search-videos-author">
                                    <Link className="text-decoration-none text-black" to={`/channels/${video.authorLogin}`}>{video.authorLogin}</Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col search-videos-details">{video.viewsCount.toLocaleString("pl-PL")} wyświetleń, {formatDate(video.uploadDate)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SearchVideos;
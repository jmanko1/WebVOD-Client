import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatDuration } from "../utils/datetime";

import "../styles/LikedVideos.css";

const LikedVideos = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [videosLoading, setVideosLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const navigate = useNavigate();

    const maxTitleLength = 50;
    const api = import.meta.env.VITE_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"

    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        document.title = "Polubione filmy - WebVOD";
    }, []);

    useEffect(() => {
        const fetchVideos = async () => {
            if(isScrollEnd)
                return;

            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            setVideosLoading(true);
    
            try {
                const response = await fetch(`${api}/user/my-profile/liked-videos?page=${page}&size=${size}`, {
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
                    
                    if(errorData.message)
                        setError(errorData.message);
                    
                    return;
                }

                const data = await response.json();

                if(data.length < size)
                    setIsScrollEnd(true);
                
                setVideos((prev) => [...prev, ...data]);
            } catch {
                setError("Wystąpił niespodziewany błąd w trakcie pobierania filmów. Spróbuj ponownie później.");
            } finally {
                setVideosLoading(false);
            }
        };

        fetchVideos();
    }, [page, isScrollEnd]);

    useEffect(() => {
        const handleScroll = () => {
            if (videosLoading || isScrollEnd) return;
            const scrollTop = window.scrollY || window.pageYOffset;
            const clientHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [videosLoading, isScrollEnd]);

    return (
        <div className="container mt-4">
            <div className="row mb-3">
                <div className="col">
                    <h1 style={{fontSize: "28px"}}>Polubione filmy</h1>
                </div>
            </div>
            {error ? (
                <div className="text-center row">
                    <div className="col">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {videos.map((video) => (
                        <div className="row mb-3" key={video.id}>
                            <div className="col-12 col-sm-4 col-lg-3 pe-sm-0">
                                <div className="liked-videos-thumbnail-container ratio ratio-16x9">
                                    <Link to={`/videos/${video.id}`}>
                                        <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath} alt="Miniatura" />
                                        <span className="liked-videos-thumbnail-duration">{formatDuration(video.duration)}</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-12 col-sm-8 col-lg-9 ps-0 ps-sm-2">
                                <div className="container">
                                    <div className="row">
                                        <div className="col liked-videos-title">
                                            <Link to={`/videos/${video.id}`}>
                                                {video.title.length > maxTitleLength ? video.title.slice(0, maxTitleLength) + "..." : video.title}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col liked-videos-author">
                                            <Link className="text-decoration-none text-black" to={`/channels/${video.authorLogin}`}>{video.authorLogin}</Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col liked-videos-details">{video.viewsCount.toLocaleString("pl-PL")} wyświetleń, {formatDate(video.uploadDate)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {videosLoading && (
                        <div className="row text-center mt-3">
                            <div className="col">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default LikedVideos;
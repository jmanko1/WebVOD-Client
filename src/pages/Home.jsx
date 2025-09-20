import { Link } from "react-router-dom";
import "../styles/Home.css";
import { useEffect, useState } from "react";
import { formatDate, formatDuration } from "../utils/datetime";

const Home = () => {
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const maxTitleLength = 50;
    const api = import.meta.env.VITE_API_URL;
    const recommendationsApi = import.meta.env.VITE_RECOMMENDATIONS_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"

    useEffect(() => {
        const fetchRecommendedVideos = async () => {
            const token = localStorage.getItem("jwt");
            if(!token)
                return;

            setLoading(true);

            try {
                const response = await fetch(`${recommendationsApi}/recommend?n=32`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(!response.ok) {
                    const errorData = await response.json();

                    if(errorData.message)
                        setError(errorData.message)

                    return;
                }

                setIsLogged(true);
                const videos = await response.json();
                setRecommendedVideos(videos);
            } catch {
                setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.")
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendedVideos()
        document.title = "WebVOD";
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col">
                    <h1 style={{fontSize: "28px"}}>Polecane filmy</h1>
                </div>
            </div>
            <div className="row mt-3">
                {loading && (
                    <div className="text-center col">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger text-center col" role="alert">
                        {error}
                    </div>
                )}
                {recommendedVideos.length == 0 && !loading && !error && isLogged && (
                    <div className="col">
                        Zacznij oglądać i oznaczać filmy, które Ci się podobają, aby móc tworzyć kartę polecanych filmów.
                    </div>
                )}
                {!loading && !error && !isLogged && (
                    <div className="col">
                        Zaloguj się, aby móc wyświetlać kartę polecanych filmów.
                    </div>
                )}
                {recommendedVideos.map(video => (
                   <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3" key={video.id}>
                            <div className="row">
                                <div className="col">
                                    <div className="ratio ratio-16x9">
                                        <Link to={`/videos/${video.id}`}>
                                            <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath} alt="Miniatura" />
                                            <span className="home-video-thumbnail-duration">{formatDuration(video.duration)}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col">
                                    <div className="container p-0">
                                        <div className="row">
                                            <div className="col home-video-title">
                                                <Link to={`/videos/${video.id}`}>
                                                    {video.title.length > maxTitleLength ? video.title.slice(0, maxTitleLength) + "..." : video.title}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col home-video-author">
                                                <Link to={`/channels/${video.authorLogin}`}>{video.authorLogin}</Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col home-video-details">{`${video.viewsCount.toLocaleString("pl-PL")} wyświetleń, ${formatDate(video.uploadDate)}`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div> 
                ))}
            </div>
        </div>
    );
}

export default Home;
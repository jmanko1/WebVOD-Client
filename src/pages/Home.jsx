import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {

    const recommendedVideos = [
        {
            id: 1,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            views: 72062,
            date: "24.06.2021",
            duration: 1162,
            author: {
                id: 1,
                login: "Szablo Mario"
            }
        },
        {
            id: 2,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            views: 72062,
            date: "24.06.2021",
            duration: 1162,
            author: {
                id: 1,
                login: "Szablo Mario"
            }
        },
        {
            id: 3,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            views: 72062,
            date: "24.06.2021",
            duration: 1162,
            author: {
                id: 1,
                login: "Szablo Mario"
            }
        }
    ];

    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    
        if (h > 0) 
            return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="container">
            <div className="row">
                {recommendedVideos.map(video => (
                   <div className="col-12 col-md-6 col-xl-4 mt-4" key={video.id}>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="home-video-thumbnail-container">
                                        <Link to={`/videos/${video.id}`}>
                                            <img className="home-video-thumbnail" src={video.thumbnail} alt="Miniatura" />
                                            <span style={{fontSize: "13px"}} className="home-video-thumbnail-duration">{formatDuration(video.duration)}</span>
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
                                                    {video.title}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col home-video-author">
                                                <Link to={`/channels/${video.author.id}`}>{video.author.login}</Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col home-video-details">{`${video.views.toLocaleString("pl-PL")} wyświetleń, ${video.date}`}</div>
                                        </div>
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
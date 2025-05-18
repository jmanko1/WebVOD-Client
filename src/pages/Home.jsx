import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {

    const recommendedVideos = [
        {
            id: 1,
            thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
            title: "Fajny film",
            views: 72062,
            date: "2024-06-24",
            duration: 1162,
            author: {
                id: 1,
                login: "tomek123"
            }
        },
        {
            id: 2,
            thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
            title: "Fajny film",
            views: 72062,
            date: "2024-06-24",
            duration: 1162,
            author: {
                id: 1,
                login: "tomek123"
            }
        },
        {
            id: 3,
            thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
            title: "Fajny film",
            views: 72062,
            date: "2024-06-24",
            duration: 1162,
            author: {
                id: 1,
                login: "tomek123"
            }
        },
        {
            id: 4,
            thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
            title: "Fajny film",
            views: 72062,
            date: "2024-06-24",
            duration: 1162,
            author: {
                id: 1,
                login: "tomek123"
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

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="container">
            <div className="row">
                {recommendedVideos.map(video => (
                   <div className="col-12 col-md-6 col-xl-4 mt-4 d-flex justify-content-center" key={video.id}>
                        <div className="home-video-card">
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
                                        <div className="row mt-1">
                                            <div className="col home-video-title">
                                                <Link to={`/videos/${video.id}`}>
                                                    {video.title.length > 70 ? video.title.slice(0, 70) + "..." : video.title}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col home-video-author">
                                                <Link to={`/channels/${video.author.id}`}>{video.author.login}</Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col home-video-details">{`${video.views.toLocaleString("pl-PL")} wyświetleń, ${formatDate(video.date)}`}</div>
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
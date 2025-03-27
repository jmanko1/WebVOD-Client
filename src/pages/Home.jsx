import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {

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
        },
        {
            id: 3,
            thumbnail: "https://i.ytimg.com/vi/_oedcuHCQwU/hq720.jpg",
            title: "Wiedźmin 3: Dziki Gon - Jaskinia Snów - Droga ku zagładzie NG+",
            author: "Szablo Mario",
            views: "72 062 wyświetleń",
            date: "24.06.2021",
            duration: "19:23",
        }
    ];

    return (
        <div className="container">
            <div className="row">
                {recommendedVideos.map(video => (
                   <div className="col-12 col-md-6 col-xl-4 mt-4" key={video.id}>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="thumbnail-container">
                                        <Link to={`/video/${video.id}`}>
                                            <img className="thumbnail" src={video.thumbnail} alt="Miniatura" />
                                            <span className="thumbnail-duration">{video.duration}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col">
                                    <div className="container p-0">
                                        <div className="row">
                                            <div className="col title">
                                                <Link to={`/video/${video.id}`}>
                                                    {video.title}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col author">{video.author}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col details">{`${video.views}, ${video.date}`}</div>
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
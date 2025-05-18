import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../styles/Channel.css";

const Channel = () => {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [userVideos, setUserVideos] = useState(null);

    const [descriptionSliced, setDescriptionSliced] = useState(true);
    const maxDescriptionLength = 100;

    useEffect(() => {

        const data = {
            login: "tomek123",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            imageURL: "https://marszalstudio.pl/wp-content/uploads/2024/01/fajne-zdjecia-profilowe-12.webp",
            signupDate: "2023-04-05",
            videosCount: 24
        };

        const videos = [
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
        ]

        setUserData(data);
        setUserVideos(videos);

    }, [id]);

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
        <div className="container mt-4">
            {userData ? (
                <>
                    <div className="row justify-content-center">
                        <div className="col ratio ratio-1x1 p-0" style={{maxWidth: "160px"}}>
                            <img className="img-fluid object-fit-cover w-100 h-100" src={userData.imageURL} alt="Zdjęcie kanału" />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col text-center">
                            <h1>{userData.login}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            Liczba filmów: {userData.videosCount}, Data dołączenia: {formatDate(userData.signupDate)}
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-center">
                        <div className="col" style={{maxWidth: "700px"}}>
                            <div>
                                {descriptionSliced && userData.description.length > maxDescriptionLength
                                    ? userData.description.slice(0, maxDescriptionLength) + "..."
                                    : userData.description
                                }
                            </div>
                        {userData.description.length > maxDescriptionLength && (
                            <div>
                                <button className="btn btn-link p-0 text-decoration-none" style={{fontSize: "15px"}} onClick={() => {setDescriptionSliced(!descriptionSliced)}}>
                                    {descriptionSliced ? "Pokaż więcej" : "Pokaż mniej"}
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col text-center">
                            <Link className="btn btn-primary" role="button" to="/channel-settings">
                                <i className="fa-solid fa-gear"></i>
                                <span className="ms-1">Ustawienia kanału</span>
                            </Link>
                            <Link className="btn btn-success ms-2" role="button" to="/videos-manager">
                                <i className="fa-solid fa-video"></i>
                                <span className="ms-1">Menedżer filmów</span>
                            </Link>
                        </div>
                    </div> 
                    <div className="row mt-4 border-top border-2">
                    {userVideos.map(video => (
                   <div className="col-12 col-md-6 col-xl-4 mt-4 d-flex justify-content-center" key={video.id}>
                        <div className="channel-video-card">
                            <div className="row">
                                <div className="col">
                                    <div className="ratio ratio-16x9">
                                        <Link to={`/videos/${video.id}`}>
                                            <img className="img-fluid object-fit-cover w-100 h-100" src={video.thumbnail} alt="Miniatura" />
                                            <span style={{fontSize: "13px"}} className="channel-video-thumbnail-duration">{formatDuration(video.duration)}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col">
                                    <div className="container p-0">
                                        <div className="row">
                                            <div className="col channel-video-title">
                                                <Link to={`/videos/${video.id}`}>
                                                    {video.title.length > 70 ? video.title.slice(0, 70) + "..." : video.title}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col channel-video-details">{`${video.views.toLocaleString("pl-PL")} wyświetleń, ${formatDate(video.date)}`}</div>
                                        </div>
                                    </div>
                                </div>
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
    );
}

export default Channel;
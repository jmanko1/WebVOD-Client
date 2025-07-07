import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../styles/Channel.css";
import { useUser } from "../contexts/UserContext";
import { formatDate, formatDuration } from "../utils/datetime";

const Channel = () => {
    const { id } = useParams();

    const { user } = useUser();

    const [userData, setUserData] = useState(null);
    const [userVideos, setUserVideos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [descriptionSliced, setDescriptionSliced] = useState(true);
    const maxDescriptionLength = 100;
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            setError(null);
            setUserData(null);
            setUserVideos([]);
            setDescriptionSliced(true);

            try {
                const response = await fetch(`${api}/user/${id}`);

                if(!response.ok) {
                    const errorData = await response.json();
                    setError({
                        status: response.status,
                        message: errorData.message
                    });
                    document.title = "Brak użytkownika - WebVOD";
                    return;
                }

                const data = await response.json();
                data.description = data.description || "";
                data.imageUrl = data.imageUrl ? api + data.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg";

                document.title = `${data.login} - WebVOD`;
                setUserData(data);
            } catch {
                setError({
                    status: 500,
                    message: "Wystąpił niespodziewany błąd. Spróbuj ponownie później."
                });
                document.title = "Brak użytkownika - WebVOD";
            } finally {
                setLoading(false);
            }
        };
        
        // const videos = [
        //     {
        //         id: 1,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     },
        //     {
        //         id: 2,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     },
        //     {
        //         id: 3,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     },
        //     {
        //         id: 4,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     },
        //     {
        //         id: 5,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     },
        //     {
        //         id: 6,
        //         thumbnail: "https://www.techsmith.com/blog/wp-content/uploads/2023/03/how-to-make-a-youtube-video.png",
        //         title: "Fajny film",
        //         views: 72062,
        //         date: "2024-06-24T12:32:25Z",
        //         duration: 1162
        //     }
        // ]

        getProfile();
        // setUserVideos(videos);
    }, [id]);

    if (error) {
        return (
            <div className="mt-4 text-center">
                {error.status === 404 ? (
                    <figure className="inline-block w-full">
                        <img
                            src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7899.jpg"
                            className="w-full h-auto"
                            alt="404"
                            style={{ maxWidth: "450px" }}
                        />
                        <figcaption className="mt-2">{error.message}</figcaption>
                    </figure>
                ) : (
                    error.message
                )}
            </div>
        );
    }

    if(loading) {
        return (
            <div className="mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if(!userData) return null;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col ratio ratio-1x1 p-0" style={{maxWidth: "160px"}}>
                    <img className="img-fluid object-fit-cover w-100 h-100 rounded-circle" src={userData.imageUrl} alt="Zdjęcie kanału" />
                </div>
            </div>
            <div className="row mt-2">
                <div className="col text-center">
                    <h1 className="mb-0">{userData.login}</h1>
                </div>
            </div>
            <div className="row mt-2">
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
            {user && user.login.toLowerCase() === id.toLowerCase() && (
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
            )}
            <div className="row mt-4 border-top border-2">
                {userVideos.map(video => (
                    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mt-4 d-flex justify-content-center" key={video.id}>
                        <div className="channel-video-card">
                            <div className="row">
                                <div className="col">
                                    <div className="ratio ratio-16x9">
                                        <Link to={`/videos/${video.id}`}>
                                            <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnail} alt="Miniatura" />
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
        </div>
    );
}

export default Channel;
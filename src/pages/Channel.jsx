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
    const [page, setPage] = useState(1);
    const size = 12;
    const [userVideosLoading, setUserVideosLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const [errors, setErrors] = useState({});
    const [userDataLoading, setUserDataLoading] = useState(false);

    const [descriptionSliced, setDescriptionSliced] = useState(true);
    const maxDescriptionLength = 100;
    const maxTitleLength = 50;
    const api = import.meta.env.VITE_API_URL;
    const tmdb = "https://image.tmdb.org/t/p/original"

    useEffect(() => {
        const getProfile = async () => {
            setUserDataLoading(true);
            setErrors({});
            setUserData(null);
            setUserVideos([]);
            setDescriptionSliced(true);

            setPage(1);
            setUserVideosLoading(false);
            setIsScrollEnd(false);

            try {
                const response = await fetch(`${api}/user/${id}`);

                if(!response.ok) {
                    const errorData = await response.json();
                    setErrors((prev) => ({
                        ...prev,
                        userData: {
                            status: response.status,
                            message: errorData.message
                        }
                    }));
                    document.title = "Brak użytkownika - WebVOD";

                    return;
                }

                const data = await response.json();
                data.description = data.description || "";
                data.imageUrl = data.imageUrl ? api + data.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg";

                document.title = `${data.login} - WebVOD`;
                setUserData(data);
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    userData: {
                        status: 500,
                        message: "Wystąpił niespodziewany błąd. Spróbuj ponownie później."
                    }
                }));
                document.title = "Brak użytkownika - WebVOD";
            } finally {
                setUserDataLoading(false);
            }
        };
        
        getProfile();
    }, [id]);

    useEffect(() => {
        const fetchUserVideos = async () => {
            if(isScrollEnd)
                return;

            setUserVideosLoading(true);
    
            try {
                const response = await fetch(`${api}/user/${id}/videos?page=${page}&size=${size}`);
                if(response.ok) {
                    const data = await response.json();

                    if(data.length < size)
                        setIsScrollEnd(true);
                    
                    setUserVideos((prev) => [...prev, ...data]);
                }
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    userVideos: "Wystąpił niespodziewany błąd w trakcie pobierania filmów użytkownika. Spróbuj ponownie później."
                }));
            } finally {
                setUserVideosLoading(false);
            }
        };

        fetchUserVideos();
    }, [page, isScrollEnd]);

    useEffect(() => {
        const handleScroll = () => {
        if (userVideosLoading || isScrollEnd) return;

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [userVideosLoading, isScrollEnd]);

    if (errors.userData) {
        return (
            <div className="mt-4 text-center">
                {errors.userData.status === 404 ? (
                    <figure className="inline-block w-full">
                        <img
                            src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7899.jpg"
                            className="w-full h-auto"
                            alt="404"
                            style={{ maxWidth: "450px" }}
                        />
                        <figcaption className="mt-2">{errors.userData.message}</figcaption>
                    </figure>
                ) : (
                    errors.userData.message
                )}
            </div>
        );
    }

    if(userDataLoading) {
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
                {errors.userVideos && (
                    <div className="mt-4 text-center">
                        {errors.userVideos}
                    </div>
                )}
                {userVideos && !errors.userVideos && (
                    <>
                        {userVideos.map(video => (
                            <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mt-4 d-flex justify-content-center" key={video.id}>
                                <div className="channel-video-card">
                                    <div className="row">
                                        <div className="col">
                                            <div className="ratio ratio-16x9">
                                                <Link to={`/videos/${video.id}`}>
                                                    <img className="img-fluid object-fit-cover w-100 h-100" loading="lazy" src={video.thumbnailPath.includes("/uploads") ? api + video.thumbnailPath : tmdb + video.thumbnailPath} alt="Miniatura" />
                                                    <span className="channel-video-thumbnail-duration">{formatDuration(video.duration)}</span>
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
                                                            {video.title.length > maxTitleLength ? video.title.slice(0, maxTitleLength) + "..." : video.title}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col channel-video-details">{`${video.viewsCount.toLocaleString("pl-PL")} wyświetleń, ${formatDate(video.uploadDate)}`}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        ))}
                        {userVideosLoading && (
                            <div className="text-center mt-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}   
                    </>
                )}
            </div>
        </div>
    );
}

export default Channel;
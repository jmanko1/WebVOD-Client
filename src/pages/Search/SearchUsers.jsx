import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "../../styles/SearchUsers.css";

const SearchUsers = () => {
    const { query } = useParams();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const size = 10;
    const [loading, setLoading] = useState(false);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const [error, setError] = useState(null);

    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            if(isScrollEnd)
                return;

            setLoading(true);
    
            try {
                const response = await fetch(`${api}/user/search?page=${page}&size=${size}&query=${query}`);

                if(!response.ok) {
                    const errorData = await response.json();

                    if(errorData.message) {
                        setError(errorData.message);
                    }

                    return;
                }

                const data = await response.json();

                if(data.length < size)
                    setIsScrollEnd(true);
                
                setUsers((prev) => [...prev, ...data]);
            } catch {
                setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        setError(null);
        document.title = `Wyniki wyszukiwania dla "${query}"`
        fetchUsers();
    }, [page, isScrollEnd, query]);

    useEffect(() => {
        const handleScroll = () => {
            if (loading || isScrollEnd) return;

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            const scrollHeight = document.documentElement.scrollHeight;

            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [query, loading, isScrollEnd]);

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
                            <Link className="nav-link" to={`/search-videos/${query}`}>Filmy</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to={`/search-channels/${query}`}>Kanały</Link>
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
            {!error && users.map((user) => (
                <div className="row mb-4 align-items-center" key={user.login}>
                    <div className="col-2 pe-0" style={{maxWidth: "172px"}}>
                        <div className="ratio ratio-1x1">
                            <Link to={`/channels/${user.login}`}>
                                <img className="img-fluid object-fit-cover w-100 h-100 rounded-circle" loading="lazy" src={user.imageUrl ? api + user.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg"} alt="Zdjęcie kanału" />
                            </Link>
                        </div>
                    </div>
                    <div className="col ps-2">
                        <div className="container">
                            <div className="row">
                                <div className="col search-users-login">
                                    <Link to={`/channels/${user.login}`}>
                                        {user.login}
                                    </Link>
                                </div>
                            </div>
                            <div className="row">
                                {user.description ? (
                                    <div className="col search-users-description">{user.description.length > 100 ? user.description.slice(0, 100) + "..." : user.description}</div>
                                ) : (
                                    <div className="col search-users-description">Brak opisu.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SearchUsers;
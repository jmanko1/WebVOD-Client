import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";

const Layout = () => {
    const [user, setUser] = useState(null);

    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("jwt");
            if(!token) {
                return;
            }

            try {
                const response = await fetch(`${api}/user/my-profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(!response.ok) {
                    if(response.status == 401) {
                        localStorage.removeItem("jwt");
                        return;
                    }
                }

                if(response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch {
                ;
            }
        }

        getProfile();
    }, []);

    return (
        <>
            <nav className="navbar bg-body sticky-top navbar-expand-lg border-bottom">
                <div className="container-fluid">
                    <button className="navbar-toggler navbar-toggler-left ps-0 pe-0 border-0 d-inline" style={{boxShadow: "none"}} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" to="/">WebVOD</Link>
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        <form className="d-flex" role="search">
                            <input
                                className="form-control rounded-end-0 border border-end-0 border-secondary"
                                style={{width: "300px"}}
                                type="search"
                                placeholder="Wyszukaj..."
                                aria-label="Search" 
                            />
                            <button className="btn btn-outline-secondary rounded-start-0" type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                        {user ? (
                            <>
                                <Link role="button" to="/upload" className="btn btn-success mt-2 mt-lg-0 ms-lg-2">
                                    <i className="fa-solid fa-plus"></i>
                                    <span className="ms-1">Nowy film</span>
                                </Link>
                                <div className="btn-group d-none d-lg-inline dropstart ms-1">
                                    <button className="btn p-0 border-0 bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={api + user.imageUrl} alt="Profil" width="40" height="40" className="rounded-circle object-fit-cover" />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to={`/channels/${user.login}`} className="dropdown-item">Strona kanału</Link>
                                        </li>
                                        <li>
                                            <Link to="/videos-manager" className="dropdown-item">Menedżer filmów</Link>
                                        </li>
                                        <li>
                                            <Link to="/channel-settings" className="dropdown-item">Ustawienia</Link>
                                        </li>
                                        <li>
                                            <Link to="/logout" className="dropdown-item">Wyloguj się</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="btn-group mt-2 d-lg-none dropdown ms-1">
                                    <button className="btn p-0 border-0 bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={api + user.imageUrl} alt="Profil" width="40" height="40" className="rounded-circle object-fit-cover" />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to={`/channels/${user.id}`} className="dropdown-item">Strona kanału</Link>
                                        </li>
                                        <li>
                                            <Link to="/videos-manager" className="dropdown-item">Menedżer filmów</Link>
                                        </li>
                                        <li>
                                            <Link to="/channel-settings" className="dropdown-item">Ustawienia</Link>
                                        </li>
                                        <li>
                                            <Link to="/logout" className="dropdown-item">Wyloguj się</Link>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <Link role="button" to="/login" className="btn btn-primary mt-2 mt-lg-0 ms-lg-2">Zaloguj się</Link>  
                        )}
                    </div>
                </div>
            </nav>
            <Sidebar />
            <Outlet />
        </>
    );
}

export default Layout;
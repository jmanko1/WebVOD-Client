import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { scheduleTokenRefresh } from "../utils/auth";
import { useUser } from "../contexts/UserContext";

const Layout = () => {
    const { user, setUser } = useUser();

    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) return;

            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [profileRes, emailRes] = await Promise.all([
                    fetch(`${api}/user/my-profile`, { headers }),
                    fetch(`${api}/user/my-profile/email`, { headers }),
                ]);

                if (profileRes.status === 401 || emailRes.status === 401) {
                    localStorage.removeItem("jwt");
                    setUser(null);
                    return;
                }

                if (!profileRes.ok || !emailRes.ok) {
                    return;
                }

                const [profileData, emailData] = await Promise.all([
                    profileRes.json(),
                    emailRes.text(),
                ]);

                profileData.description = profileData.description || "Brak opisu.";
                profileData.imageUrl = profileData.imageUrl ? api + profileData.imageUrl : "https://agrinavia.pl/wp-content/uploads/2022/03/zdjecie-profilowe-1.jpg";

                const fullProfile = {
                    ...profileData,
                    email: emailData,
                };

                setUser(fullProfile);
            } catch (e) {
                console.error("Błąd podczas pobierania profilu:", e);
            }
        };

        const setRefreshTimeout = async () => {
            const token = localStorage.getItem("jwt");

            let tokenExpired = false;
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Math.floor(Date.now() / 1000);
                    const expiresIn = decoded.exp - currentTime;

                    if (expiresIn > 0) {
                        scheduleTokenRefresh(expiresIn);
                    } else {
                        tokenExpired = true;
                        localStorage.removeItem("jwt");
                    }
                } catch {
                    ;
                }
            }

            if ((!token || tokenExpired) && !sessionStorage.getItem("dontRefresh")) {
                try {
                    const res = await fetch(`${api}/auth/refresh`, {
                        method: "POST",
                        credentials: "include",
                    });

                    if (res.ok) {
                        const data = await res.json();
                        localStorage.setItem("jwt", data.token);
                        sessionStorage.removeItem("dontRefresh");
                        // window.location.reload();
                    } else {
                        sessionStorage.setItem("dontRefresh", "1");
                    }
                } catch {
                    sessionStorage.setItem("dontRefresh", "1");
                }
            }
        }

        (async () => {
            await setRefreshTimeout();
            getProfile();
        })();
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
                                        <img src={user.imageUrl} alt="Profil" width="40" height="40" className="rounded-circle object-fit-cover" />
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
                                        <img src={user.imageUrl} alt="Profil" width="40" height="40" className="rounded-circle object-fit-cover" />
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
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useUser } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const { user } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    const handleCloseOffcanvas = () => {
        const offcanvasEl = document.getElementById('offcanvasExample');
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
        bsOffcanvas.hide();
    }

    return (
        <>
            <nav className="nav flex-column sidebar border-end d-none">
                <Link className="nav-link active" aria-current="page" to="/">
                    <i className="fa-solid fa-house"></i>
                    <span className="ms-2">Główna</span>
                </Link>
                <Link className="nav-link" to="#">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span className="ms-2">Obejrzane filmy</span>
                </Link>
                <Link className="nav-link" to="#">
                    <i className="fa-solid fa-heart"></i>
                    <span className="ms-2">Polubione filmy</span>
                </Link>
                <Link className="nav-link" to="#">
                    <i className="fa-solid fa-video"></i>
                    <span className="ms-2">Moje filmy</span>
                </Link>
                <Link className="nav-link" to="/watch-together">
                    <i className="fa-solid fa-users"></i>
                    <span className="ms-2">Wspólne oglądanie</span>
                </Link>
            </nav>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <nav className="nav flex-column sidebar">
                        <Link className="nav-link active" aria-current="page" to="/" onClick={handleCloseOffcanvas}>
                            <i className="fa-solid fa-house"></i>
                            <span className="ms-2">Główna</span>
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link className="nav-link" to="/history" onClick={handleCloseOffcanvas}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                    <span className="ms-2">Obejrzane filmy</span>
                                </Link>
                                <Link className="nav-link" to="/liked-videos" onClick={handleCloseOffcanvas}>
                                    <i className="fa-solid fa-heart"></i>
                                    <span className="ms-2">Polubione filmy</span>
                                </Link>
                                <Link className="nav-link" to="/videos-manager" onClick={handleCloseOffcanvas}>
                                    <i className="fa-solid fa-video"></i>
                                    <span className="ms-2">Moje filmy</span>
                                </Link>
                            </>
                        )}
                        <Link className="nav-link" to="/watch-together" onClick={handleCloseOffcanvas}>
                            <i className="fa-solid fa-users"></i>
                            <span className="ms-2">Wspólne oglądanie</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};
  
export default Sidebar;
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

const Layout = () => {
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
                        <Link role="button" to="/login" className="btn btn-primary mt-2 mt-lg-0 ms-lg-2">Zaloguj się</Link>
                    </div>
                </div>
            </nav>
            <Sidebar />
            <Outlet />
        </>
    );
}

export default Layout;
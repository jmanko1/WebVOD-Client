import { Link, Outlet } from "react-router-dom";

const Menu = () => {
    return (
        <>
            <nav className="navbar navbar-expand-md border-bottom">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">WebVOD</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        <form className="d-flex" role="search">
                            <input className="form-control rounded-end-0" style={{width: "300px"}} type="search" placeholder="Wyszukaj..." aria-label="Search" />
                            <button className="btn btn-outline-secondary rounded-start-0" type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                        <a role="button" href="/login" className="btn btn-primary mt-2 mt-md-0 ms-md-2">Zaloguj się</a>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
}

export default Menu;
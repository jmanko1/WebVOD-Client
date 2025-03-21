import './Sidebar.css';

const Sidebar = () => {
    return (
        <>
            <nav className="nav flex-column sidebar border-end d-none d-lg-inline">
                <a className="nav-link active" aria-current="page" href="/">
                    <i className="fa-solid fa-house"></i>
                    <span className="ms-2">Główna</span>
                </a>
                <a className="nav-link" href="#">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span className="ms-2">Obejrzane filmy</span>
                </a>
                <a className="nav-link" href="#">
                    <i className="fa-solid fa-video"></i>
                    <span className="ms-2">Moje filmy</span>
                </a>
                <a className="nav-link" href="#">
                    <i className="fa-solid fa-heart"></i>
                    <span className="ms-2">Polubione filmy</span>
                </a>
                <a className="nav-link" href="#">
                    <i class="fa-solid fa-bookmark"></i>
                    <span className="ms-2">Zapisane filmy</span>
                </a>
                <a className="nav-link" href="#">
                    <i className="fa-solid fa-users"></i>
                    <span className="ms-2">Wspólne oglądanie</span>
                </a>
            </nav>
            <div className="offcanvas offcanvas-start d-inline d-lg-none" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <nav className="nav flex-column sidebar">
                        <a className="nav-link active" aria-current="page" href="/">
                            <i className="fa-solid fa-house"></i>
                            <span className="ms-2">Główna</span>
                        </a>
                        <a className="nav-link" href="#">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            <span className="ms-2">Obejrzane filmy</span>
                        </a>
                        <a className="nav-link" href="#">
                            <i className="fa-solid fa-video"></i>
                            <span className="ms-2">Moje filmy</span>
                        </a>
                        <a className="nav-link" href="#">
                            <i className="fa-solid fa-heart"></i>
                            <span className="ms-2">Polubione filmy</span>
                        </a>
                        <a className="nav-link" href="#">
                            <i class="fa-solid fa-bookmark"></i>
                            <span className="ms-2">Zapisane filmy</span>
                        </a>
                        <a className="nav-link" href="#">
                            <i className="fa-solid fa-users"></i>
                            <span className="ms-2">Wspólne oglądanie</span>
                        </a>
                    </nav>
                </div>
            </div>
        </>
    );
};
  
export default Sidebar;
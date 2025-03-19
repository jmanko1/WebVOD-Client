import './Sidebar.css';

const Sidebar = () => {
    return (
        <nav className="nav flex-column sidebar border-end d-none d-lg-inline">
            <a className="nav-link active" aria-current="page" href="/">Główna</a>
            <a className="nav-link" href="#">Historia</a>
            <a className="nav-link" href="#">Moje filmy</a>
            <a className="nav-link" href="#">Polubione filmy</a>
            <a className="nav-link" href="#">Wspólne oglądanie</a>
        </nav>
    );
};
  
export default Sidebar;
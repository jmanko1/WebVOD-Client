import { Link } from "react-router-dom";
import "./ChannelSettingsMenu.css"

const ChannelSettingsMenu = ({ element }) => {
    return (
        <>
            <div className="account-settings-title mb-3">
                <h2>Ustawienia konta</h2>
            </div>
            <div className="account-settings">
                <ul className="d-flex d-lg-inline">
                    <Link to="/channel-settings/channel-info">
                        <li className={element == 0 ? "active" : ""}>
                            <i className="fa-solid fa-user"></i>
                            <span className="label ms-2">Informacje o kanale</span>
                        </li>
                    </Link>
                    <Link to="/channel-settings/password-security">
                        <li className={element == 1 ? "active" : ""}>
                            <i className="fa-solid fa-lock"></i>
                            <span className="label ms-2">Hasło i zabezpieczenia</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    )
}

export default ChannelSettingsMenu;
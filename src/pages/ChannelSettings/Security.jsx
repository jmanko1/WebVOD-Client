import { Link, useNavigate } from "react-router-dom";
import ChannelSettingsMenu from "../../components/ChannelSettings/ChannelSettingsMenu";
import { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

const Security = () => {
    const { user } = useUser();

    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        document.title = "Ustawienia - WebVOD";
    }, []);
    
    if(!user)
        return;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-3 offset-1 border-end border-secondary">
                    <ChannelSettingsMenu element={1} />
                </div>
                <div className="col-7">
                    <div className="box-title">
                        <h1>Hasło i zabezpieczenia</h1>
                    </div>
                    <div className="box-description">
                        Zarządzaj hasłem, uwierzytelnianiem dwuskładnikowym i sprawdź, jakie urządzenia były używane do logowania na Twoje konto.
                    </div>
                    <div className="box mt-3">
                        <Link to="/channel-settings/password-security/change-password" className="item">
                            Zmień hasło
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                        <Link to="/channel-settings/password-security/tfa" className="item">
                            Uwierzytelnianie dwuskładnikowe
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                        <Link to="#" className="item">
                            Miejsca logowania
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Security;
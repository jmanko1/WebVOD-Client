import { Link } from "react-router-dom";
import ChannelSettingsMenu from "../../components/ChannelSettings/ChannelSettingsMenu";

const ChannelInfo = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-3 offset-1 border-end border-secondary">
                    <ChannelSettingsMenu element={0} />
                </div>
                <div className="col-7">
                    <div className="box-title">
                        <h1>Informacje o kanale</h1>
                    </div>
                    <div className="box-description">
                        Zarządzaj adresem email przypisanym do Twojego konta, opisem kanału i zdjęciem profilowym.
                    </div>
                    <div className="box mt-3">
                        <Link to="/channel-settings/password-security/change-password" className="item">
                            Nazwa użytkownika
                        </Link>
                        <Link to="/channel-settings/password-security/change-password" className="item">
                            Opis kanału
                        </Link>
                        <Link to="/channel-settings/password-security/change-password" className="item">
                            Adres email
                        </Link>
                        <Link to="/channel-settings/password-security/change-password" className="item">
                            Zdjęcie profilowe
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChannelInfo;
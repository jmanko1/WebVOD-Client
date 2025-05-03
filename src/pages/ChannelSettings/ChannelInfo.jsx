import { Link } from "react-router-dom";
import ChannelSettingsMenu from "../../components/ChannelSettings/ChannelSettingsMenu";
import { useEffect, useState } from "react";

const ChannelInfo = () => {
    const [userData, setUserData] = useState(null);

    const maxDescriptionLength = 60;

    useEffect(() => {
        const data = {
            id: 1,
            login: "tomek123",
            email: "tomek123@gmail.com",
            description: "Welcome to The Silent Strategist—the ultimate channel for mastering power, control, and influence through Stoicism and Dark Psychology. Power isn’t given—it’s taken. If you want to stay two steps ahead in relationships, command respect, and build an unshakable mindset, we provide proven psychological tactics to help you dominate every aspect of life. Inspired by Machiavelli, Sun Tzu, and Marcus Aurelius, we focus on No Contact, emotional detachment, power moves, and silent influence—helping you turn pain into power and make them regret underestimating you.",
            imageURL: null,
            signupDate: "2025-01-25"
        }

        if(!data.description)
            data.description = "Brak opisu";

        setUserData(data);
    }, []);

    if(!userData) {
        return <p>Ładowanie...</p>
    }

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
                        <div className="item d-flex justify-content-between align-items-center">
                            <div>
                                <div className="label">Nazwa użytkownika</div>
                                <div className="subtext">{userData.login}</div>
                            </div>
                        </div>
                        <Link to="/channel-settings/password-security/change-password" className="item d-flex justify-content-between align-items-center">
                            <div>
                                <div className="label">Adres email</div>
                                <div className="subtext">{userData.email}</div>
                            </div>
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                        <Link to="/channel-settings/password-security/change-password" className="item d-flex justify-content-between align-items-center">
                            <div>
                                <div className="label">Opis kanału</div>
                                <div className="subtext">
                                    {userData.description.length > maxDescriptionLength ? (
                                        userData.description.slice(0, maxDescriptionLength) + "..."
                                    ) : (
                                        userData.description
                                    )}
                                </div>
                            </div>
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                        <Link to="/channel-settings/password-security/change-password" className="item d-flex justify-content-between align-items-center">
                            <div>
                                <div className="label">Zdjęcie profilowe</div>
                            </div>
                            <i className="arrow fa-solid fa-chevron-right"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChannelInfo;
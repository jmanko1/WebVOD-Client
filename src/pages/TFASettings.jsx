import { QRCodeCanvas } from "qrcode.react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TFASettings = () => {
    const [isTfaEnabled, setIsTfaEnabled] = useState(false);
    // const [isFormShown, setIsFormShown] = useState(false);
    const [qrCodeText, setQrCodeText] = useState(null);

    useEffect(() => {
        const qrCodeText = "JBSWY3DPEHPK3PXPU3LS";

        setIsTfaEnabled(false);
        // setIsFormShown(false);
        setQrCodeText(qrCodeText);
    }, []);

    // const handleFormShow = () => {
    //     setIsFormShown(!isFormShown);
    // };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div style={{maxWidth: "600px"}} className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center">
            <div className="mb-3">
                {isTfaEnabled ? (
                    <h1 className="fw-bold" style={{fontSize: "18px"}}>Uwierzytelnianie dwuskładnikowe (włączone)</h1>
                ) : (
                    <h1 className="fw-bold" style={{fontSize: "18px"}}>Uwierzytelnianie dwuskładnikowe (wyłączone)</h1>
                )}
            </div>
            {isTfaEnabled ? (
                <div className="mb-3">Podaj kod z aplikacji, aby <strong>wyłączyć</strong> uwierzytelnianie dwuskładnikowe <strong>(niezalecane)</strong>:</div>
            ) : (
                <>
                    <div className="mb-3">Pobierz aplikację uwierzytelniającą np. Google Authenticator.</div>
                    <div className="mb-3">Zeskanuj poniższy kod QR:</div>
                    {qrCodeText && (
                        <div className="mb-3" id="qr">
                            <QRCodeCanvas
                                value={qrCodeText}
                                size={160}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                            />
                        </div>
                    )}
                    {/* <div className="alert alert-danger" id="error" style="display: none"></div> */}
                    <div className="mb-3">
                        <strong>Nikomu nie ujawniaj powyższego kodu QR.</strong>
                    </div>
                    <div className="mb-3">Podaj kod z aplikacji, aby <strong>włączyć</strong> uwierzytelnianie dwuskładnikowe <strong>(zalecane)</strong>:</div>
                </>
           )}
            <div className="mb-3" id="form">
                <form onSubmit={handleCodeSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            id="code"
                            style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                            className="form-control text-center mx-auto"
                            placeholder="6-cyfrowy kod"
                            required
                            maxLength="6" 
                        />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit" id="submit">Zatwierdź</button>
                    </div>
                    <div id="tfaUpdateError" className="mb-3 text-danger"></div>
                    <div className="mb-3 text-success" id="success"></div>
                </form>
            </div>
            <div className="mt-4">
                <Link to="/channel-settings" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    )
}

export default TFASettings;
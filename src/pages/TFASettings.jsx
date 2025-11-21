import { QRCodeCanvas } from "qrcode.react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { validateCode, validatePassword } from "../utils/validator";
import OtpInput from "react-otp-input";

const TFASettings = () => {
    const { user, setUser } = useUser();
    
    const [qrCodeText, setQrCodeText] = useState(null);

    const [form, setForm] = useState({
        password: "",
        code: ""
    })

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
    const [mainError, setMainError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getQrCode = async () => {
            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            setLoading(true);
            document.title = "Uwierzytelnianie dwuskładnikowe - WebVOD";
            
            try {
                const response = await fetch(`${api}/user/my-profile/tfa-qr-code`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(!response.status == 401) {
                    navigate("/logout");
                    return;
                }

                if(!response.ok)
                    return;

                const qrCode = await response.text();
                setQrCodeText(qrCode);
            } catch {
                setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        }

        getQrCode();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleCodeChange = (codeInput) => {
        setForm((prev) => ({ ...prev, code: codeInput }));
        setErrors((prev) => ({ ...prev, code: null }));
    }

    const validateForm = () => {
        const newErrors = {};

        if (!validatePassword(form.password, (e) => (newErrors.password = e))) {;}
        if (!validateCode(form.code, (e) => (newErrors.code = e))) {;}

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess(null);
        setMainError(null);

        if(!validateForm()) {
            return;
        }

        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/logout");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${api}/user/my-profile/toggle-tfa`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const newErrors = {};

                if (errorData.message) {
                    setMainError(errorData.message);
                }
                if (errorData.errors?.Password) {
                    newErrors.password = errorData.errors.Password[0];
                } 
                if (errorData.errors?.Code) {
                    newErrors.code = errorData.errors.Code[0];
                }

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            if(qrCodeText) {
                setQrCodeText(null);
                setSuccess("Uwierzytelnianie dwuskładnikowe zostało włączone.");
            }
            else setSuccess("Uwierzytelnianie dwuskładnikowe zostało wyłączone.");
            setForm({ password: "", code: "" });
            setUser((prev) => ({
                ...prev,
                tfaEnabled: !user.tfaEnabled
            }));
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    if(!user)
        return;

    return (
        <div style={{maxWidth: "600px"}} className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center">
            <div className="mb-3">
                {qrCodeText ? (
                    <h1 className="fw-bold" style={{fontSize: "18px"}}>Uwierzytelnianie dwuskładnikowe <i className="fa-solid fa-xmark text-danger"></i></h1>
                ) : (
                    <h1 className="fw-bold" style={{fontSize: "18px"}}>Uwierzytelnianie dwuskładnikowe <i className="fa-solid fa-check text-success"></i></h1>
                )}
            </div>
            {qrCodeText ? (
                <>
                    <div className="mb-3">Pobierz aplikację uwierzytelniającą np. Google Authenticator.</div>
                    <div className="mb-3">Zeskanuj poniższy kod QR:</div>
                    {qrCodeText && (
                        <div className="mb-3" id="qr">
                            <QRCodeCanvas
                                value={qrCodeText}
                                size={180}
                                bgColor={"#fff"}
                                fgColor={"#000"}
                                level={"H"}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <strong>Nikomu nie ujawniaj powyższego kodu QR.</strong>
                    </div>
                    <div className="mb-3">Podaj hasło oraz kod z aplikacji, aby <strong>włączyć</strong> uwierzytelnianie dwuskładnikowe <strong>(zalecane)</strong>:</div>
                </>
            ) : (
                <div className="mb-3">Podaj hasło oraz kod z aplikacji, aby <strong>wyłączyć</strong> uwierzytelnianie dwuskładnikowe <strong>(niezalecane)</strong>:</div>
           )}
            <div id="form">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Hasło</label>
                        <input
                            type="password"
                            style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                            className={`form-control mx-auto ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoFocus
                        />
                        {errors.password && (
                            <div className="invalid-feedback">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">Kod z aplikacji</label>
                        <OtpInput
                            value={form.code}
                            onChange={handleCodeChange}
                            numInputs={6}
                            renderSeparator={<span style={{ width: "5px" }}></span>}
                            inputType="tel"
                            renderInput={(props) => <input {...props} />}
                            containerStyle={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}                        
                            inputStyle={{
                                border: `1px solid ${errors.code ? "red" : "#dee2e6"}`,
                                backgroundColor: "#f4f1f7",
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                            }}
                            focusStyle={{
                                outline: "none"
                            }}
                        />
                        {errors.code && (
                            <div className="text-danger mt-1" style={{fontSize: "0.875em"}}>
                                {errors.code}
                            </div>
                        )}
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit">Zatwierdź</button>
                    </div>
                    {mainError && (
                        <div className="mt-3" style={{color: "red"}}>
                            {mainError}
                        </div>
                    )}
                    {loading && (
                        <div className="spinner-border mt-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                    {success && (
                        <div className="mt-3" style={{color: "green"}}>
                            {success}
                        </div>
                    )}
                </form>
            </div>
            <div className="mt-4">
                <Link to="/channel-settings/password-security" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    )
}

export default TFASettings;
import { useEffect, useRef, useState } from "react";
import { validateEmail } from "../utils/validator";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const InitiateResetPassword = () => {
    const [email, setEmail] = useState("");
    
    const [captchaToken, setCaptchaToken] = useState("");
    const captchaRef = useRef();

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        document.title = "Zresetuj hasło - WebVOD";
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors(prev => ({ ...prev, email: null }));
    }

    const handleCaptchaTokenChange = (token) => {
        setCaptchaToken(token);
        setErrors(prev => ({ ...prev, captchaToken: null }));
    }

    const validateForm = () => {
        const newErrors = {};
        
        if (!validateEmail(email, (e) => (newErrors.email = e))) {;}

        if (!captchaToken.trim()) newErrors.captchaToken = "Potwierdź, że nie jesteś robotem.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setMainError(null);
        setLoading(true);
        setSuccess(null);

        if(!validateForm()) {
            setLoading(false);
            return;
        }

        const api = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${api}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, captchaToken }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const newErrors = {};

                if (errorData.message) {
                    setMainError(errorData.message);
                }
                if (errorData.errors?.Email) {
                    newErrors.email = errorData.errors.Email[0];
                }
                if (errorData.errors?.CaptchaToken) {
                    newErrors.captchaToken = errorData.errors.CaptchaToken[0];
                }

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            const success = await response.text();
            setSuccess(success);

            setEmail("");
            setCaptchaToken("");
            captchaRef.current?.reset();
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "600px"}}>
            <img src="/android-chrome-512x512.png" style={{maxWidth: "75px", height: "auto"}} />
            <h1 className="mt-4" style={{fontSize: "28px"}}>Zresetuj hasło</h1>
            <div className="form-text mt-3 ps-3 pe-3">Podaj adres email przypisany do Twojego konta, a wyślemy Tobie link, który umożliwi Ci ustawienie nowego hasła.</div>
            <form className="mt-3 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adres email</label>
                    <input
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={email}
                        onChange={handleEmailChange}
                        className={`form-control mx-auto ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        autoFocus
                    />
                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email}
                        </div>
                    )}
                </div>
                <div className="d-flex justify-content-center">
                    <ReCAPTCHA
                        ref={captchaRef}
                        className={errors.captchaToken ? "border border-danger" : ""}
                        sitekey="6LfpVtUrAAAAADUqygar0I8-Ig1-_HmDdZohel0N"
                        onChange={(token) => handleCaptchaTokenChange(token)}
                        onExpired={() => setCaptchaToken("")}
                    />
                </div>
                {errors.captchaToken && (
                    <div className="text-danger mt-1" style={{fontSize: "0.875em"}}>
                        {errors.captchaToken}
                    </div>
                )}
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary">Wyślij maila</button>
                </div>
                {loading && (
                    <div className="spinner-border mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {mainError && (
                    <div className="mt-3" style={{color: "red"}}>
                        {mainError}
                    </div>
                )}
                {success && (
                    <div className="mt-3" style={{color: "green"}}>
                        {success}
                    </div>
                )}
            </form>
            <div>
                <Link to="/login" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    );
}

export default InitiateResetPassword;
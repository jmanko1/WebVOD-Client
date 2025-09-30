import { useEffect, useRef, useState } from "react";
import { validateLogin, validatePassword } from "../utils/validator";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
    const [form, setForm] = useState({
        login: "",
        password: "",
        checkedSave: false
    })
    const [captchaToken, setCaptchaToken] = useState("");
    const captchaRef = useRef();

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Zaloguj się - WebVOD";
    }, []);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleCaptchaTokenChange = (token) => {
        setCaptchaToken(token);
        setErrors(prev => ({ ...prev, captchaToken: null }));
    }

    const validateForm = () => {
        const newErrors = {};
        if (!validateLogin(form.login, (e) => (newErrors.login = e))) {;}
        if (!validatePassword(form.password, (e) => (newErrors.password = e))) {;}

        if (!captchaToken.trim()) newErrors.captchaToken = "Potwierdź, że nie jesteś robotem.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMainError(null);
        setLoading(true);

        if(!validateForm()) {
            setLoading(false);
            return;
        }

        const api = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${api}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...form, captchaToken }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const newErrors = {};

                if (errorData.message) {
                    setMainError(errorData.message);
                }
                if (errorData.errors?.Login) {
                    newErrors.login = errorData.errors.Login[0];
                } 
                if (errorData.errors?.Password) {
                    newErrors.password = errorData.errors.Password[0];
                } 
                if (errorData.errors?.CaptchaToken) {
                    newErrors.captchaToken = errorData.errors.CaptchaToken[0];
                }

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            const data = await response.json();

            if(data.tfaRequired) {
                navigate("/login/code");
                return;
            }

            localStorage.setItem("jwt", data.token);
            sessionStorage.removeItem("dontRefresh");
            window.location.href = "/";
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zaloguj się</h1>
            <form className="mt-4 mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Login</label>
                    <input
                        name="login"
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.login}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.login ? 'is-invalid' : ''}`}
                        id="login"
                        autoFocus
                    />
                    {errors.login && (
                        <div className="invalid-feedback">
                            {errors.login}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Hasło</label>
                    <input
                        name="password"
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.password}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.password ? 'is-invalid' : ''}`}
                        id="password" 
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <input
                        name="checkedSave"
                        type="checkbox"
                        checked={form.checkedSave}
                        onChange={handleChange}
                        className="form-check-input text-dark"
                        id="checkedSave"
                    />
                    <label htmlFor="checkedSave" className="form-check-label ms-2">Zapamiętaj konto</label>
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>Zaloguj się</button>
                </div>
                {loading && (
                    <div className="spinner-border mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {mainError && (
                    <div className="mt-3" style={{ color: "red" }}>
                        {mainError}
                    </div>
                )}
            </form>
            <div className="mb-4">
                <Link to="/reset-password" className="text-decoration-none">Zresetuj hasło</Link>
            </div>
            <div>
                Nie masz jeszcze konta? <Link to="/register" className="text-decoration-none">Zarejestruj się</Link>
            </div>
        </div>
    );
}

export default Login;
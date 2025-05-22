import { useState } from "react";
import { validateLogin, validatePassword } from "../utils/validator";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({
        login: "",
        password: ""
    })

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validateLogin(form.login, (e) => (newErrors.login = e))) {}
        if (!validatePassword(form.password, (e) => (newErrors.password = e))) {}

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
                body: JSON.stringify(form),
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

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                if(data.tfaRequired) {
                    navigate("/login/code");
                    return;
                }

                localStorage.setItem("jwt", data.token);
                location.href = "/";
            }
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
                <div>
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
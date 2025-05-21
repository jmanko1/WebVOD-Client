import { useState } from "react";
import { validateConfirmPassword, validateEmail, validateLogin, validatePassword } from "../utils/validator";
import { Link } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        login: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    }; 

    const validateForm = () => {
        const newErrors = {};
        if (!validateLogin(form.login, (e) => (newErrors.login = e))) {}
        if (!validateEmail(form.email, (e) => (newErrors.email = e))) {}
        if (!validatePassword(form.password, (e) => (newErrors.password = e))) {}
        if (!validateConfirmPassword(form.password, form.confirmPassword, (e) => (newErrors.confirmPassword = e))) {}

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess(null);
        setMainError(null);
        setLoading(true);

        if(!validateForm()) {
            setLoading(false);
            return;
        }

        const api = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${api}/auth/register`, {
                method: "POST",
                headers: {
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
                if (errorData.errors?.Login) {
                    newErrors.login = errorData.errors.Login[0];
                } 
                if (errorData.errors?.Email) {
                    newErrors.email = errorData.errors.Email[0];
                } 
                if (errorData.errors?.Password) {
                    newErrors.password = errorData.errors.Password[0];
                } 
                if (errorData.errors?.ConfirmPassword) {
                    newErrors.confirmPassword = errorData.errors.ConfirmPassword[0];
                }

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            if (response.ok) {
                setSuccess("Rejestracja zakończona sukcesem. Możesz teraz się zalogować."); 
                setForm({ login: "", email: "", password: "", confirmPassword: "" });
            }
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "600px"}}>
            <h1 style={{fontSize: "28px"}}>Zarejestruj się</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
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
                    <label htmlFor="email" className="form-label">Adres email</label>
                    <input
                        type="text"
                        name="email"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.email}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                    />
                    {errors.email && (
                        <div className="invalid-feedback">
                            {errors.email}
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
                    <label htmlFor="confirm-password" className="form-label">Potwierdź hasło</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirm-password" 
                    />
                    {errors.confirmPassword && (
                        <div className="invalid-feedback">
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>
                <div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>Zarejestruj się</button>
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
                {success && (
                    <div className="mt-3" style={{color: "green"}}>
                        {success}
                    </div>
                )}
            </form>
            <div>
                Masz już konto? <Link to="/login" className="text-decoration-none">Zaloguj się</Link>
            </div>
        </div>
    );
}

export default Register;
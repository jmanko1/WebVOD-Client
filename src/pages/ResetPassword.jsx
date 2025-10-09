import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { validateCode, validateConfirmPassword, validatePassword } from "../utils/validator";

const ResetPassword = () => {
    const { token } = useParams();

    const [form, setForm] = useState({
        token: token,
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({});
    const [mainError, setMainError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Zresetuj hasło - WebVOD";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    }; 

    const validateForm = () => {
        const newErrors = {};
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
            const response = await fetch(`${api}/auth/reset-password/complete`, {
                method: "PUT",
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
                if (errorData.errors?.Token) {
                    newErrors.token = errorData.errors.Token[0];
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

            setSuccess("Hasło zostało zresetowane."); 
            setForm({ token: token, password: "", confirmPassword: "" });
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
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nowe hasło</label>
                    <input
                        type="password"
                        name="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.password}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        autoFocus
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        name="confirmPassword"
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
                    <button type="submit" className="btn btn-primary">Zresetuj hasło</button>
                </div>
                {loading && (
                    <div className="spinner-border mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {errors.token && (
                    <div className="mt-3" style={{ color: "red" }}>
                        {errors.token}
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
                <Link to="/reset-password" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    );
}

export default ResetPassword;
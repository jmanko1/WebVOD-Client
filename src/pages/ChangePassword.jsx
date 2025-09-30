import { useEffect, useState } from "react";
import { validateCode, validateConfirmPassword, validatePassword } from "../utils/validator";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import OtpInput from "react-otp-input";

const ChangePassword = () => {
    const { user } = useUser();

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        code: ""
    });

    const [errors, setErrors] = useState({});

    const [mainError, setMainError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if(!token) {
            navigate("/login");
            return;
        }

        document.title = "Zmiana hasła - WebVOD";
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
        if (!validatePassword(form.oldPassword, (e) => (newErrors.oldPassword = e))) {;}
        if (!validatePassword(form.newPassword, (e) => (newErrors.newPassword = e))) {;}
        if (!validateConfirmPassword(form.newPassword, form.confirmNewPassword, (e) => (newErrors.confirmNewPassword = e))) {;}
        if (user.tfaEnabled && !validateCode(form.code, (e) => (newErrors.code = e))) {;}

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

        const api = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${api}/user/my-profile/change-password`, {
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
                if (errorData.errors?.OldPassword) {
                    newErrors.oldPassword = errorData.errors.OldPassword[0];
                } 
                if (errorData.errors?.NewPassword) {
                    newErrors.newPassword = errorData.errors.NewPassword[0];
                } 
                if (errorData.errors?.ConfirmNewPassword) {
                    newErrors.confirmNewPassword = errorData.errors.ConfirmNewPassword[0];
                } 
                if (errorData.errors?.Code) {
                    newErrors.code = errorData.errors.Code[0];
                }

                setErrors((prev) => ({ ...prev, ...newErrors }));
                return;
            }

            setSuccess("Hasło zostało zmienione."); 
            setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "", code: "" });
        } catch {
            setMainError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    if(!user)
        return;

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "600px"}}>
            <h1 style={{fontSize: "28px"}}>Zmiana hasła</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">Aktualne hasło</label>
                    <input
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.oldPassword}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.oldPassword ? 'is-invalid' : ''}`}
                        id="oldPassword"
                        name="oldPassword"
                        autoFocus
                    />
                    {errors.oldPassword && (
                        <div className="invalid-feedback">
                            {errors.oldPassword}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nowe hasło</label>
                    <input
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.newPassword}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.newPassword ? 'is-invalid' : ''}`}
                        id="newPassword"
                        name="newPassword"
                    />
                    {errors.newPassword && (
                        <div className="invalid-feedback">
                            {errors.newPassword}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">Potwierdź nowe hasło</label>
                    <input
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={form.confirmNewPassword}
                        onChange={handleChange}
                        className={`form-control mx-auto ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                    />
                    {errors.confirmNewPassword && (
                        <div className="invalid-feedback">
                            {errors.confirmNewPassword}
                        </div>
                    )}
                </div>
                {user.tfaEnabled && (
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
                )}
                <div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>Zmień hasło</button>
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
            <div>
                <Link to="/channel-settings/password-security" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    );
}

export default ChangePassword;
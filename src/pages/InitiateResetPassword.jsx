import { useState } from "react";
import { validateEmail } from "../utils/validator";
import { Link } from "react-router-dom";

const InitiateResetPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setEmailError(null);
        setError(null);
        setLoading(true);
        setSuccess(null);

        const isEmailValid = validateEmail(email, setEmailError);
        if(!isEmailValid) {
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
                body: JSON.stringify(email),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.message) {
                    setError(errorData.message);
                }
                else if (errorData.errors?.email) {
                    setEmailError(errorData.errors.email[0]);
                } 

                return;
            }

            if (response.ok) {
                const success = await response.text();
                setSuccess(success);
                setEmail("");
            }
        } catch {
            setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zresetuj hasło</h1>
            {/* <p className="mt-4" style={{color: "#66676a", fontSize: "14px"}}>Na podany adres e-mail zostanie wysłana wiadomość z linkiem. Po kliknięciu w link, możliwe będzie ustawienie nowego hasła.</p> */}
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <div className="form-text">Na podany adres e-mail zostanie wysłana wiadomość z linkiem. Po kliknięciu w link, możliwe będzie ustawienie nowego hasła.</div>
                    <label htmlFor="email" className="form-label mt-3">Adres email</label>
                    <input
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={email}
                        onChange={handleEmailChange}
                        className={`form-control mx-auto ${emailError ? 'is-invalid' : ''}`}
                        id="email" 
                    />
                    {emailError && (
                        <div className="invalid-feedback">
                            {emailError}
                        </div>
                    )}
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Wyślij maila</button>
                </div>
                {loading && (
                    <div className="spinner-border mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {error && (
                    <div className="mt-3" style={{color: "red"}}>
                        {error}
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
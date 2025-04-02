import { useState } from "react";
import { validateEmail } from "../utils/validator";
import { Link } from "react-router-dom";

const InitiateResetPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isEmailValid = validateEmail(email, setEmailError);
        if(!isEmailValid)
            return;

        console.log(email);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zresetuj hasło</h1>
            <p className="mt-4" style={{color: "#66676a", fontSize: "14px"}}>Na podany adres e-mail zostanie wysłana wiadomość z linkiem. Po kliknięciu w link, możliwe będzie ustawienie nowego hasła.</p>
            <form className="mt-3 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adres email</label>
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
                <button type="submit" className="btn btn-primary">Wyślij maila</button>
                {error && (
                    <div style={{color: "red"}}>
                        {error}
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
import { useRef, useState } from "react";
import { validateConfirmPassword, validateEmail, validateLogin, validatePassword } from "../utils/validator";
import { Link } from "react-router-dom";

const Register = () => {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const handleLoginChange = (e) => {
        setLogin(e.target.value);
        setLoginError(null);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(null);
    }

    const handlePasswordChange = (e) => {
        setPasswordError(null);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isLoginValid = validateLogin(login, setLoginError);
        const isPasswordValid = validatePassword(password, setPasswordError);
        const isEmailValid = validateEmail(email, setEmailError);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword, setConfirmPasswordError);

        if(!isLoginValid || !isPasswordValid || !isEmailValid || !isConfirmPasswordValid)
            return;
        
        console.log(login, email, password, confirmPassword);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zarejestruj się</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Login</label>
                    <input
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={login}
                        onChange={handleLoginChange}
                        className={`form-control mx-auto ${loginError ? 'is-invalid' : ''}`}
                        id="login" 
                    />
                    {loginError && (
                        <div className="invalid-feedback">
                            {loginError}
                        </div>
                    )}
                </div>
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
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Hasło</label>
                    <input
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={password}
                        onChange={handlePasswordChange}
                        className={`form-control mx-auto ${passwordError ? 'is-invalid' : ''}`}
                        id="password" 
                    />
                    {passwordError && (
                        <div className="invalid-feedback">
                            {passwordError}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Potwierdź hasło</label>
                    <input
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={`form-control mx-auto ${confirmPasswordError ? 'is-invalid' : ''}`}
                        id="confirm-password" 
                    />
                    {confirmPasswordError && (
                        <div className="invalid-feedback">
                            {confirmPasswordError}
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Zarejestruj się</button>
            </form>
            <div>
                Masz już konto? <Link to="/login" className="text-decoration-none">Zaloguj się</Link>
            </div>
        </div>
    );
}

export default Register;
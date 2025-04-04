import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { validateCode, validateConfirmPassword, validatePassword } from "../utils/validator";

const ResetPassword = () => {
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");

    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [codeError, setCodeError] = useState(null);
    const [error, setError] = useState(null);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError(null);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(null);
    }

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        setCodeError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const isPasswordValid = validatePassword(password, setPasswordError);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword, setConfirmPasswordError);
        const isCodeValid = validateCode(code, setCodeError);

        if(!isPasswordValid || !isConfirmPasswordValid || !isCodeValid)
            return;
        
        console.log(password, confirmPassword, code);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zresetuj hasło</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nowe hasło</label>
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
                    <label htmlFor="confirm-password" className="form-label">Potwierdź nowe hasło</label>
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
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Kod z aplikacji</label>
                    <input
                        type="text"
                        maxLength={6}
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={code}
                        onChange={handleCodeChange}
                        className={`form-control mx-auto ${codeError ? 'is-invalid' : ''}`}
                        id="code" 
                    />
                    {codeError && (
                        <div className="invalid-feedback">
                            {codeError}
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Zmień hasło</button>
                {error && (
                    <div className="mt-3" style={{color: "red"}}>
                        {error}
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
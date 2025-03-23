import { useRef, useState } from "react";
import { validateCode, validateConfirmPassword, validatePassword } from "../utils/validator";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");

    const [oldPasswordError, setOldPasswordError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [codeError, setCodeError] = useState(null);
    const [error, setError] = useState(null);

    const oldPasswordInput = useRef();
    const passwordInput = useRef();
    const confirmPasswordInput = useRef();
    const codeInput = useRef();

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
        oldPasswordInput.current.classList.remove("is-invalid");
        setOldPasswordError(null);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        passwordInput.current.classList.remove("is-invalid");
        setPasswordError(null);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        confirmPasswordInput.current.classList.remove("is-invalid");
        setConfirmPasswordError(null);
    }

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        codeInput.current.classList.remove("is-invalid");
        setCodeError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const isOldPasswordValid = validatePassword(oldPassword, setOldPasswordError, oldPasswordInput);
        const isPasswordValid = validatePassword(password, setPasswordError, passwordInput);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword, setConfirmPasswordError, confirmPasswordInput);
        const isCodeValid = validateCode(code, setCodeError, codeInput);

        if(!isOldPasswordValid || !isPasswordValid || !isConfirmPasswordValid || !isCodeValid)
            return;
        
        console.log(oldPassword, password, confirmPassword, code);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zmiana hasło</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="old-password" className="form-label">Aktualne hasło</label>
                    <input
                        ref={oldPasswordInput}
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                        className="form-control mx-auto"
                        id="old-password" 
                    />
                    {oldPasswordError && (
                        <div className="invalid-feedback">
                            {oldPasswordError}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nowe hasło</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control mx-auto"
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
                        ref={confirmPasswordInput}
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="form-control mx-auto"
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
                        ref={codeInput}
                        type="text"
                        maxLength={6}
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={code}
                        onChange={handleCodeChange}
                        className="form-control mx-auto"
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
                <a href="#" className="text-decoration-none">Powrót</a>
            </div>
        </div>
    );
}

export default ChangePassword;
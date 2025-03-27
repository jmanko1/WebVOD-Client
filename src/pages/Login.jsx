import { useRef, useState } from "react";
import { validateLogin, validatePassword } from "../utils/validator";
import { Link } from "react-router-dom";

const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const loginInput = useRef();
    const passwordInput = useRef();

    const handleLoginChange = (e) => {
        setLogin(e.target.value);
        loginInput.current.classList.remove("is-invalid");
        setLoginError(null);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        passwordInput.current.classList.remove("is-invalid");
        setPasswordError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const isLoginValid = validateLogin(login, setLoginError, loginInput);
        const isPasswordValid = validatePassword(password, setPasswordError, passwordInput);

        if(!isLoginValid || !isPasswordValid)
            return;
        
        console.log(login, password);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zaloguj się</h1>
            <form className="mt-4 mb-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Login</label>
                    <input
                        ref={loginInput}
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={login}
                        onChange={handleLoginChange}
                        className="form-control mx-auto"
                        id="login" 
                    />
                    {loginError && (
                        <div className="invalid-feedback">
                            {loginError}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Hasło</label>
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
                <button type="submit" className="btn btn-primary">Zaloguj się</button>
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
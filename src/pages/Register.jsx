import { useRef, useState } from "react";

const Register = () => {
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const loginInput = useRef();
    const passwordInput = useRef();
    const confirmPasswordInput = useRef();
    const emailInput = useRef();

    const validateLogin = (login) => {
        if(login === "" || login == null) {
            setLoginError("Podaj login.");
            loginInput.current.classList.add("is-invalid");
            return false;
        }

        if(login.length < 4) {
            setLoginError("Login musi mieć co najmniej 4 znaki.");
            loginInput.current.classList.add("is-invalid");
            return false;
        }

        if(login.length > 30) {
            setLoginError("Login może mieć maksymalnie 30 znaków.");
            loginInput.current.classList.add("is-invalid");
            return false;
        }

        const loginRegex = /^[a-zA-Z0-9]*$/;
        if(typeof login !== "string" || !loginRegex.test(login)) {
            setLoginError("Login może zawierać tylko znaki alfanumeryczne.");
            loginInput.current.classList.add("is-invalid");
            return false;
        }

        return true;
    }

    const validatePassword = (password) => {
        if(password === "" || password == null) {
            setPasswordError("Podaj hasło.");
            passwordInput.current.classList.add("is-invalid");
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(typeof password !== "string" || !passwordRegex.test(password)) {
            setPasswordError("Hasło musi zawierać co najmniej 8 znaków, jedną małą literę, jedną wielką literę, jedną cyfrę oraz jeden znak specjalny.");
            passwordInput.current.classList.add("is-invalid");
            return false;
        }

        return true;
    }

    const validateEmail = (email) => {
        if(email == null || email === "") {
            setEmailError("Podaj adres email.");
            emailInput.current.classList.add("is-invalid");
            return false;
        }

        if(email.length > 30) {
            setEmailError("Adres email może mieć maksymalnie 30 znaków.");
            emailInput.current.classList.add("is-invalid");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(typeof email !== "string" || !emailRegex.test(email)) {
            setEmailError("Podaj prawidłowy adres email.");
            emailInput.current.classList.add("is-invalid");
            return false;
        }

        return true;
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        if(confirmPassword == null || confirmPassword === "") {
            setConfirmPasswordError("Potwierdź hasło.");
            confirmPasswordInput.current.classList.add("is-invalid");
            return false;
        }

        if(confirmPassword !== password) {
            setConfirmPasswordError("Podane hasła nie są identyczne.")
            confirmPasswordInput.current.classList.add("is-invalid");
            return false;
        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoginError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setEmailError(null);

        loginInput.current.classList.remove("is-invalid");
        passwordInput.current.classList.remove("is-invalid");
        emailInput.current.classList.remove("is-invalid");
        confirmPasswordInput.current.classList.remove("is-invalid");
        
        const isLoginValid = validateLogin(login);
        const isPasswordValid = validatePassword(password);
        const isEmailValid = validateEmail(email);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

        if(!isLoginValid || !isPasswordValid || !isEmailValid || !isConfirmPasswordValid)
            return;
        
        console.log(login, email, password, confirmPassword);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 ps-1 pe-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Zarejestruj się</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Login</label>
                    <input
                        ref={loginInput}
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="form-control mx-auto"
                        id="login" 
                    />
                </div>
                {loginError && (
                    <div className="mb-3" style={{color: "red"}}>
                        {loginError}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adres email</label>
                    <input
                        ref={emailInput}
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control mx-auto"
                        id="email"
                    />
                </div>
                {emailError && (
                    <div className="mb-3" style={{color: "red"}}>
                        {emailError}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Hasło</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control mx-auto"
                        id="password" 
                    />
                </div>
                {passwordError && (
                    <div className="mb-3" style={{color: "red"}}>
                        {passwordError}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Potwierdź hasło</label>
                    <input
                        ref={confirmPasswordInput}
                        type="password"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control mx-auto"
                        id="confirm-password" 
                    />
                </div>
                {confirmPasswordError && (
                    <div className="mb-3" style={{color: "red"}}>
                        {confirmPasswordError}
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Zarejestruj się</button>
            </form>
            <div>
                Masz już konto? <a href="/login" className="text-decoration-none">Zaloguj się</a>
            </div>
        </div>
    );
}

export default Register;
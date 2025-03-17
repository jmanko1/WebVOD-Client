import { useRef, useState } from "react";

const Register = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const loginInput = useRef();
    const passwordInput = useRef();
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoginError(null);
        setPasswordError(null);

        loginInput.current.classList.remove("is-invalid");
        passwordInput.current.classList.remove("is-invalid");
        
        const isLoginValid = validateLogin(login);
        const isPasswordValid = validatePassword(password);

        if(!isLoginValid || !isPasswordValid)
            return;
        
        console.log(login, password);
    }

    return (
        <div className="mt-5 ms-auto me-auto border rounded-5 pt-5 pb-5 text-center" style={{maxWidth: "600px"}}>
            <h1 style={{fontSize: "28px"}}>Zarejestruj się</h1>
            <form className="mt-3 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">Login</label>
                    <input ref={loginInput} type="text" style={{maxWidth: "350px"}} value={login} onChange={(e) => setLogin(e.target.value)} className="form-control mx-auto" id="login" />
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
                        style={{maxWidth: "350px"}}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control mx-auto"
                        id="email"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Hasło</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        style={{maxWidth: "350px"}}
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
                <button type="submit" className="btn btn-primary">Zarejestruj się</button>
            </form>
            <div className="mb-2">
                Masz już konto? <a href="/login">Zaloguj się</a>
            </div>
        </div>
    );
}

export default Register;
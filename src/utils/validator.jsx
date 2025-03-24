export const validateLogin = (login, setLoginError, loginInput) => {
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

export const validatePassword = (password, setPasswordError, passwordInput) => {
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

export const validateConfirmPassword = (password, confirmPassword, setConfirmPasswordError, confirmPasswordInput) => {
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

export const validateEmail = (email, setEmailError, emailInput) => {
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

export const validateCode = (code, setCodeError, codeInput) => {
    if(code == null || code === "") {
        setCodeError("Podaj kod.");
        codeInput.current.classList.add("is-invalid");
        return false;
    }

    const codeRegex = /^[0-9]{6}$/;
    if(typeof code !== "string" || !codeRegex.test(code)) {
        setCodeError("Podaj prawidłowy 6-cyfrowy kod.");
        codeInput.current.classList.add("is-invalid");
        return false;
    }

    return true;
}
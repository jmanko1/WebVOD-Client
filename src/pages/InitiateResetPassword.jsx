import { useRef, useState } from "react";

const InitiateResetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const emailInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        
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
                        ref={emailInput}
                        type="text"
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control mx-auto"
                        id="email" 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Wyślij maila</button>
                {error && (
                    <div style={{color: "red"}}>
                        {error}
                    </div>
                )}
            </form>
            <div>
                <a href="/login" className="text-decoration-none">Powrót</a>
            </div>
        </div>
    );
}

export default InitiateResetPassword;
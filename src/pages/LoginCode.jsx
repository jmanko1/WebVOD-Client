import { useEffect, useState } from "react";
import { validateCode } from "../utils/validator";
import { Link } from "react-router-dom";

const LoginCode = () => {
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Podaj kod - WebVOD";
    }, []);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        setError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setCodeError(null);
        setLoading(true);

        const isCodeValid = validateCode(code, setCodeError);
        if(!isCodeValid) {
            setLoading(false);
            return;
        }

        const api = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${api}/auth/login/code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(code),
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.message) {
                    setError(errorData.message);
                }
                else if (errorData.errors?.code) {
                    setCodeError(errorData.errors.code[0]);
                }

                return;
            }

            const data = await response.json();
            localStorage.setItem("jwt", data.token);
            sessionStorage.removeItem("dontRefresh");
            window.location.href = "/";
        } catch {
            setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Podaj kod z aplikacji</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">6-cyfrowy kod</label>
                    <input
                        type="text"
                        maxLength={6}
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={code}
                        onChange={handleCodeChange}
                        className={`form-control mx-auto ${codeError ? 'is-invalid' : ''}`}
                        id="code"
                        autoFocus
                    />
                    {codeError && (
                        <div className="invalid-feedback">
                            {codeError}
                        </div>
                    )}
                </div>
                <div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>Zatwierdź</button>
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
            </form>
            <div>
                <Link to="/login" className="text-decoration-none">Powrót</Link>
            </div>
        </div>
    );
}

export default LoginCode;
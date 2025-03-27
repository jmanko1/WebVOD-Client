import { useRef, useState } from "react";
import { validateCode } from "../utils/validator";
import { Link } from "react-router-dom";

const LoginCode = () => {
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState(null);
    const [error, setError] = useState(null);

    const codeInput = useRef();

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        codeInput.current.classList.remove("is-invalid");
        setCodeError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const isCodeValid = validateCode(code, setCodeError, codeInput);
        if(!isCodeValid)
            return;

        console.log(code);
    }

    return (
        <div className="mt-5 mx-auto bg-body border border-secondary rounded-5 p-1 pt-5 pb-5 text-center" style={{maxWidth: "475px"}}>
            <h1 style={{fontSize: "28px"}}>Podaj kod z aplikacji</h1>
            <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">6-cyfrowy kod</label>
                    <input
                        ref={codeInput}
                        type="text"
                        maxLength={6}
                        style={{maxWidth: "250px", backgroundColor: "#f4f1f7"}}
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
                <button type="submit" className="btn btn-primary">Zatwierdź</button>
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
import { useRef, useState } from "react";

const LoginCode = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);

    const codeInput = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        
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
                        style={{maxWidth: "300px", backgroundColor: "#f4f1f7"}}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="form-control mx-auto text-center"
                        id="code" 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Zatwierdź</button>
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

export default LoginCode;
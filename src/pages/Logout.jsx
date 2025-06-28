import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { setUser } = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            const token = localStorage.getItem("jwt");
            if(!token) {
                navigate("/login");
                return;
            }

            const api = import.meta.env.VITE_API_URL;
            setLoading(true);

            try {
                const response = await fetch(`${api}/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if(response.status == 401) {
                    localStorage.removeItem("jwt");
                    setUser(null);
                    navigate("/login");
                    return;
                }

                if(response.ok) {
                    setUser(null);
                    sessionStorage.setItem("dontRefresh", "1");
                    localStorage.removeItem("jwt");
                    navigate("/");
                }
            } catch {
                setError("Wystąpił niespodziewany błąd. Spróbuj ponownie później.");
            } finally {
                setLoading(false);
            }
        };

        logout();
    }, []);

    if(loading) {
        return (
            <div className="mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if(error) {
        return (
            <div className="mt-4 text-center">
                {error}
            </div>
        )
    }

    return null;
}

export default Logout;
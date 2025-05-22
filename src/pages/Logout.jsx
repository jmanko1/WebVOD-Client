import { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("jwt");
        location.href = "/";
    }, []);
}

export default Logout;
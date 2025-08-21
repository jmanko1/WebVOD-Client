let refreshTimeout;

export const scheduleTokenRefresh = (expiresInSeconds) => {
    
    if (refreshTimeout) clearTimeout(refreshTimeout);

    const refreshTime = (expiresInSeconds - 10) * 1000;

    refreshTimeout = setTimeout(async () => {
        if(!localStorage.getItem("jwt")) {
            clearTokenRefresh();
            return;
        }
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                sessionStorage.setItem("dontRefresh", "1");
                clearTokenRefresh();
                localStorage.removeItem("jwt");
                if(!sessionStorage.getItem("isUploading"))
                    window.location.reload();
                
                return;
            }

            const data = await res.json();
            localStorage.setItem("jwt", data.token);
            scheduleTokenRefresh(data.expiresIn * 60);
        } catch {
            sessionStorage.setItem("dontRefresh", "1");
            clearTokenRefresh();
            localStorage.removeItem("jwt");
            if(!sessionStorage.getItem("isUploading"))
                window.location.reload();
        }
    }, refreshTime);
};

export const clearTokenRefresh = () => {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
    }
};

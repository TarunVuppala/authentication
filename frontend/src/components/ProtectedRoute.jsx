import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
    const verify = useAuthStore((state) => state.verify);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await verify();
                if (!result.success) {
                    setIsVerifying(false);
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsVerifying(false);
            }
        };

        if (!isAuthenticated) {
            checkAuth();
        } else {
            setIsVerifying(false);
        }
    }, [isAuthenticated, verify]);

    if (isVerifying) {
        return <div>Loading...</div>; 
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

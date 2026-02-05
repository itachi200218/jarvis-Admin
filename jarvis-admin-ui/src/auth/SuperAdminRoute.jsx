import { Navigate } from "react-router-dom";
import { decodeJWT } from "../utils/jwt";

const SuperAdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;

    const user = decodeJWT(token);

    console.log("SUPER ADMIN ROUTE USER:", user);

    if (!user || user.role !== "SUPER_ADMIN") {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default SuperAdminRoute;

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthenticatedRoute({ children }){
    const {user} = useContext(AuthContext);
    let location = useLocation();

    if (user === null) {
        return <Navigate to="/log-in" state={{ from: location.pathname}}/>
    }
    return children;
}
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { LOG_IN_PATH } from "../common/common";

/**
 * An authenticated route component that ensures access only to authenticated users.
 *
 * If the user is not authenticated, it redirects to the login page while preserving
 * the original intended destination.
 *
 * @component
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - The content to render within the authenticated route.
 * @returns {ReactNode} - Rendered component or redirection.
 *
 */
export default function AuthenticatedRoute({ children }) {
  const { user } = useContext(AuthContext);
  let location = useLocation();

  if (user === null) {
    return <Navigate to={LOG_IN_PATH} state={{ from: location.pathname }} />;
  }
  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

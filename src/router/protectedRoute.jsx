import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //const isLoading = useSelector((state) => state.auth.isLoading);

  return (
    <>
      {isAuthenticated ? (
        <>{props.children}</>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

function Nav({ page }) {
  const { user, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg header-dark">
      <div className="container-fluid justify-content-center">
        {page !== "/" && (
          <div className="row me-4">
            <a href="/" type="button" className="btn btn-outline-primary">
              Home
            </a>
          </div>
        )}
        {page !== "/myprofile" && user && (
          <div className="row me-4">
            <Link
              to={`/user/?user=${user.username}`}
              className="text-decoration-none"
            >
              <button type="button" className="btn btn-outline-dark">
                Account
              </button>
            </Link>
          </div>
        )}
        {user && (
          <div className="row me-4">
            <button
              onClick={() => {
                dispatch({ type: "LOGOUT" });
                navigate("/");
              }}
              type="button"
              className="btn btn-outline-dark"
            >
              Logout
            </button>
          </div>
        )}
        {(page !== "/register" || page !== "/login") && !user && (
          <div className="row me-4">
            <a href="/register" type="button" className="btn btn-outline-dark">
              Register
            </a>
          </div>
        )}
        {(page !== "/register" || page !== "/login") && !user && (
          <div className="row me-5">
            <a href="/login" type="button" className="btn btn-outline-dark">
              Login
            </a>
          </div>
        )}
        {page !== "/newpost" && user && (
          <div className="row">
            <a href="/newpost" type="button" className="btn btn-primary btn-lg">
              Create Post
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;

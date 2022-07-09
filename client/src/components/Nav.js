function Nav({ isLoggedIn, page }) {
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
        {page !== "/myprofile" && isLoggedIn && (
          <div className="row me-4">
            <a href="/myprofile" type="button" className="btn btn-outline-dark">
              Account
            </a>
          </div>
        )}
        {isLoggedIn && (
          <div className="row me-4">
            <a href="/logout" type="button" className="btn btn-outline-dark">
              Logout
            </a>
          </div>
        )}
        {(page !== "/register" || page !== "/login") && !isLoggedIn && (
          <div className="row me-4">
            <a href="/register" type="button" className="btn btn-outline-dark">
              Register
            </a>
          </div>
        )}
        {(page !== "/register" || page !== "/login") && !isLoggedIn && (
          <div className="row me-5">
            <a href="/login" type="button" className="btn btn-outline-dark">
              Login
            </a>
          </div>
        )}
        {page !== "/newpost" && isLoggedIn && (
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

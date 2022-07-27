import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { HeaderContext } from "../contexts/HeaderContext";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const header = useContext(HeaderContext);

  useEffect(() => {
    header.setHeaderTitle("Login");
  }, [header]);

  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const loginUser = {
      username: username,
      password: password,
    };
    await axios
      .post("/api/auth/login", loginUser)
      .then((res) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/");
      })
      .catch(async (err) => {
        if (err.response) {
          dispatch({ type: "LOGIN_FAILURE" });
          setError(err.response.data);
        }
      });
  };

  return (
    <div
      style={{ width: 500, marginTop: 20 }}
      className="container justify-content-center"
    >
      <div className="card border-primary ">
        <div className="card-body p-5">
          <form onSubmit={submit} method="post">
            {error && (
              <div className="alert alert-dismissible alert-danger">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                ></button>
                {error}
              </div>
            )}
            <div className="form-group mb-4">
              <label htmlFor="usernameInput">Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="username"
                id="usernameInput"
                className="form-control"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="passwordInput">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="passwordInput"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-outline-info">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

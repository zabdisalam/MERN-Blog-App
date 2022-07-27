import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { HeaderContext } from "../contexts/HeaderContext";

const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);
  const result = await axios.post("/api/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
};

function Register() {
  const [banner, setBanner] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const header = useContext(HeaderContext);

  useEffect(() => {
    header.setHeaderTitle("Register");
  }, [header]);

  const submit = async (event) => {
    event.preventDefault();
    const newUser = {
      banner: banner,
      username: username,
      email: email,
      password: password,
    };
    await axios
      .post("/api/auth/register", newUser)
      .then((res) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/");
      })
      .catch(async (err) => {
        if (err.response) {
          dispatch({ type: "LOGIN_FAILURE" });
          setError(err.response.data);
          const deletedBanner = banner;
          setBanner();
          await axios.delete(deletedBanner);
        }
      });
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setBanner(imagePath);
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
            <div className={`rounded-circle align-items-center`} alt="Avatar">
              {banner ? (
                <img src={banner} alt="Avatar" className="avatar"></img>
              ) : (
                <i className="fas fa-user fa-3x text-info"></i>
              )}
            </div>
            <div className="form-group mb-4">
              <label htmlFor="bannerInput">Avatar</label>
              <input
                onChange={fileSelected}
                accept="image/*"
                type="file"
                id="bannerInput"
                name="image"
                className="form-control"
              />
            </div>
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
              <label htmlFor="emailInput">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="emailInput"
                className="form-control"
                placeholder="Enter email"
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

export default Register;

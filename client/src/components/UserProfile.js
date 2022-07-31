import { useLocation } from "react-router";
import { useEffect, useContext, useState, useLayoutEffect } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import Comment from "./Comment";
import Post from "./Post";

const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);
  const result = await axios.post(
    "http://3.99.131.208:8000/api/image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return result.data;
};

function UserProfile() {
  const location = useLocation();
  const [path, setPath] = useState(location.search.split("=")[1]);
  const [data, setData] = useState({});
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [banner, setBanner] = useState();
  const { user, dispatch } = useContext(UserContext);
  const header = useContext(HeaderContext);

  const [updateMode, setUpdateMode] = useState(false);
  const [error, setError] = useState();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useLayoutEffect(() => {
    header.setHeaderTitle("Account");
    const fetchUser = async () => {
      await axios
        .get(`http://3.99.131.208:8000/api/user/username/${path}`)
        .then((res) => {
          setData(res.data);
          setUsername(res.data.username);
          setEmail(res.data.email);
          if (res.data.banner) setBanner(res.data.banner);
          setPosts([]);
          setComments([]);
        })
        .catch((err) => {
          if (err.response) setError(err.response.data);
        });
    };
    fetchUser();
  }, [header, path]);

  useEffect(() => {
    const fetchPostsandComments = async () => {
      await axios
        .get(`http://3.99.131.208:8000/api/post/username/${data.username}`)
        .then((res) => {
          setPosts(res.data);
        });
      await axios
        .get(`http://3.99.131.208:8000/api/comment/username/${data.username}`)
        .then((res) => {
          setComments(res.data);
        });
    };
    if (Object.keys(data).length !== 0) {
      fetchPostsandComments();
    }
  }, [data]);

  const handleUpdate = async () => {
    const updatedUser = {
      username: username,
      email: email,
      banner: banner,
    };
    console.log(updatedUser);
    console.log(data.banner);
    await axios
      .put("http://3.99.131.208:8000/api/user/", updatedUser)
      .then(async (res) => {
        setUpdateMode(false);
        setPath(username);
        dispatch({ type: "UPDATE_USER", payload: res.data });
        if (data.banner !== banner) {
          await axios
            .delete(`http://3.99.131.208:8000${data.banner}`)
            .then(() => {
              setData(res.data);
            });
        }
      })
      .catch(async (err) => {
        if (data.banner !== banner)
          await axios
            .delete(`http://3.99.131.208:8000${banner}`)
            .then(() => setBanner(data.banner));
        // deletes existing banner if user avatar cant be updated
      });
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setBanner(imagePath);
  };

  return (
    <div className="card card-body container">
      {error ? (
        <div className="alert alert-dismissible alert-danger">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
          ></button>
          {error}
        </div>
      ) : (
        <>
          <div className="row mb-5">
            {banner && !updateMode && (
              <div className="col col-sm-2">
                <img
                  src={`http://3.99.131.208:8000${banner}`}
                  alt="Avatar"
                  className="personal-avatar banner"
                ></img>
              </div>
            )}
            {banner && updateMode && (
              <div className="personal-image col col-sm-2">
                <label htmlFor="bannerInput">
                  <figure className="personal-figure">
                    <img
                      src={`http://3.99.131.208:8000${banner}`}
                      className="personal-avatar banner"
                      alt="avatar"
                    />
                    <input
                      type="file"
                      onChange={fileSelected}
                      accept="image/*"
                      id="bannerInput"
                      name="image"
                    />
                    <figcaption className="personal-figcaption avatar-figcaption">
                      <img
                        alt="img"
                        src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png"
                      />
                    </figcaption>
                  </figure>
                </label>
              </div>
            )}
            {!updateMode ? (
              <div className="mt-3 mx-3 form-floating col col-sm-auto">
                <h3>{username}</h3>
                <h6>{email}</h6>
                <small>{new Date(data.createdAt).toDateString()}</small>
              </div>
            ) : (
              <div className="mt-3 mx-3 col col-sm-auto">
                <label htmlFor="usernameInput">Username</label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="username"
                  value={username}
                  id="usernameInput"
                  className="form-control"
                />
                <label htmlFor="emailInput">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  id="emailInput"
                  className="form-control"
                />
                <button className="btn btn-outline-dark" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            )}
            <div className="col-sm-auto">
              {data?.username === user?.username && (
                <div className="singlePostEdit text-end">
                  <i
                    className="singlePostIcon far fa-edit"
                    onClick={() => setUpdateMode(!updateMode)}
                  ></i>
                </div>
              )}
            </div>
          </div>
          <div className="row mb-5">
            <h1>Posts</h1>
            {posts && (
              <div className="posts">
                {posts.map((post, i) => (
                  <Post key={i} data={post}></Post>
                ))}
              </div>
            )}
          </div>
          <h1>Comments</h1>
          {comments && (
            <div style={{ maxWidth: "550px" }} className=" col-auto mb-5">
              {comments.map((comment, i) => (
                <Comment key={i} data={comment}></Comment>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;

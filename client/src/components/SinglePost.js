import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import { UserContext } from "../contexts/UserContext";
import { useLocation } from "react-router";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import NewComment from "./NewComment";
import Comments from "./Comments";

const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);
  const result = await axios.post("/api/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
};

function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const [updateMode, setUpdateMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState();
  const [newCommentMode, setNewCommentMode] = useState(false);
  const header = useContext(HeaderContext);

  const [post, setPost] = useState({});
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [banner, setBanner] = useState();

  useEffect(() => {
    const getUserAvatar = async () => {
      await axios.get(`/api/user/username/${post.user}`).then((res) => {
        setAvatar(res.data.banner);
      });
    };
    if (Object.keys(post).length !== 0) {
      getUserAvatar();
      setLoading(false);
    }
  }, [post]);

  useLayoutEffect(() => {
    header.setHeaderTitle("Post");
    const getPost = async () => {
      const res = await axios.get(`/api/post/${path}`);
      setPost(res.data);
      setTitle(res.data.title);
      setBanner(res.data.photo);
      setDesc(res.data.description);
    };
    getPost();
  }, [path, header]);

  const { user } = useContext(UserContext);

  const handleUpdate = async () => {
    const updatedPost = {
      photo: banner,
      title: title,
      description: desc,
    };
    console.log(banner);
    await axios
      .put(`/api/post/${path}`, updatedPost)
      .then(async (res) => {
        setUpdateMode(false);
        if (post.photo !== banner) {
          await axios.delete(post.photo).then(() => {
            navigate(0);
            setPost(res.data);
          });
        }
      })
      .catch(async () => {
        if (post.photo !== banner)
          await axios.delete(banner).then(() => setBanner(post.photo));
        // deletes existing banner if post banner cant be updated
      });
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    console.log(banner);
    setBanner(imagePath);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/post/${path}`);
      navigate("/");
      setUpdateMode(false);
      await axios.delete(post.photo);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="singlePost">
      {!loading ? (
        <div className="card card-body">
          <div className="singlePostWrapper">
            {updateMode ? (
              <div className="personal-image col col-sm-2">
                <label htmlFor="bannerInput">
                  <figure className="personal-figure">
                    <img src={banner} className="postImg banner" alt="avatar" />
                    <input
                      type="file"
                      onChange={fileSelected}
                      accept="image/*"
                      id="bannerInput"
                      name="image"
                    />
                    <figcaption className="personal-figcaption postImg">
                      <img
                        alt="img"
                        src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png"
                      />
                    </figcaption>
                  </figure>
                </label>
              </div>
            ) : (
              <img src={post.photo} alt="" className="singlePostImg" />
            )}

            {updateMode ? (
              <input
                type="text"
                value={title}
                className="singlePostTitleInput"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h1 className="postInfo text-center">{title}</h1>
            )}
            {post?.user === user?.username && (
              <div className="singlePostEdit text-end">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(!updateMode)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
            <div className="singlePostInfo">
              <span className="card-subtitle postCreator">
                Author:
                <Link
                  to={`/user/?user=${post.user}`}
                  className="text-decoration-none"
                >
                  <b> {post?.user}</b>
                  <img
                    style={{ width: "40px", height: "40px" }}
                    src={avatar}
                    alt="Avatar"
                    className="avatar m-1"
                  ></img>
                </Link>
              </span>
              <span className="singlePostDate">
                {new Date(post.createdAt).toDateString()}
              </span>
            </div>
            {updateMode ? (
              <textarea
                className="singlePostDescInput"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            ) : (
              <p className="singlePostDesc">{desc}</p>
            )}
            {updateMode && (
              <button
                className="btn btn-outline-dark singlePostButton btn-lg "
                onClick={handleUpdate}
              >
                Update
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="lds-dual-ring"></div>
      )}
      <div className="card card-body">
        {newCommentMode && <NewComment post={post} />}
        {!loading ? (
          <Comments post={post} />
        ) : (
          <div className="container lds-dual-ring"></div>
        )}
        {newCommentMode ? (
          <button
            className=" position-sticky btn btn-outline-dark"
            onClick={() => setNewCommentMode(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              if (user) {
                setNewCommentMode(true);
              } else {
                navigate("/login");
              }
            }}
          >
            Comment
          </button>
        )}{" "}
      </div>
    </div>
  );
}

export default SinglePost;

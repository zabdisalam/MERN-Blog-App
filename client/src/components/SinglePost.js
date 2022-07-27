import { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import { UserContext } from "../contexts/UserContext";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const [updateMode, setUpdateMode] = useState(false);
  const header = useContext(HeaderContext);

  const [post, setPost] = useState({});
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();

  useEffect(() => {
    header.setHeaderTitle("Post");
    const getPost = async () => {
      const res = await axios.get(`/api/post/${path}`);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [path, header]);

  const { user } = useContext(UserContext);

  const handleUpdate = async () => {
    const updatedPost = {
      photo: post.photo,
      title: title,
      description: desc,
    };
    await axios.put(`/api/post/${path}`, updatedPost).then(() => {
      setUpdateMode(false);
      setPost(updatedPost);
    });
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
    <div className="card card-body singlePost">
      <div className="singlePostWrapper">
        <img src={post.photo} alt="" className="singlePostImg" />
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="postInfo text-center">
            {title}
            {post?.user === user?.username && (
              <div className="singlePostEdit text-end">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="card-subtitle postCreator">
            Author:
            {/* <Link to={`/?user=${post.user}`} className="link"> */}
            <b> {post?.user}</b>
            {/* </Link> */}
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={post.description}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{post.description}</p>
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
  );
}

export default SinglePost;
// work on the edit and delete buttons on the post

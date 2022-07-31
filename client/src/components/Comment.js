import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";

const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);
  const result = await axios.post("/api/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
};

function Comment({ data }) {
  const [updateMode, setUpdateMode] = useState(false);
  const [comment, setComment] = useState(data);
  const [photo, setPhoto] = useState(data?.photo);
  const [text, setText] = useState(data.text);
  const [avatar, setAvatar] = useState();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserAvatar = async () => {
      await axios.get(`/api/user/username/${comment.user}`).then((res) => {
        setAvatar(res.data.banner);
      });
    };
    getUserAvatar();
  }, [comment]);

  const handleUpdate = async () => {
    const newComment = {
      text: text,
      photo: photo,
    };
    await axios
      .put(`/api/comment/${comment._id}`, newComment)
      .then(async (res) => {
        setUpdateMode(false);
        if (comment.photo !== photo) {
          await axios.delete(comment.photo).then(() => {
            navigate(0);
            setComment(res.data);
          });
        }
      })
      .catch(async () => {
        if (comment.photo !== photo)
          await axios.delete(photo).then(() => setPhoto(comment.photo));
      });
  };

  const handleDelete = async () => {
    try {
      const deletedComment = await axios.delete(`/api/comment/${comment._id}`);
      if (deletedComment.photo) await axios.delete(deletedComment.photo);
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setPhoto(imagePath);
  };

  return (
    <div className="singlePostWrapper card card-body container">
      <div className="singlePostInfo">
        <div alt="Avatar">
          <Link
            to={`/user/?user=${comment.user}`}
            className="text-decoration-none"
          >
            <img src={avatar} alt="Avatar" className="avatar"></img>
            <span className=" h5 text-black ">{comment?.user}</span>
          </Link>

          <h6 style={{ fontStyle: "italic", marginInlineStart: "70px" }}>
            {new Date(comment.createdAt).toDateString()}
          </h6>
        </div>
        {comment?.user === user?.username && (
          <div className="singlePostEdit justify-content-lg-end">
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
      </div>
      {updateMode ? (
        <input
          type="text"
          value={text}
          className="singlePostDescInput"
          autoFocus
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p style={{ width: "auto" }} className="singlePostDesc">
          {text}
        </p>
      )}
      <div className="mx-5">
        {comment?.photo && !updateMode && (
          <img src={comment.photo} alt="" className="img-fluid" />
        )}
        {comment?.photo && updateMode && (
          <div className="personal-image col col-sm-2 my-4 mx-0">
            <label htmlFor="photoInput">
              <figure className="personal-figure">
                <img src={photo} className="postImg banner" alt="img" />
                <input
                  type="file"
                  onChange={fileSelected}
                  accept="image/*"
                  id="photoInput"
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

export default Comment;

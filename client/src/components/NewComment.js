import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

function NewComment({ post }) {
  const [photo, setPhoto] = useState();
  const [text, setText] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const newComment = {
      photo: photo,
      text: text,
    };
    await axios
      .post(`http://3.99.131.208:8000/api/comment/${post._id}`, newComment)
      .then(() => {
        navigate(0);
      })
      .catch(async (err) => {
        if (err.response) {
          setError(err.response.data);
          const deletedPhoto = photo;
          setPhoto();
          await axios.delete(deletedPhoto);
        }
      });
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setPhoto(imagePath);
  };

  return (
    <div className="row-cols-auto m-5">
      <form
        className="card bg-secondary card-body container"
        onSubmit={submit}
        method="post"
      >
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
          {photo ? (
            <img src={photo} alt="img" className="img-fluid"></img>
          ) : (
            <i className="fa fa-picture-o fa-3x text-info"></i>
          )}
        </div>
        <div className="form-group mb-4">
          <label htmlFor="photoInput">Photo</label>
          <input
            onChange={fileSelected}
            accept="image/*"
            type="file"
            id="photoInput"
            name="image"
            className="form-control"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="textInput">Text</label>
          <textarea
            onChange={(e) => setText(e.target.value)}
            type="text"
            id="textInput"
            className="form-control"
            placeholder="Enter text"
          />
        </div>
        <button type="submit" className="btn btn-outline-info">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewComment;

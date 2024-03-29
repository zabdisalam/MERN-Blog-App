import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HeaderContext } from "../contexts/HeaderContext";

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

function NewPost() {
  const [photo, setPhoto] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState("Food blogs");
  const [error, setError] = useState();

  const header = useContext(HeaderContext);

  useEffect(() => {
    header.setHeaderTitle("Create Post");
  }, [header]);

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const newPost = {
      photo: photo,
      title: title,
      description: description,
      category: category,
    };
    await axios
      .post("http://3.99.131.208:8000/api/post", newPost)
      .then((res) => {
        navigate("/");
      })
      .catch(async (err) => {
        if (err.response) {
          setError(err.response.data);
          const deletedBanner = photo;
          setPhoto();
          await axios.delete(deletedBanner);
        }
      });
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setPhoto(imagePath);
  };

  return (
    <div style={{ maxWidth: 500 }} className="container mt-5">
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
              {photo ? (
                <img src={photo} alt="img" className="img-fluid"></img>
              ) : (
                <i className="fa fa-picture-o fa-3x text-info"></i>
              )}
            </div>
            <div className="form-group mb-4">
              <label htmlFor="photoInput">Avatar</label>
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
              <label htmlFor="titleInput">Title</label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="title"
                id="titleInput"
                className="form-control"
                placeholder="Enter title"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="descriptionInput">Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                rows="3"
                spellCheck="true"
                className="form-control"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="category" className="form-label mt-4">
                Select Category
              </label>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="form-select"
                id="category"
              >
                <option value="Food blogs">Food blogs</option>
                <option value="Travel blogs">Travel blogs</option>
                <option value="Health and fitness blogs">
                  Health and fitness blogs
                </option>
                <option value="Lifestyle blogs">Lifestyle blogs</option>
                <option value="Fashion and beauty blogs">
                  Fashion and beauty blogs
                </option>
                <option value="Photography blogs">Photography blogs</option>
                <option value="Personal blogs">Personal blogs</option>
                <option value="DIY craft blogs">DIY craft blogs</option>
                <option value="Parenting blogs">Parenting blogs</option>
                <option value="Music blogs">Music blogs</option>
                <option value="Business blogs">Business blogs</option>
                <option value="Art and design blogs">
                  Art and design blogs
                </option>
                <option value="Book and writing blogs">
                  Book and writing blogs
                </option>
                <option value="Personal finance blogs">
                  Personal finance blogs
                </option>
                <option value="Interior design blogs">
                  Interior design blogs
                </option>
                <option value="Sports blogs">Sports blogs</option>
                <option value="News blogs">News blogs</option>
                <option value="Movie blogs">Movie blogs</option>
                <option value="Religion blogs">Religion blogs</option>
                <option value="Political blogs">Political blogs</option>
              </select>
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

export default NewPost;

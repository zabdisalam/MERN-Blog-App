import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const postImage = async ({ image }) => {
  const formData = new FormData();
  formData.append("image", image);
  const result = await axios.post("/api/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return result.data;
};

function Post({ data }) {
  const location = useLocation();
  const path = location?.search.split("=")[1];
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState();
  const [post, setPost] = useState(data);
  const [title, setTitle] = useState(post.title);
  const [desc, setDesc] = useState(post.description);
  const [category, setCategory] = useState(post.category);
  const [banner, setBanner] = useState(post.photo);
  const [updateMode, setUpdateMode] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getUserAvatar = async () => {
      await axios.get(`/api/user/username/${post.user}`).then((res) => {
        setAvatar(res.data.banner);
      });
    };
    getUserAvatar();
  }, [post]);

  const handleUpdate = async () => {
    const updatedPost = {
      photo: banner,
      title: title,
      category: category,
      description: desc,
    };
    await axios
      .put(`/api/post/${post._id}`, updatedPost)
      .then(async (res) => {
        setUpdateMode(false);
        if (post.photo !== banner) {
          await axios.delete(post.photo).then(() => {
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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/post/${post.user}`);
      setUpdateMode(false);
      if (post.photo !== banner) await axios.delete(banner);
      await axios.delete(post.photo);
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const fileSelected = async (event) => {
    const file = event.target.files[0];
    const { imagePath } = await postImage({ image: file });
    setBanner(imagePath);
  };

  return (
    <div className="post card card-body">
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
        <img src={banner} alt="" className="postImg" />
      )}
      <div className="postInfo">
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <span className="postTitle">{title}</span>
        )}
        {path && user?.username === post.user && (
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
        {updateMode ? (
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
              defaultValue={category}
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
              <option value="Photography blogs" sel>
                Photography blogs
              </option>
              <option value="Personal blogs">Personal blogs</option>
              <option value="DIY craft blogs">DIY craft blogs</option>
              <option value="Parenting blogs">Parenting blogs</option>
              <option value="Music blogs">Music blogs</option>
              <option value="Business blogs">Business blogs</option>
              <option value="Art and design blogs">Art and design blogs</option>
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
        ) : (
          <span className="postCat card-subtitle">{category}</span>
        )}
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="postDesc">{desc}</p>
        )}
        <div className="card-subtitle postCreator">
          <Link
            to={`/user/?user=${post.user}`}
            className="text-decoration-none"
          >
            <span>Made by </span>
            <span>
              <b>{post.user}</b>
            </span>
            <img
              style={{ width: "40px", height: "40px" }}
              src={avatar}
              alt="Avatar"
              className="avatar m-1"
            ></img>
          </Link>
        </div>
        {updateMode ? (
          <button className="btn btn-outline-dark" onClick={handleUpdate}>
            Update
          </button>
        ) : (
          <Link
            className=" btn btn-outline-info"
            to={`/post/${post._id}`}
            state={{ post: post }}
          >
            View
          </Link>
        )}
      </div>
    </div>
  );
}

export default Post;

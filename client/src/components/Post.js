import { Link } from "react-router-dom";

function Post({ post }) {
  return (
    <div className="post card card-body">
      <img src={post.photo} alt="" className="postImg" />
      <div className="postInfo">
        <span className="postTitle">{post.title}</span>
        <span className="postCat card-subtitle">{post.category}</span>
        <p className="postDesc">{post.description}</p>
        <div className="card-subtitle postCreator">
          <span>Made by </span>
          <span>
            <b>{post.user}</b>
          </span>
        </div>
        <Link
          className=" btn btn-outline-info"
          to={`/post/${post._id}`}
          state={{ post: post }}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default Post;

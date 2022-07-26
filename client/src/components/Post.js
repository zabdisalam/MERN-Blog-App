import useFetch from "../hooks/useFetch";

function Post({ post }) {
  const { data } = useFetch(`/api/user/${post.user}`);

  return (
    <div className="card m-2">
      <div className="post card-body">
        <img src={post.photo} alt="" className="img-fluid" />
        <div className="postInfo">
          <span className="postTitle">{post.title}</span>
          <span className="postCat card-subtitle">{post.category}</span>
          <p className="postDesc">{post.description}</p>
          <div className="card-subtitle postCreator">
            <span>Made by </span>
            <span>
              <b>{data.username}</b>
            </span>
          </div>
          <a href="/" className=" btn btn-outline-info">
            View
          </a>
        </div>
      </div>
    </div>
  );
}

export default Post;

import useFetch from "../hooks/useFetch";
import Post from "./Post";

function Home() {
  const { data } = useFetch("/api/post");

  return (
    <div className="posts">
      {data && data.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
}

export default Home;

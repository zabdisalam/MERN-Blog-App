import useFetch from "../hooks/useFetch";
import { useContext, useEffect } from "react";
import { HeaderContext } from "../contexts/HeaderContext";
import Post from "./Post";

function Home() {
  const { data } = useFetch("/api/post");
  const header = useContext(HeaderContext);

  useEffect(() => {
    header.setHeaderTitle("Home");
  }, [header]);

  return (
    <div className="posts">
      {data && data.map((post) => <Post key={post._id} data={post} />)}
    </div>
  );
}

export default Home;

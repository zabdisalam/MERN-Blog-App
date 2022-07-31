import axios from "axios";
import { useEffect, useState } from "react";
import Comment from "./Comment";

function Comments({ post }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`/api/comment/post/${post._id}`);
      setData(res.data);
    };
    getComments();
  }, [post]);

  return (
    <div className="row-cols-auto">
      {data &&
        data.map((comment) => <Comment key={comment._id} data={comment} />)}
    </div>
  );
}

export default Comments;

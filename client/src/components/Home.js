import useFetch from "../hooks/useFetch";

function Home() {
  const { data, error } = useFetch("/api/post");

  return (
    <div className="row w-100">
      {data &&
        data.map(({ title, category, description }) => (
          <div className="card col m-3 p-0">
            <div className="card-body">
              <h4 className="card-title">{title}</h4>
              <h6 className="card-subtitle mb-2 text-muted">{category}</h6>
              <p className="card-text">{description}</p>
              <a href="/" className=" btn btn-outline-info card-link">
                View
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Home;

//change row so that it limits the amount of posts shown in a row which would make it very tight

import { useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";
import UserProfile from "./components/UserProfile";
import Home from "./components/Home";
import Header from "./components/Header";
import Nav from "./components/Nav";
import { useLocation, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import SinglePost from "./components/SinglePost";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const sampleLocation = useLocation();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) setLoggedIn(true);
  }, [user]);

  return (
    <div className="App">
      <Header page={sampleLocation.pathname} />

      <Nav isLoggedIn={loggedIn} page={sampleLocation.pathname} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newpost" element={<NewPost />} />
      </Routes>
    </div>
  );
}

export default App;

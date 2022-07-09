import MyProfile from "./components/MyProfile";
import UserProfile from "./components/UserProfile";
import Home from "./components/Home";
import Header from "./components/Header";
import Nav from "./components/Nav";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import NewPost from "./components/NewPost";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const sampleLocation = useLocation();
  return (
    <div className="App">
      <Header page={sampleLocation.pathname} />

      <Nav isLoggedIn={loggedIn} page={sampleLocation.pathname} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* we have to setLoggedIn(false) when path is sent to /logout and delete token*/}
        <Route path="/logout" element={<Navigate replace to="/" />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route
          path="/register"
          element={
            <Register changeLoggedState={(loggedIn) => setLoggedIn(loggedIn)} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/newpost" element={<NewPost />} />
      </Routes>
    </div>
  );
}

export default App;

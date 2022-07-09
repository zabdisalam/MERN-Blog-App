import { useState } from "react";

const Header = ({ page }) => {
  const [headerText, setHeaderText] = useState(page);

  if (headerText.includes("/myprofile")) {
    setHeaderText("My Profile");
  } else if (headerText.includes("/register")) {
    setHeaderText("Register");
  } else if (headerText.includes("/login")) {
    setHeaderText("Login");
  } else if (headerText.includes("/newpost")) {
    setHeaderText("Create Post");
  } else if (headerText.includes("/userprofile")) {
    setHeaderText("User Profile");
  } else if (headerText.includes("/")) {
    setHeaderText("Home");
  }

  return (
    <div className="container-fluid text-center p-5 header-dark">
      <div className="row">
        <h1 className="display-4">{headerText}</h1>
      </div>
    </div>
  );
};

export default Header;

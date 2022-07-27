// The logged in user's profile page which allows them to change everything
import { useContext, useEffect } from "react";
import { HeaderContext } from "../contexts/HeaderContext";

function MyProfile() {
  const header = useContext(HeaderContext);

  useEffect(() => {
    header.setHeaderTitle("My Profile");
  }, [header]);

  return <div>MyProfile</div>;
}

export default MyProfile;

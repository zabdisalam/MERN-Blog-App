import { createContext, useEffect, useReducer } from "react";

let user = localStorage.getItem("user");
try {
  user = JSON.parse(user);
} catch (err) {
  user = null;
}

export const UserContext = createContext(user);

const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return action.payload;
    case "LOGIN_FAILURE":
      return null;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, user);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ user: state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

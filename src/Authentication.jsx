import Login from "./components/Login";
import { useState } from "react";
import Button from "./components/Button";

function Authentication() {
  const [userMode, setUserMode] = useState("login");

  return (
    <div className="main-container">
      <h1 className="font-fancyLetters text-4xl">Login</h1>
      {userMode === "login" && (
        <>
          <div className="border-main flex flex-col justify-center gap-3">
            <Login
              usernameMessage={"Enter Username"}
              passwordMessage={"Enter Password"}
              submitMessage={"Login"}
              authenticationTitle={"Login"}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Authentication;

import Login from "./components/Login";
import { useState } from "react";
import Button from "./components/Button";

function Authentication() {
  const [userMode, setUserMode] = useState("none");

  let headerMessage = "";

  if (userMode === "none") {
    headerMessage = "Login or Sign Up";
  } else if (userMode === "login") {
    headerMessage = "Login";
  } else if (userMode === "signup") {
    headerMessage = "Sign Up";
  }

  return (
    <div className="main-container">
      <h1 className="mb-5 font-fancyLetters text-4xl">{headerMessage}</h1>

      {userMode === "none" && (
        <div className="border-main flex w-50 flex-col justify-center gap-2">
          <Button className="button-primary w-full">Login</Button>
          <Button className="button-secondary w-full">Sign Up</Button>
        </div>
      )}

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

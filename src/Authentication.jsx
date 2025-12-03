import Login from "./components/Login";
import { useState } from "react";
import Button from "./components/Button";
import axios from "axios";

function Authentication() {
  const [userMode, setUserMode] = useState("none");

  let headerMessage = "";

  if (userMode === "none") {
    headerMessage = "Login or Sign Up";
  } else if (userMode === "login") {
    headerMessage = "Login Page";
  } else if (userMode === "signup") {
    headerMessage = "Sign Up Page";
  }

  // registration logic
  const handleRegister = async (username, password) => {
    try {
      // 1. send the data to your express server running on port 3000
      const response = await axios.post("http://localhost:3000/api/register", {
        username: username,
        password: password,
      });

      // 2. success feedback
      console.log(response.data.message); // should be 'user created'
      alert("registration successful");

      // 3. switch to the next logical screen (login)
      setUserMode("login");
    } catch (error) {
      // 4. error feedback
      const message =
        error.response?.data?.error ||
        "registration failed due to a server error.";
      alert(message);
      console.error("registration error:", error);
    }
  };

  return (
    <div className="main-container">
      <h1 className="mb-5 font-fancyLetters text-4xl">{headerMessage}</h1>

      {userMode === "none" && (
        <div className="border-main flex w-50 flex-col justify-center gap-2">
          <Button
            onClick={() => setUserMode("login")}
            className="button-primary w-full"
          >
            Login
          </Button>
          <Button
            onClick={() => setUserMode("signup")}
            className="button-secondary w-full"
          >
            Sign Up
          </Button>
        </div>
      )}

      {userMode === "login" && (
        <>
          <div className="border-main flex flex-col justify-center gap-3">
            <Login
              usernameMessage={"Enter Username"}
              passwordMessage={"Enter Password"}
              submitMessage={"Login"}
            />
            <Button onClick={() => setUserMode("none")}>Back</Button>
          </div>
        </>
      )}

      {userMode === "signup" && (
        <>
          <div className="border-main flex flex-col justify-center gap-3">
            <Login
              usernameMessage={"Create Username"}
              passwordMessage={"Create Password"}
              submitMessage={"Sign Up"}
              onSubmit={handleRegister}
            />
            <Button onClick={() => setUserMode("none")}>Back</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Authentication;

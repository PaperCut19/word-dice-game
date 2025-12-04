import Login from "./Login";
import { useState } from "react";
import Button from "./Button";
import axios from "axios";

function Authentication({ setCurrentPage }) {
  const [userMode, setUserMode] = useState("none");

  let headerMessage = "";

  if (userMode === "userAccountMode") {
    headerMessage = "Login or Sign Up";
  } else if (userMode === "login") {
    headerMessage = "Login Page";
  } else if (userMode === "signup") {
    headerMessage = "Sign Up Page";
  } else if (userMode === "none") {
    headerMessage = "Do You Want To Use An Account?";
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

  // logging in logic
  const handleLogin = async (username, password) => {
    try {
      // 1. send the request to express server running on port 3000
      const response = await axios.post("http://localhost:3000/api/login", {
        username: username,
        password: password,
      });

      // 2. success. extract the JWT and username
      const { token, username: loggedInUsername } = response.data;

      // 3. store the JWT securely for future use (important for session management)
      localStorage.setItem("userToken", token);
      localStorage.setItem("username", loggedInUsername);

      alert(`welcome back, ${loggedInUsername}`);

      // 4. navigate the user to the main application page
      setCurrentPage("manage");
    } catch (error) {
      // 5. error handling
      const message =
        error.response?.data?.error ||
        "login failed. check username and password and try again";
      alert(message);
      console.error("login error:", error);
    }
  };

  return (
    <>
      <h1 className="mb-5 text-center text-2xl">{headerMessage}</h1>

      {userMode === "none" && (
        <div className="button-container w-50 flex-col border-dashed">
          <Button
            onClick={() => setUserMode("userAccountMode")}
            className="button-primary w-full"
          >
            Yes, Account Mode
          </Button>
          <Button onClick={() => setCurrentPage("manage")}>
            No, Continue Without Account
          </Button>
        </div>
      )}

      {userMode === "userAccountMode" && (
        <div className="button-container w-50 flex-col border-dashed">
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
          <Button
            className="button-secondary w-full"
            onClick={() => setUserMode("none")}
          >
            Back
          </Button>
        </div>
      )}

      {userMode === "login" && (
        <>
          <div className="border-main flex flex-col justify-center gap-3 border-dashed">
            <Login
              usernameMessage={"Enter Username"}
              passwordMessage={"Enter Password"}
              submitMessage={"Login"}
              onSubmit={handleLogin}
            />
            <Button onClick={() => setUserMode("userAccountMode")}>Back</Button>
          </div>
        </>
      )}

      {userMode === "signup" && (
        <>
          <div className="border-main flex flex-col justify-center gap-3 border-dashed">
            <Login
              usernameMessage={"Create Username"}
              passwordMessage={"Create Password"}
              submitMessage={"Sign Up"}
              onSubmit={handleRegister}
            />
            <Button onClick={() => setUserMode("userAccountMode")}>Back</Button>
          </div>
        </>
      )}
    </>
  );
}

export default Authentication;

import Login from "./Login";
import { useState } from "react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

function Authentication({ setCurrentPage }) {
  const [userMode, setUserMode] = useState("none");
  const { login, logout } = useAuth(); // [!] get the login function from our context

  // [!] Get server URL dynamically
  const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  let headerMessage = "";
  if (userMode === "userAccountMode") headerMessage = "Login or Sign Up";
  else if (userMode === "login") headerMessage = "Login Section";
  else if (userMode === "signup") headerMessage = "Sign Up Section";
  else if (userMode === "none")
    headerMessage = "Do You Want To Use An Account?";

  // --- Registration Logic ---
  const handleRegister = async (username, password) => {
    try {
      // use SERVER_URL
      const response = await fetch(`${SERVER_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "registration failed");
      }

      // success feedback
      alert("registration successful! please log in");
      setUserMode("login");
    } catch (error) {
      alert(error.message);
      console.error("registration error:", error);
    }
  };

  // --- login logic ---
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "login failed");
      }

      // [!] success: we just hand the data to our AuthContext
      // the context will handle saving user/token to state AND localStorage
      login(data.user, data.token);

      setCurrentPage("manage");
    } catch (error) {
      alert(error.message);
      console.error("login error:", error);
    }
  };

  return (
    <>
      <h1 className="mb-5 text-center text-2xl">{headerMessage}</h1>

      {userMode === "none" && (
        <div className="button-container w-50 flex-col border-dashed">
          <Button
            onClick={() => {
              setUserMode("userAccountMode");
            }}
            className="button-primary w-full"
          >
            Yes, Account Mode
          </Button>

          <Button
            onClick={() => {
              // force logout to guarantee the user enters into guest mode and doesn't accidentally use an account
              // from an old web token left in the browser when someone logged in previously
              logout();
              setCurrentPage("manage");
            }}
          >
            No, Continue Without Account
          </Button>
        </div>
      )}

      {userMode === "userAccountMode" && (
        <div className="button-container w-50 flex-col border-dashed">
          <Button
            onClick={() => {
              setUserMode("login");
            }}
            className="button-primary w-full"
          >
            Login
          </Button>

          <Button
            onClick={() => {
              setUserMode("signup");
            }}
            className="button-secondary w-full"
          >
            Sign Up
          </Button>

          <Button
            onClick={() => {
              setUserMode("none");
            }}
            className="button-secondary w-full"
          >
            Back
          </Button>
        </div>
      )}

      {userMode === "login" && (
        <div className="border-main flex flex-col justify-center gap-3 border-dashed">
          <Login
            usernameMessage={"Enter Username"}
            passwordMessage={"Enter Password"}
            submitMessage={"Login"}
            onSubmit={handleLogin}
          />
          <Button
            onClick={() => {
              setUserMode("userAccountMode");
            }}
          >
            Back
          </Button>
        </div>
      )}

      {userMode === "signup" && (
        <div className="border-main flex flex-col justify-center gap-3 border-dashed">
          <Login
            usernameMessage={"Create Username"}
            passwordMessage={"Create Password"}
            submitMessage={"Sign Up"}
            onSubmit={handleRegister}
          />
          <Button
            onClick={() => {
              setUserMode("userAccountMode");
            }}
          >
            Back
          </Button>
        </div>
      )}
    </>
  );
}

export default Authentication;

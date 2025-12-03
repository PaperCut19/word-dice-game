import Login from "./components/Login";

function Authentication() {
  return (
    <>
      <Login
        usernameMessage={"Enter Username"}
        passwordMessage={"Enter Password"}
        submitMessage={"Login"}
        authenticationTitle={"Login"}
      />
    </>
  );
}

export default Authentication;

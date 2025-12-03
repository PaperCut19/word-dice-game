import { useState } from "react";

function Login({
  usernameMessage,
  passwordMessage,
  submitMessage,
  authenticationTitle,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="main-container">
      <h1 className="font-fancyLetters text-4xl">{authenticationTitle}</h1>

      <div className="border-main flex flex-col justify-center">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={usernameMessage}
            className="text-input w-50 text-center"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={passwordMessage}
            className="text-input w-50 text-center"
          />
          <p className="text-red-500">{errorMessage}</p>
        </div>
        <button className="button-primary">{submitMessage}</button>
      </div>
    </div>
  );
}

export default Login;

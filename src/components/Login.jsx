import { useState } from "react";

function Login({ usernameMessage, passwordMessage, submitMessage, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!username || !password) {
      setErrorMessage("please enter both fields");
      return;
    }
    setErrorMessage(""); // clear previous errors
    // pass data up to the parent's function
    onSubmit(username, password);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={usernameMessage}
          className="text-input w-40 text-center"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={passwordMessage}
          className="text-input w-40 text-center"
          onKeyDown={(event) => {
            // 1. check if the key pressed was enter
            if (event.key === "Enter") {
              // 2. stop the browser's default submit behavior
              event.preventDefault();
              // 3. call your submission logic
              handleSubmit();
            }
          }}
        />
        <p className="text-red-500">{errorMessage}</p>
      </div>
      <button className="button-primary" onClick={handleSubmit}>
        {submitMessage}
      </button>
    </>
  );
}

export default Login;

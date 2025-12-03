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
      <button className="button-primary" onClick={handleSubmit}>
        {submitMessage}
      </button>
    </>
  );
}

export default Login;

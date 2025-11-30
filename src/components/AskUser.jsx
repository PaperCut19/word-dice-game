import Button from "./Button";
import { useState } from "react";

function AskUser({ label, placeholder, onSubmit, buttonText = "Submit" }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue); // pass the value to parent
    setInputValue(""); // clear after submit
  };

  return (
    <div className="border-main flex flex-col gap-2">
      <label htmlFor="userInput">{label}</label>
      <input
        className="text-input"
        type="text"
        id="userInput"
        placeholder={placeholder}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
      />
      <Button onClick={handleSubmit}>{buttonText}</Button>
    </div>
  );
}

export default AskUser;

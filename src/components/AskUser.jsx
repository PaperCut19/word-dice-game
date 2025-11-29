import Button from "./Button";

function AskUser({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  buttonText = "Submit",
}) {
  return (
    <div className="border-main flex flex-col gap-2">
      <label htmlFor="userInput">{label}</label>
      <input
        className="text-input"
        type="text"
        id="userInput"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button onClick={onSubmit}>{buttonText}</Button>
    </div>
  );
}

export default AskUser;

function Button({ onClick, children, className = "button-secondary" }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

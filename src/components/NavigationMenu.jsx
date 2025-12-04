import Button from "./Button";

function NavigationMenu({ setCurrentPage }) {
  return (
    <div className="button-container">
      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home
      </Button>
      <Button onClick={() => setCurrentPage("play")}>Play with Dice</Button>

      <Button onClick={() => setCurrentPage("manage")}>Manage Your Dice</Button>
      <Button onClick={() => setCurrentPage("authentication")}>
        Back To Account Page
      </Button>
    </div>
  );
}

export default NavigationMenu;

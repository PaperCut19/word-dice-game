import Button from "./Button";

function NavigationMenu({ setCurrentPage }) {
  return (
    <div className="button-container border-6 border-dashed border-red-400">
      <Button
        className="button-primary w-full md:w-fit"
        onClick={() => setCurrentPage("home")}
      >
        Home
      </Button>
      <Button
        className="button-secondary w-full md:w-fit"
        onClick={() => setCurrentPage("play")}
      >
        Play with Dice
      </Button>

      <Button
        className="button-secondary w-full md:w-fit"
        onClick={() => setCurrentPage("manage")}
      >
        Manage Your Dice
      </Button>
    </div>
  );
}

export default NavigationMenu;

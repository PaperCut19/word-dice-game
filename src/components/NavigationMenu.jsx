import Button from "./Button";

function NavigationMenu({ setCurrentPage, currentPage }) {
  return (
    <div className="button-container border-6 border-dashed border-red-400">
      <Button
        className="button-primary w-full md:w-fit"
        onClick={() => setCurrentPage("home")}
      >
        Home
      </Button>
      <Button
        className={
          currentPage === "play"
            ? "button-secondary w-full bg-yellow-500 md:w-fit"
            : "button-secondary w-full md:w-fit"
        }
        onClick={() => setCurrentPage("play")}
      >
        Play with Dice
      </Button>

      <Button
        className={
          currentPage === "manage"
            ? "button-secondary w-full bg-yellow-500 md:w-fit"
            : "button-secondary w-full md:w-fit"
        }
        onClick={() => setCurrentPage("manage")}
      >
        Manage Your Dice
      </Button>
    </div>
  );
}

export default NavigationMenu;

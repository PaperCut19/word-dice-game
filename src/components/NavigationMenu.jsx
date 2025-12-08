import Button from "./Button";
import { useAuth } from "../context/AuthContext";

function NavigationMenu({ setCurrentPage, currentPage }) {
  const { logout, user } = useAuth();

  const handleHomeClick = () => {
    // if a user is logged in, log them out first
    if (user) {
      logout();
    }
    // then navigate to the home page
    setCurrentPage("home");
  };

  return (
    <div className="button-container border-6 border-dashed border-red-400">
      <Button
        className="button-primary w-full md:w-fit"
        onClick={handleHomeClick}
      >
        Home/Log Out
      </Button>
      {/* <Button
        className={
          currentPage === "play"
            ? "button-secondary w-full bg-yellow-500 md:w-fit"
            : "button-secondary w-full md:w-fit"
        }
        onClick={() => setCurrentPage("play")}
      >
        Play with Dice
      </Button> */}

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

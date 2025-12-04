import { useState } from "react";
import HomePage from "./HomePage";
import ManageDice from "./ManageDice";
import PlayArea from "./PlayArea";
import { UserContext } from "./UserContext";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  return (
    // Wrap everything in the Provider.
    // The "value" prop is what gets teleported.
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div>
        {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === "manage" && (
          <ManageDice
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "play" && (
          <PlayArea currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;

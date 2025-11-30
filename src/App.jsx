import { useState } from "react";
import HomePage from "./HomePage";
import ManageDice from "./ManageDice";
import PlayArea from "./PlayArea";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === "manage" && (
        <ManageDice setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "play" && <PlayArea setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;

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
        <ManageDice currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "play" && (
        <PlayArea currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;

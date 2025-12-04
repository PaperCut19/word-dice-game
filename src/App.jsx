import { useState } from "react";
import HomePage from "./HomePage";
import ManageDice from "./ManageDice";
import PlayArea from "./PlayArea";
import Authentication from "./Authentication";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === "manage" && (
        <ManageDice setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "play" && <PlayArea setCurrentPage={setCurrentPage} />}
      {currentPage === "authentication" && (
        <Authentication setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;

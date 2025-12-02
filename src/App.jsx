import { useState } from "react";
import HomePage from "./HomePage";
import ManageDice from "./ManageDice";
import PlayArea from "./PlayArea";
import Login from "../Login";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <div>
      {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === "manage" && (
        <ManageDice setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "play" && <PlayArea setCurrentPage={setCurrentPage} />}
      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;

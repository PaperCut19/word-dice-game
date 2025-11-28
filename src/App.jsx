import { useState } from "react";
import HomePage from "./HomePage";
import ManageDice from "./ManageDice";


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'manage' && <ManageDice setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;

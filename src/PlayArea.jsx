import Button from "./components/Button";

function PlayArea({ setCurrentPage }) {
  return (
    <div className="main-container">
      <h1 className="font-fancyLetters text-4xl">Play Area</h1>

      <p>Play area content will go here</p>

      {/* Back to home button */}
      <Button className="button-primary" onClick={() => setCurrentPage("home")}>
        Home Page
      </Button>
    </div>
  );
}

export default PlayArea;

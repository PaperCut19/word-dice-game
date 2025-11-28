import Button from "./Button";

function ManageMenu({ onCreateDice, onEditDice, onDeleteDice }) {
  return (
    <div className="border-main flex flex-col items-center justify-center gap-2 md:flex-row">
      <Button onClick={onCreateDice}>Create Dice</Button>
      <Button onClick={onEditDice}>Edit Dice</Button>
      <Button onClick={onDeleteDice}>Delete Dice</Button>
    </div>
  );
}

export default ManageMenu;

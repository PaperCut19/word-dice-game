import Button from "./Button";

function ManageMenu({
  onCreateDice,
  onEditDice,
  onDeleteDice,
  onClear,
  autoCreate,
  manageMode,
}) {
  return (
    <div className="border-main flex flex-col items-center justify-center gap-2 md:flex-row">
      <Button
        className={
          manageMode === "create"
            ? "button-secondary bg-yellow-500"
            : "button-secondary"
        }
        onClick={onCreateDice}
      >
        Create Dice
      </Button>
      <Button
        className={
          manageMode === "edit"
            ? "button-secondary bg-yellow-500"
            : "button-secondary"
        }
        onClick={onEditDice}
      >
        Edit Dice
      </Button>
      <Button
        className={
          manageMode === "delete"
            ? "button-secondary bg-yellow-500"
            : "button-secondary"
        }
        onClick={onDeleteDice}
      >
        Delete Dice
      </Button>
      <Button className="button-primary" onClick={onClear}>
        Clear
      </Button>
      <Button className="button-third" onClick={autoCreate}>
        Auto-Create
      </Button>
    </div>
  );
}

export default ManageMenu;

export const diceStorage = {
  getAllDice() {
    const stored = localStorage.getItem("diceArray");
    return stored ? JSON.parse(stored) : [];
  },

  uploadAllDice(diceArray) {
    localStorage.setItem("diceArray", JSON.stringify(diceArray));
  },
};

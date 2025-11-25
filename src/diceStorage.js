export const diceStorage = {
  getAllDice() {
    const stored = localStorage.getItem("diceArray");

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  },

  uploadAllDice(diceArray) {
    const stringified = JSON.stringify(diceArray);
    localStorage.setItem("diceArray", stringified);
  },
};

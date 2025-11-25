export class Dice {
  constructor(id) {
    this.id = id;
    this.faces = ["A", "B", "C", "D", "E", "F"];
    this.mainFace = "A";
  }

  showFaces() {
    const messagesGroup = [];
    this.faces.forEach((face, index) => {
      const message = `Face ${index + 1} value: ${face}`;
      messagesGroup.push(` ${message}`);
    });
    alert(messagesGroup);
  }
}

function createSquareRow(rowSize) {
  let abcd = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let squareRowData = [];
  let row = rowSize;
  for (let i = 0; i < 8; i++) {
    if (row % 2 == 0) {
      squareRowData.push(
        createSquare("white", `${abcd[i]}${rowSize}`, null, null)
      );
      row--;
    } else {
      squareRowData.push(
        createSquare("black", `${abcd[i]}${rowSize}`, null, null)
      );
      row--;
    }
  }
  return squareRowData;
}

function createSquare(color, id, piece,highlight_state) {
  return {
    color,
    id,
    piece,
    highlight_state:false,
  };
}

function initData() {
  let data = [
    createSquareRow(8),
    createSquareRow(7),
    createSquareRow(6),
    createSquareRow(5),
    createSquareRow(4),
    createSquareRow(3),
    createSquareRow(2),
    createSquareRow(1),
  ];
  return data;

}
initData();
export { createSquareRow, initData };

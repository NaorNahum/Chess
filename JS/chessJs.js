window.addEventListener("load", (event) => {
  let head1 = document.createElement("h1");
  head1.classList.add("head");
  head1.textContent = "Chess Table JS";
  let Body1 = document.body;
  Body1.appendChild(head1);
  let tableChess = document.createElement("table");
  tableChess.classList.add("table1");
  Body1.appendChild(tableChess);
  for (let i = 0; i < 8; i++) {
    let chessAdd = tableChess.insertRow(i);
    for (let j = 0; j < 8; j++) {
      chessAdd.insertCell(j);
    }
  }
});

// Read dbType from 'create_database' sessionStorage
const dbData = JSON.parse(sessionStorage.getItem("create_database") || "[]");
const dbType = dbData[2] || "1D";

const table = document.getElementById("dbTable");
const addColumnBtn = document.getElementById("addColumnBtn");
const addRowBtn = document.getElementById("addRowBtn");

let colCount = dbType === "1D" ? 1 : 5;
let rowCount = 3; // default starting rows

// Create table headers
function createHeaders() {
    const thead = table.createTHead();
    const row = thead.insertRow();
  
    // Add control column header
    const controlTh = document.createElement("th");
    controlTh.textContent = " ";
    row.appendChild(controlTh);
  
    // Add rest of the editable column headers
    for (let i = 0; i < colCount; i++) {
      const th = document.createElement("th");
      th.contentEditable = true;
      th.textContent = `Column ${i + 1}`;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteColumnAt(i + 1); // +1 for skipping control column
      th.appendChild(deleteBtn);
  
      row.appendChild(th);
    }
}  

// Add a new editable row
function addRow() {
  let tbody = table.tBodies[0];
  if (!tbody) {
    tbody = table.createTBody();
  }
  const row = tbody.insertRow();

  const deleteBtnCell = row.insertCell(0);
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => deleteRowAt(row.rowIndex - 1); // exclude header
  deleteBtnCell.appendChild(deleteBtn);

  for (let i = 0; i < colCount; i++) {
    const cell = row.insertCell();
    cell.contentEditable = true;
    cell.classList.add("editable-cell");

    if (dbType === "3D") {
      add3DHoverEffect(cell);
    }
  }
}

// Add a new column (for 2D and 3D)
function addColumn() {
    colCount++;
  
    // Add new header cell
    const headerRow = table.tHead.rows[0];
    const newTh = document.createElement("th");
    newTh.contentEditable = true;
    newTh.textContent = `Column ${colCount}`;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteColumnAt(headerRow.cells.length - 1); // correct column index
  
    newTh.appendChild(deleteBtn);
    headerRow.appendChild(newTh);
  
    let tbody = table.tBodies[0];
    if (!tbody) {
      tbody = table.createTBody();
    }
  
    Array.from(tbody.rows).forEach((row) => {
      const cell = row.insertCell(-1);
      cell.contentEditable = true;
      cell.classList.add("editable-cell");
  
      if (dbType === "3D") {
        add3DHoverEffect(cell);
      }
    });
}  

// 3D cell hover effect
function add3DHoverEffect(cell) {
  cell.addEventListener("mouseenter", () => {
    cell.style.backgroundColor = "#e1f5fe";
    cell.style.transform = "scale(1.05)";
    cell.style.transition = "0.2s ease";
  });

  cell.addEventListener("mouseleave", () => {
    cell.style.backgroundColor = "#fafafa";
    cell.style.transform = "scale(1)";
  });
}

// Initial table setup
function buildTable() {
  createHeaders();
  for (let i = 0; i < rowCount; i++) {
    addRow();
  }

  if (dbType === "2D" || dbType === "3D") {
    addColumnBtn.classList.remove("hidden");
    deleteColumnBtn.classList.remove("hidden");
  }
}

function deleteColumnAt(index) {
    // Don't allow deleting control column (index 0)
    if (colCount <= 1 || index === 0) return;
  
    const headerRow = table.tHead.rows[0];
    headerRow.deleteCell(index);
  
    const tbody = table.tBodies[0];
    Array.from(tbody.rows).forEach(row => {
      row.deleteCell(index);
    });
  
    colCount--;
}  
  
function deleteRowAt(index) {
    const tbody = table.tBodies[0];
    if (index >= 0 && index < tbody.rows.length) {
      tbody.deleteRow(index);
    }
}  

// Button actions
addRowBtn.addEventListener("click", addRow);
addColumnBtn.addEventListener("click", addColumn);

// Start building
buildTable();

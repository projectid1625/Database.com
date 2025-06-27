import { Database } from "../database_server.js";

// Read dbType from 'create_database' sessionStorage
const dbData = JSON.parse(sessionStorage.getItem("create_database") || "[]");
const dbType = dbData[3] || "2D";

const table = document.getElementById("dbTable");
const addColumnBtn = document.getElementById("addColumnBtn");
const addRowBtn = document.getElementById("addRowBtn");

let colCount = dbType === "1D" ? 1 : 5;
let rowCount = 3; // default starting rows

if (dbType === "1D") {
  document.getElementById("addColumnBtn").style.display = "none";
};

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

    // Create a wrapper div
    const headerWrapper = document.createElement("div");
    headerWrapper.className = "header-wrapper";

    // Editable span for column name
    const headerSpan = document.createElement("span");
    headerSpan.contentEditable = true;
    headerSpan.textContent = `Column ${i + 1}`;
    headerSpan.className = "column-header-text";

    // Delete button
    if ( dbType !== "1D" ) {

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteColumnAt(i + 1); // Adjust as needed
      headerWrapper.appendChild(deleteBtn);

    };

    // Append both to wrapper
    headerWrapper.appendChild(headerSpan);

    // Append wrapper to th
    th.appendChild(headerWrapper);
    row.appendChild(th);
  };
}; 

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

  // Create wrapper div inside th
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "header-wrapper";

  const headerSpan = document.createElement("span");
  headerSpan.contentEditable = true;
  headerSpan.textContent = `Column ${colCount}`;
  headerSpan.className = "column-header-text";

  if ( dbType !== "1D" ) {

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteColumnAt(headerRow.cells.length - 1);
    headerWrapper.appendChild(deleteBtn);

  };

  headerWrapper.appendChild(headerSpan);
  newTh.appendChild(headerWrapper);
  headerRow.appendChild(newTh);

  // Add new cell in each row
  const tbody = table.tBodies[0];
  Array.from(tbody.rows).forEach((row) => {
    const cell = row.insertCell(-1);
    cell.contentEditable = true;
    cell.classList.add("editable-cell");

    if (dbType === "3D") {
      add3DHoverEffect(cell);
    }
  });
};

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
  }
}

function deleteColumnAt(index) {
  const table = document.getElementById("dbTable");
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].deleteCell(index);
  }

  // Re-assign delete buttons to correct columns
  const headerRow = table.rows[0];
  for (let j = 0; j < headerRow.cells.length; j++) {
    const headerCell = headerRow.cells[j];
    const deleteBtn = headerCell.querySelector(".delete-column");
    if (deleteBtn) {
      deleteBtn.onclick = () => deleteColumnAt(j);
    }
  }
};
  
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

document.getElementById("saveBtn").addEventListener("click", () => {
  const headers = [];
  const headerRow = table.tHead.rows[0];
  for (let i = 1; i < headerRow.cells.length; i++) {
    headers.push(headerRow.cells[i].textContent.trim()); // skip control column (index 0)
  }

  const data = [];
  const tbody = table.tBodies[0];
  Array.from(tbody.rows).forEach(row => {
    const rowObj = {};
    for (let i = 1; i < row.cells.length; i++) {
      const key = headers[i - 1]; // match header index
      const value = row.cells[i].textContent.trim();
      rowObj[key] = value;
    }
    data.push(rowObj);
  });

  // Save to sessionStorage
  sessionStorage.setItem("database_table", JSON.stringify(data));

  sessionStorage.removeItem( 'databases_conf' );
  
  setTimeout( () => {

    alert( 'Database Created Successfully ! ');

    return window.location.assign( "./dashboard.html" );

  },1000 );
  
});

/* window.onload = () => {

  if ( sessionStorage.getItem( 'create_database' ) != null ) {

    const Data = JSON.parse( sessionStorage.getItem( 'create_database' ) );

    Database.Create_Data( 'Databases', Data );

  };

}; */
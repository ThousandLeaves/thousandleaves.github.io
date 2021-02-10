let books = [];
let bookKeys = ["Title", "Author", "Pages", "Read?", "", ""];
let bookTableArea = document.querySelector(".books");
let numDeletions = 0;

// Constructor for book object
function Book(title, author, pages, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
}

// ====================================================================
// Generate Table
// --------------------------------------------------------------------
function buildTable() {

    // Define initial table element pieces
    let table = document.createElement("table");
    let tableBody = document.createElement("tbody");
    tableBody.setAttribute("id", "bookTable");
    table.setAttribute("id", "tblMain");
    let tableHeadRow = document.createElement("tr");

    // Build header
    for(i of bookKeys) {
        let tableHead = document.createElement("th");
        let thCellContent = document.createTextNode(i);
        tableHead.appendChild(thCellContent);
        tableHeadRow.appendChild(tableHead);
    }

    tableBody.appendChild(tableHeadRow);

    // Build elements
    for(let j = 0; j < books.length; j++) {
        let trow = document.createElement("tr");
        trow.setAttribute("id", `r${j}`);
        
        // Add Book Data
        for(const [k, v] of Object.entries(books[j])) {
            let tcell = document.createElement("td");
            if(k === "hasRead") {
                tcell.setAttribute("id", `tc${j}`);
            }
            let cellContent = document.createTextNode(v);
            tcell.appendChild(cellContent);
            trow.appendChild(tcell);
        }
        // Add control buttons
        for(let m = 0; m < 2; m++) {
            let buttonLabels = ["Toggle Read", "Delete Book"]

            let tcell = document.createElement("td");
            let actionBtn = document.createElement("button");
            let btnContent = document.createTextNode(buttonLabels[m])

            if(m === 0) {
                actionBtn.setAttribute("id", `bt${j}`);
            } else if (m === 1) {
                actionBtn.setAttribute("id", `rm${j}`);  
            }
            actionBtn.appendChild(btnContent);
            tcell.appendChild(actionBtn);
            trow.appendChild(tcell);
        }
        // Push each gen row to tableBody
        tableBody.appendChild(trow);
    }

    table.appendChild(tableBody);
    bookTableArea.appendChild(table);

    // Add event listeners
    for(let i = 0; i < books.length; i++) {
        let btn = document.getElementById(`bt${i}`);
        btn.addEventListener("click", function() {markRead(i)});
        btn = document.getElementById(`rm${i}`);
        btn.addEventListener("click", function() {deleteButton(i)});
    }
}

// ====================================================================
// Accessing Local Storage
// --------------------------------------------------------------------
function setLocStorage() {
    localStorage.setItem('libBooks', JSON.stringify(books));    
}

// ====================================================================
// Clear Form
// --------------------------------------------------------------------
function clearForm() {
    document.querySelector("#book-name").value = "";
    document.querySelector("#book-author").value = "";
    document.querySelector("#num-pages").value = "";
}

// ====================================================================
// Event Listener Functions
// --------------------------------------------------------------------
function markRead(num) {
    let modCell = document.getElementById(`tc${num}`);
    if(books[num].hasRead === "Read") {
        books[num].hasRead = "Unread";
    } else {
        books[num].hasRead = "Read";                       
    } 
    setLocStorage();
    modCell.innerHTML = books[num].hasRead;
}

function deleteButton(num) {
    books.splice(num,1);
    setLocStorage();
    rebuildTable();  
}

function addNewBook() {
    toggleModal();
    let bookRadio = document.getElementsByName("book-read");
    let readStat = "";
    for (i of bookRadio) {
        if(i.checked) {
            if(i.value === "no") {
                readStat = "Unread";
            } else {
                readStat = "Read";
            }
        }
    }
    books.push(new Book(
        document.getElementById("book-name").value,
        document.getElementById("book-author").value,
        document.getElementById("num-pages").value,
        readStat
    ));
    clearForm();
    // Place in local storage
    setLocStorage();
    rebuildTable();
}

// ====================================================================
// Rebuild Table (Don't use on large tables)
// --------------------------------------------------------------------
function rebuildTable() {
    document.getElementById("bookTable").remove();
    buildTable();
}
// --------------------------------------------------------------------

// Set some default values if local storage empty
if(localStorage.getItem('libBooks') === null || localStorage.getItem('libBooks').length <= 2) {
    books.push(new Book("War and Peace","Leo Tolstoy","1225", "Unread"));
    books.push(new Book("Adventures of Huckleberry Finn","Mark Twain", "366", "Read"));
    books.push(new Book("Animal Farm", "George Orwell", "112", "Read"));
    setLocStorage();    
} else {
    // Grab books data from local storage
    books = JSON.parse(localStorage.getItem('libBooks'));
}
buildTable();

// ====================================================================
// Modal 
// --------------------------------------------------------------------
let modal = document.querySelector(".modal");
let trigger = document.querySelector(".trigger");
let closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("modal-visible");
}

function windowOnClick(e) {
    if (e.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

// Add listener to submit button
let modalSubmit = document.querySelector(".submit-book");
modalSubmit.addEventListener("click", function() {addNewBook()});
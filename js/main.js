const form = document.querySelector(".form");
const btnSubmit = document.querySelector(".btn-submit");
const pages = document.querySelector("#inputPages");
const title = document.querySelector("#inputTitle");
const author = document.querySelector("#inputAuthor");
const comment = document.querySelector("#inputCommet");
const date = document.querySelector("#inputDate");
const table = document.querySelector(".table");
const emptyList = document.querySelector("#emptyList");
const cardContainer = document.querySelector("#notesList");
const firstRow = document.querySelector(".first-row");
const searchAuthor = document.querySelector(".search__author");
const searchTitle = document.querySelector(".search__title");
const searchInputAuthor = document.querySelector(".search__input");
const showAllBtn = document.querySelector(".show-all");

let allNotes = [];

if (localStorage.getItem("allNotes")) {
  allNotes = JSON.parse(localStorage.getItem("allNotes"));
  allNotes.forEach((note) => renderNote(note));
}

checkEmptyList();

function renderNote(newNote) {
  const markup = `
     <tr id="${newNote.id}" class="table__row"> 
              <td>${newNote.title}</td>
              <td>${newNote.author}</td>
              <td>${newNote.pages}</td>
              <td>${newNote.date}</td>
              <td>${newNote.comment ? newNote.comment : ""}</td>
              <td class="table__buttons">
                <button type="button" data-action="done" class="btn-action">
                  <img src="./img/tick.svg" alt="Book" width="15" height="15" />
                </button>
                <button type="button" data-action="delete" class="btn-action">
                  <img src="./img/delete-icon.svg" alt="Done" width="15" height="15" />
                </button>
              </td>
            </tr>
    `;

  table.insertAdjacentHTML("beforeend", markup);
}

// Add note
const addNote = function (e) {
  e.preventDefault();

  const bookTitle = title.value;
  const bookAuthor = author.value;
  const bookPages = pages.value;
  const bookComment = comment.value;
  const bookDate = date.value;

  const newNote = {
    id: Date.now(),
    title: bookTitle,
    author: bookAuthor,
    pages: bookPages,
    comment: bookComment,
    date: bookDate,
  };

  console.log(newNote.comment);

  allNotes.push(newNote);
  renderNote(newNote);
  checkEmptyList();
  saveToLocalStorage();

  form.reset();
  title.focus();
};

// Delete note
const deleteNote = function (e) {
  if (e.target.dataset.action !== "delete") return;

  e.target.dataset.action === "delete";
  const parentNode = e.target.closest(".table__row");

  const id = +parentNode.id;
  allNotes = allNotes.filter((task) => task.id !== id);

  parentNode.remove();

  saveToLocalStorage();
  checkEmptyList();
};

form.addEventListener("submit", addNote);
table.addEventListener("click", deleteNote);

function checkEmptyList() {
  if (!table.querySelector("td")) {
    firstRow.classList.add("none");
    emptyList.classList.remove("none");
  } else {
    emptyList.classList.add("none");
    firstRow.classList.remove("none");
  }
}

function saveToLocalStorage() {
  localStorage.setItem("allNotes", JSON.stringify(allNotes));
}

//Search notes by author
function checkSearchResultsAuthor() {
  const searchQuery = searchAuthor.value; // Результат поиска как массив из букв
  const filteredNotes = allNotes.filter((note) => note.author === searchQuery);
  console.log(filteredNotes);

  if (filteredNotes.length > 0) {
    table.innerHTML = "";
    table.insertAdjacentElement("afterbegin", firstRow);
    filteredNotes.forEach((note) => renderNote(note));
  } else alert("Any results found! Please try again!");
  checkEmptyList();
}

searchInputAuthor.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkSearchResultsAuthor();
  }
});

searchInputAuthor.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkSearchResultsTitle();
  }
});

//Search notes by title
function checkSearchResultsTitle() {
  const searchQuery = searchTitle.value.trim(); // Результат поиска как массив из букв
  console.log(searchQuery);
  const filteredNotes = allNotes.filter(
    (note) => note.title.trim() === searchQuery
  );
  console.log(filteredNotes);

  if (filteredNotes.length > 0) {
    table.innerHTML = "";
    table.insertAdjacentElement("afterbegin", firstRow);
    filteredNotes.forEach((note) => renderNote(note));
  } else alert("Any results found! Please try again!");
  checkEmptyList();
}

searchTitle.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkSearchResultsTitle();
  }
});

/*
Сделать несколько пользователей 

Поиск по книгам 
Поиск по автору 

Редактировать записи 

Фильтрация по дате / 'yesterday'

Prettier

Сделать фавориты, фильтровать фавориты (вместо галочки)

*/

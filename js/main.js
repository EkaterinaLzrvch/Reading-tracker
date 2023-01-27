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
const statisticsBlock = document.querySelector(".statistics");
const searchForm = document.querySelector(".search");
const showFav = document.querySelector(".show-favourites");

let allNotes = [];

if (localStorage.getItem("allNotes")) {
  allNotes = JSON.parse(localStorage.getItem("allNotes"));
  // sortByDate(allNotes);
  allNotes.forEach((note) => renderNote(note));
}

checkEmptyList();
showStatistics();

function renderNote(newNote) {
  const cssClass = newNote.liked
    ? "table__row table__row-favourite"
    : "table__row";

  const markup = `
     <tr id="${newNote.id}" class="${cssClass}"> 
              <td>${newNote.title}</td>
              <td>${newNote.author}</td>
              <td>${newNote.pages}</td>
              <td>${formatDate(newNote.date)}</td>
              <td>${newNote.comment ? newNote.comment : ""}</td>
              <td class="table__buttons">
                <button type="button" data-action="like" class="btn-action">
                  <img src="./img/like.png" alt="like" width="17" height="17" />
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
    date: Date.parse(bookDate),
    liked: false,
  };

  console.log(newNote.comment);

  const index =
    // allNotes.findIndex((arrnote) => arrnote.date < newNote.date) - 1;
    allNotes.findIndex((arrnote) => arrnote.date < newNote.date);
  allNotes.splice(index, 0, newNote);

  renderNote(newNote);

  showStatistics();
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
  1674316953652;

  saveToLocalStorage();
  checkEmptyList();
  showStatistics();
};

form.addEventListener("submit", addNote);
table.addEventListener("click", deleteNote);
table.addEventListener("click", addToFavourite);
showFav.addEventListener("click", showFavourites);

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

// ADD TO FAVOURITES
function addToFavourite(e) {
  if (e.target.dataset.action === "like") {
    const parentNode = e.target.closest(".table__row");

    const id = +parentNode.id;
    const note = allNotes.find((note) => note.id === id);

    note.liked = !note.liked;

    parentNode.classList.toggle("table__row-favourite");
    saveToLocalStorage();
  }
}

//Search notes by author
function checkSearchResultsAuthor() {
  const searchQuery = searchAuthor.value.trim(); // Результат поиска как массив из букв
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

function showStatistics() {
  let sum = [];

  if (allNotes.length === 0) return;

  allNotes.forEach((el) => sum.push(+el.pages));
  const pagesPerDay = Math.round(
    sum.reduce((acc, number) => acc + number) / sum.length
  );

  const markup = `   <img src="./img/statistics.png" alt="statistics">
  <p class='h5'>${pagesPerDay} pages per day in average</p>
  `;

  statisticsBlock.innerHTML = "";
  statisticsBlock.insertAdjacentHTML("beforeend", markup);
}

// SORT BY DATE (меняет исходный массив)
// function sortByDate(arr) {
//   return arr.sort((a, b) => b.date - a.date);
// }

function formatDate(date) {
  const formStr = new Date(date);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = formStr.getFullYear();
  const month = formStr.getMonth();
  const day = formStr.getDate();
  return `${months[month]} ${day}, ${year}`;
}

function showFavourites() {
  const favsArr = allNotes.filter((note) => note.liked === true);
  if (favsArr.length === 0) return;

  table.innerHTML = "";
  table.insertAdjacentElement("afterbegin", firstRow);
  favsArr.forEach((note) => renderNote(note));
}

const books = [];
const RENDER_EVENT = `render-books`;
const SAVED_EVENT = `saved-books`;
const STORAGE_KEY = `MyBooks-APPS`;
const inputSearchBooks = document.getElementById("searchBookTitle");
const SearchBooksButton = document.getElementById("searchSubmit");

function generateID(){
    return +new Date;
}

function generateBookObject(id, title, author, year, isCompleted){
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert(`Browser kamu tidak mendukung local storage`);
      return false;
    }
    return true;
  }
 
  /**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
  
  /**
   * Fungsi ini digunakan untuk menyimpan data ke localStorage
   * berdasarkan KEY yang sudah ditetapkan sebelumnya.
   */
  function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  /**
   * Fungsi ini digunakan untuk memuat data dari localStorage
   * Dan memasukkan data hasil parsing ke variabel {@see todos}
   */
  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function addbooks(bookObject){

    const {id, title, author, year, isCompleted} = bookObject;
    
    const textTitle = document.createElement(`h3`);
    textTitle.innerText = title;

    const textAuthor = document.createElement(`p`);
    textAuthor.innerText = `Penulis: ` + author;

    const textYear = document.createElement(`p`);
    textYear.innerText = `Tahun: ` + year;


    const newLine = document.createElement(`div`);
    newLine.classList.add(`action`);

    const container = document.createElement(`article`);
    container.classList.add(`book_item`);
    container.append(textTitle, textAuthor, textYear);
    container.setAttribute(`id`, `book-${id}`);

    
    if (isCompleted) {
        const undoButton = document.createElement(`button`);
        undoButton.classList.add(`green`);
        undoButton.innerText = `Belum selesai dibaca`;
        undoButton.addEventListener(`click`, function () {
            undoTaskFromCompleted(id);
        });
        
        const deleteButton = document.createElement(`button`);
        deleteButton.classList.add(`red`);
        deleteButton.innerText = `Hapus buku`;
        deleteButton.addEventListener(`click`, function () {
            removeTaskFromCompleted(id);
        });
        container.append(undoButton, deleteButton);
    } else {
        const doneButton = document.createElement(`button`);
        doneButton.classList.add(`green`);
        doneButton.innerText = `Selesai dibaca`;
        doneButton.addEventListener(`click`, function () {
            addTaskToCompleted(id);
        });

        const deleteButton = document.createElement(`button`);
        deleteButton.classList.add(`red`);
        deleteButton.innerText = `Hapus buku`;
        deleteButton.addEventListener(`click`, function () {
            removeTaskFromCompleted(id);
        });
        container.append(doneButton, deleteButton);
    }

    return container;
  }

  function addtoshelf () {
    const textTitle = document.getElementById(`inputBookTitle`).value;
    const textAuthor = document.getElementById(`inputBookAuthor`).value;
    const textYear = document.getElementById(`inputBookYear`).value;
    const isCompleted = document.getElementById(`inputBookIsComplete`);

    const generatedID = generateID();
    if (isCompleted.checked == true) {
        const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, true);
        books.push(bookObject);
    } else {
        const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, false);
        books.push(bookObject);
    }
    

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

    function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
document.addEventListener(`DOMContentLoaded`, function() {
    const submitBook =  document.getElementById(`inputBook`);

    submitBook.addEventListener(`submit`, function(event) {
        event.preventDefault();
        addtoshelf();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(`Data berhasil di simpan.`);
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBooks = document.getElementById(`incompleteBookshelfList`);
    const completedBooks = document.getElementById(`completeBookshelfList`);

    uncompletedBooks.innerHTML = ``;
    completedBooks.innerHTML = ``;

    for (const bookItem of books) {
        const bookElement = addbooks(bookItem);
        if (bookItem.isCompleted) {
            completedBooks.append(bookElement);
        } else {
            uncompletedBooks.append(bookElement);
        }
    }
});

inputSearchBooks.addEventListener("keyup", (event) => {
  event.preventDefault();
  searchBooks();

});

SearchBooksButton.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBooks();
})

function searchBooks(string) {
  const bookItem = document.querySelectorAll(".book_item");
  for (const item of bookItem) {
    const textTitle = item.childNodes[1];
    if(textTitle.innerText.toUpperCase().includes(string)) {
      textTitle.parentElement.style.display = "";
    } else {
      textTitle.parentElement.style.display = "none";
    }
  }
};


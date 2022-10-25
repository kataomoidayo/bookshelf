const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'MyBookshelf_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
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
// ーーーーーーーーーBrowserのlocal storageを調べますーーーーーーーーー

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser anda tidak mendukung local storage. Silahkan ganti browser anda');
    return false;
  }
  return true;
}
// ーーーーーーーーーデータをセーブしますーーーーーーーーー
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
// ーーーーーーーーーlocal storageからデータをロードしますーーーーーーーーー
// ーーーーーーーーーデータ解析をvariabelに載せますーーーーーーーーー
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

function addbooks(bookObject) {
  const {
    id,
    title,
    author,
    year,
    isCompleted
  } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis :' + author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun :' + year;

  const newLine = document.createElement('div');
  newLine.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item')
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.innerText = 'Belum Selesai';
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus';
    deleteButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });
    container.append(undoButton, deleteButton);
  } else {

    const doneButton = document.createElement('button');
    doneButton.classList.add('green');
    doneButton.innerText = 'Selesai';
    doneButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus';
    deleteButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });
    container.append(doneButton, deleteButton);
  }

  return container;
}

function addtoshelf() {
  const textTitle = document.getElementById('BookTitle').value;
  const textAuthor = document.getElementById('BookAuthor').value;
  const textYear = document.getElementById('BookYear').value;
  const isCompleted = document.getElementById('BookIsComplete');

  const generatedID = generateId();
  if (isCompleted.checked == true) {
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, true);
    books.push(bookObject);
    console.log('Buku berhasil ditambahkan ke Selesai Dibaca');
    alert('Buku berhasil ditambahkan ke Selesai Dibaca');
  } else {
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, false);
    books.push(bookObject);
    console.log('Buku berhasil ditambahkan');
    alert('Buku berhasil ditambahkan');
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
  alert('Buku telah selesai dibaca');
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  console.log('Buku berhasil di Hapus');
  alert('Buku berhasil di Hapus');
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  console.log('Buku belum selesai di baca');
  alert('Buku belum selesai di baca');

}
document.addEventListener('DOMContentLoaded', function () {
  const submitBook = document.getElementById('inputBook');

  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addtoshelf();
    // console.log('Buku berhasil di tambahkan');
    // alert('Buku berhasil di tambahkan');
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
// document.addEventListener(SAVED_EVENT, () => {
//   console.log('Buku berhasil di tambahkan.');
//   alert('Buku berhasil di tambahkan.');
// });

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooks = document.getElementById('incompleteBookList');
  const completedBooks = document.getElementById('completeBookList');

  uncompletedBooks.innerHTML = '';
  completedBooks.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = addbooks(bookItem);
    if (bookItem.isCompleted) {
      completedBooks.append(bookElement);
    } else {
      uncompletedBooks.append(bookElement);
    }
  }
});
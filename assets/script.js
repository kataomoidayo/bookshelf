const book = [];
const RENDER_EVENT = 'render-book';
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('input');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const title = document.getElementById('BookTitle').value;
    const author = documet.getElementById('BookAuthor').value;
    const timeStamp = document.getElementById('BookYear').value;
    const isCompleted = document.getElementById('BookIsComplete').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, timeStamp, false);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, timeStamp, isCompleted) {
    return {
      id,
      title,
      author,
      timeStamp,
      isCompleted
    }
  }
  document.addEventListener(RENDER_EVENT, function () {
    console.log(book);
  });
});
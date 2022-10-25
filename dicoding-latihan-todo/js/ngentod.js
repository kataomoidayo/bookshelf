/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const todos = [];
const RENDER_EVENT = 'render-todo';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted
  }
}

function findTodo(todoId) {
  for (todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(todoObject) {
  const {
    id,
    task,
    timestamp,
    isCompleted
  } = todoObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = task;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);

  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function addTodo() {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  //saveData(); dari sini kebawah ditambahkan pelajaran "Menambahkan Metode Manipulasi Data Web Storage"
  saveData();
}

function addTaskToCompleted(todoId /* HTMLELement */ ) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId /* HTMLELement */ ) {
  const todoTarget = findTodoIndex(todoId);
  if (todoTarget === -1) return;
  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId /* HTMLELement */ ) {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  // ------- saveData(); wa koko made desu --------
  // Intisari dari penambahan kode ini adalah menambahkan pemanggilan fungsi saveData 
  // pada setiap fungsi kelola data. Sehingga, ketika data pada array todos ada perubahan, 
  // maka diharapkan perubahan tersebut dapat tersimpan pada storage secara langsung, 
  // seperti mekanisme flow yang sudah kita buat sebelumnya.
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
  // kita perlu panggil fungsi tersebut(LINE 217) 
  // pada saat semua elemen HTML sudah selesai dimuat menjadi DOM. 
  // Untuk itu, pastikan kode yang ada pada listener DOMContentLoaded menjadi seperti ini
  if (isStorageExist()) {
    loadDataFromStorage();
  }

});
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  // clearing list item
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});

// Namun perlu digaris bawahi bahwa fungsi tersebut (save data di atas)
// bukan merupakan fungsi yang disediakan secara bawaan oleh JavaScript, 
// jadi kita perlu menuliskan terlebih dahulu penerapan kode dari fungsinya. 
// Untuk itu, silakan ketikkan beberapa kode di bawah ini.
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Masih ada beberapa kode yang perlu ditambahkan, yakni STORAGE_KEY, SAVED_EVENT & isStorageExist().
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
// Kemudian, agar dapat memudahkan dalam mengetahui bahwa pada setiap perubahan data 
// bisa secara sukses memperbarui data pada storage, kita bisa menerapkan listener 
// dari event SAVED_EVENT. Kemudian, di dalam event listener tersebut 
// kita bisa memanggil getItem(KEY) untuk mengambil data dari localStorage, 
// lalu bisa kita tampilkan secara sederhana menggunakan console log.
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
// ---------------------------------------------------------------------------
// Oke, kita sudah memakai localStorage untuk menyimpan data. 
// Selanjutnya, kita akan membuat web app menampilkan data dari localStorage ketika halaman pertama kali dimuat.  
// Caranya, kita buat fungsi loadDataFromStorage() dengan menjalankan strategi sebagai berikut:

// 1. Ambil data dari localStorage, data ini akan disediakan dalam format teks JSON.
// 2. Kemudian parse data JSON tadi menjadi sebuah object.
// 3. Lalu, masukkan satu persatu data dari object ke array todos.
// 4. Agar bisa diperbarui pada tampilan, panggil Event RENDER_EVENT.

// Mari kita ubah strategi di atas menjadi bentuk kode, silakan tulis kode dari fungsi loadDataFromStorage() seperti ini:

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
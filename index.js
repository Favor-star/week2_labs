let dataObject = [];
let editingIndex = null;
const todoList = document.querySelector(".todo_list.items");

document.addEventListener("click", handleClick);
document.addEventListener("input", handleChange);

function handleClick(event) {
  const clickedEl = event.target;
  if (clickedEl.getAttribute("id") === "edit") {
    editingIndex = clickedEl.dataset.edit_index;
    handleEdit(clickedEl.dataset.edit_index);
  }
  if (clickedEl.getAttribute("id") === "delete_btn") {
    handleDelete(clickedEl.dataset.delete_index);
  }
  if (clickedEl.getAttribute("id") === "sort_button") {
    handleShowModal("sort");
  } else {
    const sortModal = document.querySelector("#sort_modal");
    sortModal.classList.add("hidden_modal");
  }
  if (clickedEl.getAttribute("id") === "filter_btn") {
    handleShowModal("filter");
  } else {
    const filterModal = document.querySelector("#filter_modal");
    filterModal.classList.add("hidden_modal");
  }

  if (clickedEl.getAttribute("id") === "date_added") {
    handleSort("date_added");
  }
  if (clickedEl.getAttribute("id") === "date_added_desc") {
    handleSort("date_added_desc");
  }
  if (clickedEl.getAttribute("id") === "completion_status") {
    handleSort("completion_status");
  }
  if (clickedEl.getAttribute("id") === "add_todo_btn") {
    handleAddTodo();
  }
  if (clickedEl.getAttribute("id") === "close_edit") {
    document.querySelector(".edit_popup_wrapper").classList.add("hidden_modal");
    editingIndex = null;
  }
  if (clickedEl.getAttribute("id") === "save_edit") {
    handleEditSave();
  }
  if (clickedEl.classList.contains("edit_popup_wrapper")) {
    document.querySelector(".edit_popup_wrapper").classList.add("hidden_modal");
    editingIndex = null;
  }
}
function handleChange(event) {
  const clickedEl = event.target;
  if (clickedEl.classList.contains("list_checkbox")) {
    handleMarkAsDone(clickedEl.dataset.mark_index);
  }
  if (clickedEl.getAttribute("id") === "todo_title") {
    document.getElementById("title_error").textContent = "";
    clickedEl.style.borderColor = "none";
  }
  if (clickedEl.getAttribute("id") === "todo_date") {
    document.getElementById("date_error").textContent = "";
    clickedEl.style.borderColor = "none";
  }
}
async function fetchTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const result = await response.json();
    const newArray = [...result.slice(0, 10)];
    newArray.forEach((data) => {
      const start = new Date().getTime();
      const end = new Date("2026-12-31").getTime();
      const randomDate = new Date(
        Math.floor(Math.random() * (end - start)) + start
      ).toLocaleDateString("en-CA");
      data.date = randomDate;
    });
    dataObject.push(...newArray);
    return;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function displayData() {
  todoList.innerHTML = "";
  dataObject.forEach(({ date, title, completed }, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
            <input type="checkbox" class="list_checkbox" data-mark_index=${index} id="checkbox-${index}" ${
      completed ? "checked" : ""
    } />
            <p class="list_no">${index + 1}.</p>
            <p class="list_date">${date || "N/A"}</p>
            <p class="list_title" style="${
              completed && "text-decoration:line-through;color:gray"
            }" >${title}</p>
            <p class="list_status" style="color:${
              completed ? "var(--accentColor)" : "red"
            };font-weight: ">${completed ? "Completed" : "Pending"}</p>
            <div class="list_actions">
              <span class="mark_button">
                <span class="mark_as_text" style="visibility:hidden">Mark as:</span>
                <button id="edit" data-edit_index=${index} >
                Edit    
    </button>
              </span>
              <button id="delete_btn" data-delete_index=${index}>Delete</button>
            </div>`;
    div.classList.add("single_list", "list_item");
    todoList;
    todoList.appendChild(div);
  });
}
function handleMarkAsDone(markIndex) {
  dataObject = dataObject.map((data, index) => {
    if (Number(markIndex) === index) {
      let complete = !data.completed;

      return { ...data, completed: complete };
    } else return data;
  });

  displayData();
}
function handleDelete(deleteIndex) {
  dataObject = dataObject.filter((data, index) => index != deleteIndex);

  displayData();
}
function handleShowModal(modalType, closeModal = false) {
  const modal = document.querySelectorAll(".modal");
  modal.forEach((singleModal) => {
    if (singleModal.dataset.modal === modalType) {
      singleModal.classList.toggle("hidden_modal");
    }
  });
  if (closeModal) {
    const modal = document.querySelectorAll(".modal");
    modal.forEach((singleModal) => {
      singleModal.classList.add("hidden_modal");
    });
  }
}
function handleAddTodo() {
  const todoTittle = document.getElementById("todo_title");
  const date = document.getElementById("todo_date");
  const todoTittleError = document.getElementById("title_error");
  const dateError = document.getElementById("date_error");
  todoTittle.style.border = "none";
  date.style.border = "none";
  if (todoTittle.value === "" || date.value === "") {
    if (todoTittle.value === "") {
      todoTittle.style.border = "1px solid red";
      todoTittleError.textContent = "Please fill the title field";
      todoTittleError.style.color = "red";
    }
    if (date.value === "") {
      date.style.border = "1px solid red";
      dateError.textContent = "Please fill the date field";
      dateError.style.color = "red";
    }
    return;
  }
  const todayDate = new Date();

  if (new Date(date.value) - todayDate < 0) {
    dateError.textContent = "Please provide future date";
    return;
  }
  dataObject.unshift({
    date: date.value,
    completed: false,
    title: todoTittle.value,
  });
  dateError.textContent = "";
  displayData();
  todoTittle.value = "";
  date.value = "";
}
function handleSort(sortType) {
  if (sortType === "date_added") {
    dataObject.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortType === "date_added_desc") {
    dataObject.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortType === "completion_status") {
    dataObject.sort((a, b) => a.completed - b.completed);
  }
  displayData();
}
function handleEdit(index) {
  document
    .querySelector(".edit_popup_wrapper")
    .classList.remove("hidden_modal");

  const toEdit = dataObject[index];
  const editTitleInput = document.getElementById("edit_title");
  const editDateInput = document.getElementById("edit_date");
  editDateInput.value = toEdit.date;
  editTitleInput.value = toEdit.title;
}
function handleEditSave() {
  const editTitleInput = document.getElementById("edit_title");
  const editDateInput = document.getElementById("edit_date");
  dataObject = dataObject.map((data, index) => {
    if (index === Number(editingIndex)) {
      return {
        ...data,
        title: editTitleInput.value,
        date: editDateInput.value,
      };
    } else return data;
  });
  console.log(dataObject);
  displayData();
  document.querySelector(".edit_popup_wrapper").classList.add("hidden_modal");
  editingIndex = null;
}
async function init() {
  //restrict the date to the current date
  const dateInput = document.getElementById("todo_date");
  const editDate = document.getElementById("edit_date");
  const today = new Date();
  const todayFormatted =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  dateInput.setAttribute("min", todayFormatted);
  editDate.setAttribute("min", todayFormatted);

  await fetchTodos();
  displayData();
}
init();

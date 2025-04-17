let dataObject = [];
const todoList = document.querySelector(".todo_list");

document.addEventListener("click", handleClick);

function handleClick(event) {
  const clickedEl = event.target;
  if (clickedEl.getAttribute("id") === "mark_as_done") {
    handleMarkAsDone(clickedEl.dataset.mark_index);
  }
  if (clickedEl.getAttribute("id") === "delete_btn") {
    handleDelete(clickedEl.dataset.delete_index);
  }
}

async function fetchTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const result = await response.json();
    dataObject.push(...result.slice(0, 10));
    return;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function displayData() {
  dataObject.forEach(({ date, title, completed }, index) => {
    const div = document.createElement("div");
    div.innerHTML = ` <p class="list_no">${index + 1}.</p>
            <p class="list_date">${date || "N/A"}</p>
            <p class="list_title">${title}</p>
            <p class="list_status">${completed ? "Completed" : "Pending"}</p>
            <div class="list_actions">
              <span class="mark_button">
                <span class="mark_as_text">Mark as:</span>
                <button id="mark_as_done" data-mark_index=${index} >${
      completed ? "Undone" : "Done"
    }</button>
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
  todoList.innerHTML = "";
  displayData();
}
function handleDelete(deleteIndex) {
  dataObject = dataObject.filter((data, index) => index != deleteIndex);
  todoList.innerHTML = "";
  displayData();
}

async function init() {
  await fetchTodos();
  displayData();
}
init();

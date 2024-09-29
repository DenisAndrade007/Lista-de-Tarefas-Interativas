document.addEventListener("DOMContentLoaded", () => {
	const taskForm = document.getElementById("task-form");
	const taskInput = document.getElementById("task-input");
	const taskDate = document.getElementById("task-date");
	const taskTime = document.getElementById("task-time");
	const taskList = document.getElementById("task-list");
	const filterAll = document.getElementById("filter-all");
	const filterActive = document.getElementById("filter-active");
	const filterCompleted = document.getElementById("filter-completed");
	const sortByDate = document.getElementById("sort-by-date");

	const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

	function saveTasks() {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	function formatDate(date) {
		return new Date(date).toLocaleString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function renderTasks(tasksToRender = tasks) {
		taskList.innerHTML = "";
		tasksToRender.forEach((task, index) => {
			const li = document.createElement("li");
			li.innerHTML = `
                <div class="task-info">
                    <span class="${task.completed ? "completed" : ""}">${task.text}</span>
                    <small>${formatDate(task.date)}</small>
                </div>
                <div class="task-buttons">
                    <button class="complete-btn" title="${task.completed ? "Desfazer" : "Completar"}">
                        ${task.completed ? "Desf." : "OK"}
                    </button>
                    <button class="delete-btn" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

			const completeBtn = li.querySelector(".complete-btn");
			const deleteBtn = li.querySelector(".delete-btn");

			completeBtn.addEventListener("click", () => toggleComplete(index));
			deleteBtn.addEventListener("click", () => deleteTask(index));

			taskList.appendChild(li);
		});
	}

	function addTask(text, date, time) {
		const newTask = {
			text,
			completed: false,
			date: new Date(`${date}T${time}`).toISOString(),
		};
		tasks.push(newTask);
		saveTasks();
		renderTasks();
	}

	function toggleComplete(index) {
		tasks[index].completed = !tasks[index].completed;
		saveTasks();
		renderTasks();
	}

	function deleteTask(index) {
		tasks.splice(index, 1);
		saveTasks();
		renderTasks();
	}

	function filterTasks(filterFunction) {
		const filteredTasks = tasks.filter(filterFunction);
		renderTasks(filteredTasks);
	}

	function sortTasksByDate() {
		tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
		renderTasks();
	}

	taskForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const taskText = taskInput.value.trim();
		const taskDateValue = taskDate.value;
		const taskTimeValue = taskTime.value;
		if (taskText !== "" && taskDateValue && taskTimeValue) {
			addTask(taskText, taskDateValue, taskTimeValue);
			taskInput.value = "";
			taskDate.value = "";
			taskTime.value = "";
		}
	});

	filterAll.addEventListener("click", () => renderTasks());
	filterActive.addEventListener("click", () =>
		filterTasks((task) => !task.completed),
	);
	filterCompleted.addEventListener("click", () =>
		filterTasks((task) => task.completed),
	);
	sortByDate.addEventListener("click", sortTasksByDate);

	// Definir a data mínima como hoje
	const today = new Date().toISOString().split("T")[0];
	taskDate.min = today;

	renderTasks();
});

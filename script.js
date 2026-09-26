// Connect the Task Manager to Back4App
const PARSE_APPLICATION_ID = "C8YIMow3AS7Tp49iPizT0JEkCklNDnFUV8llGV5S";
const PARSE_JAVASCRIPT_KEY = "Fg9dXYZekGdqu1pErLGerOMGn98ho8xspwsffVqd";

Parse.initialize(
    PARSE_APPLICATION_ID,
    PARSE_JAVASCRIPT_KEY
);

Parse.serverURL = "https://parseapi.back4app.com/";

// Get the task form
const taskForm = document.getElementById("taskForm");

// Add a new task when the form is submitted
taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("taskDueDate").value;

    const Task = Parse.Object.extend("Task");
    const task = new Task();

    task.set("title", title);
    task.set("description", description);
    task.set("status", "Pending");

    if (dueDate) {
        task.set("dueDate", new Date(dueDate));
    }

    try {
        await task.save();

        alert("Task added successfully!");

        taskForm.reset();

        await loadTasks();

    } catch (error) {
        console.error("Error adding task:", error);
        alert("There was an error adding the task.");
    }
});

// Load tasks from Back4App
async function loadTasks() {
    const taskList = document.getElementById("taskList");

    const Task = Parse.Object.extend("Task");
    const query = new Parse.Query(Task);

    // Show newest tasks first
    query.descending("createdAt");

    try {
        const tasks = await query.find();

        // Clear the current task list
        taskList.innerHTML = "";

        // Show a message if there are no tasks
        if (tasks.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No tasks added yet.";
            taskList.appendChild(message);
            return;
        }

        // Display each task
        tasks.forEach(function (task) {
            const taskItem = document.createElement("div");
            taskItem.className = "task-item";

            const title = document.createElement("h3");
            title.textContent = task.get("title");

            const description = document.createElement("p");
            description.textContent =
                task.get("description") || "No description";

            const status = document.createElement("p");
            status.textContent =
                "Status: " + task.get("status");

            const dueDate = document.createElement("p");

            if (task.get("dueDate")) {
                dueDate.textContent =
                    "Due Date: " +
                    task.get("dueDate").toLocaleDateString();
            } else {
                dueDate.textContent = "Due Date: None";
            }

taskItem.appendChild(title);
taskItem.appendChild(description);
taskItem.appendChild(dueDate);
taskItem.appendChild(status);

// Add a Complete button if the task is still pending
if (task.get("status") !== "Completed") {
    const completeButton = document.createElement("button");

    completeButton.textContent = "Complete";

    completeButton.addEventListener("click", function () {
        completeTask(task.id);
    });

    taskItem.appendChild(completeButton);
}

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";

deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
});

taskItem.appendChild(deleteButton);

taskList.appendChild(taskItem);

        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Mark a task as completed
async function completeTask(taskId) {
    const Task = Parse.Object.extend("Task");
    const query = new Parse.Query(Task);

    try {
        const task = await query.get(taskId);

        task.set("status", "Completed");

        await task.save();

        alert("Task marked as completed!");

        await loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
        alert("There was an error updating the task.");
    }
}

// Delete a task
async function deleteTask(taskId) {
    const Task = Parse.Object.extend("Task");
    const query = new Parse.Query(Task);

    try {
        const task = await query.get(taskId);

        await task.destroy();

        alert("Task deleted successfully!");

        await loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("There was an error deleting the task.");
    }
}

// Load existing tasks when the page opens
loadTasks();
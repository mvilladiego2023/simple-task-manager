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
    } catch (error) {
        console.error("Error adding task:", error);
        alert("There was an error adding the task.");
    }
});
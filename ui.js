document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // AUTHENTICATION ELEMENTS
    // ================================

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const signInBtn = document.getElementById("signInBtn");
    const signOutBtn = document.getElementById("signOutBtn");
    const createAccountBtn = document.getElementById("createAccountBtn");

    const authStatus = document.getElementById("authStatus");
    const statusDot = document.querySelector(".status-dot");


    // ================================
    // SIGN IN
    // ================================

    signInBtn.addEventListener("click", () => {

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();


        if (username === "" || password === "") {

            authStatus.textContent = "Please enter username and password";

            statusDot.style.background = "#f0ad4e";

            return;
        }


        // Demonstration authentication
        // Real Firebase authentication will be added later.

        authStatus.textContent =
            `Authenticated: ${username}`;

        statusDot.style.background = "#32d583";


        passwordInput.value = "";

    });


    // ================================
    // SIGN OUT
    // ================================

    signOutBtn.addEventListener("click", () => {

        authStatus.textContent =
            "Not Authenticated";

        statusDot.style.background =
            "#f0ad4e";

        usernameInput.value = "";
        passwordInput.value = "";

    });


    // ================================
    // CREATE ACCOUNT
    // ================================

    createAccountBtn.addEventListener("click", () => {

        const username =
            usernameInput.value.trim();

        if (username === "") {

            alert(
                "Please enter a username first."
            );

            usernameInput.focus();

            return;
        }

        alert(
            `Account creation selected for ${username}.`
        );

    });


    // ================================
    // TASK MANAGER
    // ================================

    let tasks = [];

    const createTaskBtn =
        document.getElementById("createTaskBtn");


    createTaskBtn.addEventListener("click", () => {

        const taskName =
            prompt("Enter the task name:");


        if (!taskName || taskName.trim() === "") {
            return;
        }


        const newTask = {

            id: Date.now(),

            name: taskName.trim(),

            completed: false

        };


        tasks.push(newTask);

        updateTaskProgress();

         displayTasks();

        alert("Task created successfully!");

    });


    // ================================
    // UPDATE TASK COUNTS
    // ================================

    function updateTaskProgress() {

        const taskTotal =
            document.getElementById("taskTotal");

        const completedTasks =
            document.getElementById("completedTasks");

        const outstandingTasks =
            document.getElementById("outstandingTasks");

        const progressPercent =
            document.getElementById("progressPercent");

        const progressFill =
            document.getElementById("progressFill");


        const total = tasks.length;

        const completed =
            tasks.filter(
                task => task.completed
            ).length;

        const outstanding =
            total - completed;


        const progress =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        taskTotal.textContent = 
                total;

        completedTasks.textContent =
            completed;

        outstandingTasks.textContent =
            outstanding;

        progressPercent.textContent =
            `${progress}%`;

        progressFill.style.width =
            `${progress}%`;
    }

    // ================================
    // DISPLAY TASKS
    // ================================

function displayTasks() {

    const taskList =
        document.getElementById("taskList");

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-task-message">
                No tasks created yet.
            </p>
        `;

        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskItem =
            document.createElement("div");

        taskItem.className = 
        "task-item";

        taskItem.innerHTML = `
            <span>${task.name}</span>

            <span class="task-status">
                ${
                    task.completed
                    ? "Completed"
                    : "Outstanding"}
            </span>
        `;

        taskList.appendChild(taskItem);

    });
}
// ================================
// VIEW TASKS
// ================================

const viewTasksBtn =
    document.getElementById("viewTasksBtn");

if (viewTasksBtn) {
viewTasksBtn.addEventListener("click", () => {

    displayTasks();

});

}

});
      
     
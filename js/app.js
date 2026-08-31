/* =========================
   CREATE ACCOUNT
========================= */

const createAccountForm =
    document.getElementById("createAccountForm");

if (createAccountForm) {

    createAccountForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value;

        const username =
            document.getElementById("newUsername").value;

        const password =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("accountMessage");


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        const user = {
            fullName: fullName,
            username: username,
            password: password
        };


        localStorage.setItem(
            "skillsTrackUser",
            JSON.stringify(user)
        );


        message.textContent =
            "Account created successfully!";


        setTimeout(function () {

            window.location.href =
                "signin.html";

        }, 1000);

    });
}


/* =========================
   SIGN IN
========================= */

const signInForm =
    document.getElementById("signInForm");

if (signInForm) {

    signInForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("signInMessage");


        const savedUser =
            JSON.parse(
                localStorage.getItem("skillsTrackUser")
            );


        if (!savedUser) {

            message.textContent =
                "No account found. Please create an account.";

            return;
        }


        if (
            username === savedUser.username &&
            password === savedUser.password
        ) {

            localStorage.setItem(
                "skillsTrackLoggedIn",
                "true"
            );


            window.location.href =
                "dashboard.html";

        } else {

            message.textContent =
                "Incorrect username or password.";

        }

    });
}


/* =========================
   DASHBOARD AUTHENTICATION
========================= */

const signOutBtn =
    document.getElementById("signOutBtn");

if (signOutBtn) {

    const loggedIn =
        localStorage.getItem(
            "skillsTrackLoggedIn"
        );


    if (loggedIn !== "true") {

        window.location.href =
            "signin.html";

    }


    const savedUser =
        JSON.parse(
            localStorage.getItem("skillsTrackUser")
        );


    if (savedUser) {

        const welcome =
            document.getElementById(
                "welcomeMessage"
            );

        welcome.textContent =
            "Hello, " + savedUser.fullName + "!";

    }


    signOutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "skillsTrackLoggedIn"
            );

            window.location.href =
                "signin.html";

        }
    );
}


/* =========================
   MARK CALCULATOR
========================= */

const calculateMarksBtn =
    document.getElementById(
        "calculateMarksBtn"
    );

if (calculateMarksBtn) {

    calculateMarksBtn.addEventListener(
        "click",
        function () {

            const mark1 =
                Number(
                    document.getElementById(
                        "mark1"
                    ).value
                );

            const mark2 =
                Number(
                    document.getElementById(
                        "mark2"
                    ).value
                );


            const average =
                (mark1 + mark2) / 2;


            document.getElementById(
                "marksResult"
            ).textContent =
                "Average Mark: " +
                average.toFixed(2);

        }
    );
}


/* =========================
   MINI GAME
========================= */

const gameBtn =
    document.getElementById("gameBtn");

if (gameBtn) {

    gameBtn.addEventListener(
        "click",
        function () {

            const answer =
                prompt(
                    "Programming Question:\n\n" +
                    "Which keyword creates a constant in JavaScript?\n\n" +
                    "A. var\n" +
                    "B. let\n" +
                    "C. const"
                );


            const result =
                document.getElementById(
                    "gameResult"
                );


            if (
                answer &&
                answer.toLowerCase() === "c"
            ) {

                result.textContent =
                    "Correct! Well done.";

            } else {

                result.textContent =
                    "Not quite. The correct answer is C: const.";

            }

        }
    );
}


/* =========================
   SUPPORT BOOKING
========================= */

const supportForm =
    document.getElementById(
        "supportForm"
    );

if (supportForm) {

    supportForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const date =
                document.getElementById(
                    "supportDate"
                ).value;

            const reason =
                document.getElementById(
                    "supportReason"
                ).value;

            const message =
                document.getElementById(
                    "supportMessage"
                );


            if (!date || !reason) {

                message.textContent =
                    "Please complete all fields.";

                return;
            }


            message.textContent =
                "Support session request submitted successfully.";

            supportForm.reset();

        }
    );
}


/* =========================
   TASK MANAGER
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem(
            "skillsTrackTasks"
        )
    ) || [];


const taskForm =
    document.getElementById("taskForm");


function saveTasks() {

    localStorage.setItem(
        "skillsTrackTasks",
        JSON.stringify(tasks)
    );

}


function displayTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );


    if (!taskList) {
        return;
    }


    taskList.innerHTML = "";


    const searchInput =
        document.getElementById(
            "taskSearch"
        );


    const filter =
        document.getElementById(
            "taskFilter"
        );


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    const filterValue =
        filter
            ? filter.value
            : "All";


    const filteredTasks =
        tasks.filter(function (task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesFilter =
                filterValue === "All" ||
                task.status === filterValue;


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            "<p>No tasks found.</p>";

        return;
    }


    filteredTasks.forEach(
        function (task) {

            const taskElement =
                document.createElement(
                    "div"
                );


            taskElement.className =
                "task-item";


            taskElement.innerHTML = `

                <div>

                    <h3>
                        ${task.title}
                    </h3>

                    <p>
                        ${task.description}
                    </p>

                    <small>
                        Status: ${task.status}
                    </small>

                </div>

                <div class="task-actions">

                    <button
                        class="complete"
                        onclick="completeTask(${task.id})">

                        Complete

                    </button>

                    <button
                        class="edit"
                        onclick="editTask(${task.id})">

                        Edit

                    </button>

                    <button
                        class="delete"
                        onclick="deleteTask(${task.id})">

                        Delete

                    </button>

                </div>

            `;


            taskList.appendChild(
                taskElement
            );

        }
    );

}


if (taskForm) {

    taskForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document.getElementById(
                    "taskTitle"
                ).value;


            const description =
                document.getElementById(
                    "taskDescription"
                ).value;


            const status =
                document.getElementById(
                    "taskStatus"
                ).value;


            const newTask = {

                id: Date.now(),

                title: title,

                description: description,

                status: status

            };


            tasks.push(newTask);


            saveTasks();

            displayTasks();


            taskForm.reset();

        }
    );

}


function completeTask(id) {

    tasks =
        tasks.map(function (task) {

            if (task.id === id) {

                task.status =
                    "Completed";

            }

            return task;

        });


    saveTasks();

    displayTasks();

}


function editTask(id) {

    const task =
        tasks.find(function (task) {

            return task.id === id;

        });


    if (!task) {
        return;
    }


    const newTitle =
        prompt(
            "Edit task title:",
            task.title
        );


    if (newTitle) {

        task.title =
            newTitle;

        saveTasks();

        displayTasks();

    }

}


function deleteTask(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmation) {
        return;
    }


    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


const taskSearch =
    document.getElementById(
        "taskSearch"
    );


if (taskSearch) {

    taskSearch.addEventListener(
        "input",
        displayTasks
    );

}


const taskFilter =
    document.getElementById(
        "taskFilter"
    );


if (taskFilter) {

    taskFilter.addEventListener(
        "change",
        displayTasks
    );

}


displayTasks();
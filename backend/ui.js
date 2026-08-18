const email = document.getElementById("email");
const password = document.getElementById("password");
//const welcomeBtn = document.getElementById("welcomeBtn");
//const enrolBtn = document.getElementById("enrolBtn");
const submitBtn = document.getElementById("loginBtn");

const loginErrorMessage = document.getElementById("loginErrorMessage");



const userNameAndPassword = [];

const login = (event) => {
    event.preventDefault();

    if (email.value.trim() === "" || password.value.trim() === ""){
        loginErrorMessage.textContent = "Please enter both email and password";
    } else {
        userNameAndPassword.push({
            email: email.value,
            password: password.value
        });
    }
    email.value = "";
    password.value = "";
};

submitBtn.addEventListener("click", login);
 

const email = document.getElementById("email");
const password = document.getElementById("password");
const welcomeBtn = document.getElementById("welcomeBtn");
const enrolBtn = document.getElementById("enrolBtn");

if (enrolBtn) {
    enrolBtn.addEventListener("click", () => {
        // Navigate to the signup section or page
        window.location.href = "#signup";
    });
}


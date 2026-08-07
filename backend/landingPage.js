/*            id="username" 
            name="email"
            placeholder="Enter your email"
        >

        <br><br>

        <label for="password">Password:</label>
        <input 
            type="password" 
            id="password" 
            name="password"
            placeholder="Enter your password"
        >

    <h1>Learner Supp
        <button id="welcomeBtn">

        <p id="message"></p>


*/

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


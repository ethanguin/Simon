const nameInput = document.getElementById("name");
function login() {
    localStorage.setItem("username", nameInput.value);
    window.location.href = "play.html";
}
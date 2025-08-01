// Dark mode toggle logic
const darkModeToggle = document.getElementById("darkModeToggle");
const icon = darkModeToggle.querySelector("i");
function setDarkMode(enabled) {
	document.body.classList.toggle("dark-mode", enabled);
	icon.className = enabled ? "bx bx-sun" : "bx bx-moon";
	localStorage.setItem("darkMode", enabled ? "1" : "0");
}
// Load preference
setDarkMode(localStorage.getItem("darkMode") === "1");
darkModeToggle.onclick = () =>
	setDarkMode(!document.body.classList.contains("dark-mode"));

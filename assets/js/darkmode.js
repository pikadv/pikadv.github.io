// Dark mode toggle logic
(function () {
	const darkModeToggle = document.getElementById("darkModeToggle");
	if (!darkModeToggle) return;
	const icon = darkModeToggle.querySelector("i");
	function setDarkMode(enabled) {
		document.body.classList.toggle("dark-mode", enabled);
		document.documentElement.classList.toggle("dark-mode", enabled);
		icon.className = enabled ? "bx bx-sun" : "bx bx-moon";
		localStorage.setItem("darkMode", enabled ? "1" : "0");
	}
	// Load preference (default to dark if unset)
	const storedPreference = localStorage.getItem("darkMode");
	const shouldEnableDarkMode =
		storedPreference === null ? true : storedPreference === "1";
	setDarkMode(shouldEnableDarkMode);
	darkModeToggle.onclick = function () {
		setDarkMode(!document.body.classList.contains("dark-mode"));
	};
})();

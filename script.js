// Wait for DOM to be fully loaded
window.addEventListener("DOMContentLoaded", function () {
	// Set default mode to light if not already dark
	if (!document.body.classList.contains("dark-mode")) {
		document.body.classList.add("light-mode");
	}

	const modeSwitch = document.getElementById("mode-switch");
	if (!modeSwitch) return;

	modeSwitch.addEventListener("click", function () {
		const isLight = document.body.classList.contains("light-mode");
		document.body.classList.toggle("light-mode", !isLight);
		document.body.classList.toggle("dark-mode", isLight);
		modeSwitch.classList.toggle("toggled", isLight);
	});

	modeSwitch.addEventListener("keydown", function (e) {
		if (e.key === "Enter" || e.key === " ") {
			modeSwitch.click();
		}
	});
});

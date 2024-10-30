var selectTab = function(x) {
	let tabs = document.querySelectorAll(".tab-content");
	let buttons = document.querySelectorAll(".tab-button");
	
	for (let i=0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
		buttons[i].classList.remove("active");
	}
	buttons[x].classList.add("active");
	tabs[x].style.display = "block";
}
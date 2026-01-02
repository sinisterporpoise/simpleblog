let loginForm = document.getElementById('loginForm');
let blogPosts = document.getElementById('blogPosts');
let errorMsg = document.getElementById('errorMsg');

// Set up the easily guessed password
const validpassword = "princess123"
function fakeLogin(e) {
	e.preventDefault();
	const password = document.getElementById('password').value;
	console.log(password);
	if (password === validpassword) {
		loginForm.style.display = "none"
		errorMsg.style.display = "none"
		blogPosts.style.display = "block"
	} else {
		errorMsg.style.display = "block";
	}
	// Check to see if they've entered the corect "password"

}  // End functoin

loginForm.addEventListener('submit', fakeLogin)
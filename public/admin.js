
let posts = document.getElementById('posts');
let type = document.getElementById('addStory');

//--------------------------------------------------------------------
//
// Let's clean our functions up a little  by adding some costant
// functions to render our input area rather than cloggine up
// our choose type function.
//--------------------------------------------------------------------
 function  createBlogEntry(parentScaffolding) {

 
 	parentScaffolding.innerHTML = "";

  	let authorTextArea = document.createElement('textarea');
  	authorTextArea.id = 'authorTextArea'
	authorTextArea.setAttribute('name', 'Author');
	authorTextArea.setAttribute('cols', 40);
	authorTextArea.setAttribute('rows', 1);
	parentScaffolding.appendChild(authorTextArea);
	parentScaffolding.appendChild(document.createElement('br'));
	parentScaffolding.appendChild(document.createElement('br'));


	let blogTextArea = document.createElement('textarea');
	blogTextArea.id = 'blogTextArea';
	blogTextArea.setAttribute('Post', 'text');
	blogTextArea.setAttribute('cols', 80);
	blogTextArea.setAttribute('rows', 25);
	blogTextArea.setAttribute('maxlength', 65535);
	parentScaffolding.appendChild(blogTextArea);

 }

//--------------------------------------------------------------------
// 
// This will let us post the news items, where the author isn't as
// important, but we do need to let the user upload images.
//
//--------------------------------------------------------------------
function createNewsEntry(parentScaffolding) {

	parentScaffolding.innerHTML = "";

	let newsImgUpload = document.createElement('input'); 
	newsImgUpload.id = "newsImgUpload"
	newsImgUpload.name = "image"
	newsImgUpload.type = 'file';
	newsImgUpload.setAttribute('accept', 'image/*')
	parentScaffolding.appendChild(newsImgUpload);


	parentScaffolding.appendChild(document.createElement('br'));
	parentScaffolding.appendChild(document.createElement('br'));


	let newsTextArea = document.createElement('TEXTAREA');
	newsTextArea.id = "newsTextArea"
	newsTextArea.setAttribute('Post', 'text');
	newsTextArea.setAttribute('cols', 160);
	newsTextArea.setAttribute('rows', 25);
	newsTextArea.setAttribute('maxlength', 65535);
	parentScaffolding.appendChild(newsTextArea);

}


//--------------------------------------------------------------------
// 
// This is going to let us choose to enter a specific type of post.
//
//--------------------------------------------------------------------
function choose_type(e) {

	let  parentScaffolding = document.getElementById("formarea");
	let choice = posts.options[posts.selectedIndex].value

	

	if (!choice) {
		choice = 'news';
	}


	switch (choice) {
		case 'blog': {
						createBlogEntry(parentScaffolding);
						break;
					 }
		case 'news': {

						createNewsEntry(parentScaffolding);
						break;
					}
		default: {
						console.log('Nothing selected yet.')
				}

	} // End Switch
}
//-----------------------------------------------------
//
// We are going to use this function to asynchrounously
// call to our server side code, and await for its 
// response.   We will use this to define the path
// that gets sent to the router using
//
//--------------------------------------------------
async function addBlog() {

	 // console.log()
	const blogBody = {
			author: document.getElementById('authorTextArea').value,
			story:  document.getElementById('blogTextArea').value
	}

	console.log(blogBody);


	try {
		let blogRes = await fetch ('/blogStory', {
			method: 'POST',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify(blogBody)
		});
		if (!blogRes.ok) {
			console.error('Save failed.');
		}
	} catch (err) {
		console.error('Save failed.' + err);
	}
}

//-----------------------------------------------------
// 
// The addNews function works very similar to the 
// addBlog function defined above, except we will deal
// with the author, the photo (if attached), and text.
//
//-----------------------------------------------------
async function addNews () {

	const formData = new FormData();
	const imgInput = document.getElementById('newsImgUpload');

	if (imgInput.files.length > 0) {
		formData.append('image', imgInput.files[0]);
	}

	formData.append(
		'newsText',
		document.getElementById('newsTextArea').value
	);
	

    console.log(formData);
	try {
		let newsRes = await fetch ('/newsStory', {
			method: 'POST',
			body: formData
		});
		if (!newsRes.ok) {
			console.error('Save failed');
		}
	} catch (err) {
		console.error('Posting failed: ' + err);
	}

}
//-----------------------------------------------------
// 
// Now we're going to add some stories in using
// asynchrounous functions and the route. Ideally, this
// will add items into the appropriate database.
//
//------------------------------------------------------
function addStory (e) {
	// We want to hijack default behavior and substitute our own.
	e.preventDefault();

	// Figure out which type we are on

	const choice = posts.options[posts.selectedIndex].value;

	switch (choice) {

	case 'blog': {
				  addBlog();
		          break; 
		         }
    case 'news': { 
    				addNews();
    				break;
    			}
	}


}
// Make ure something is displayed when the page loads
window.addEventListener('load', choose_type);


// Change the form when the page doesn't load.
posts.addEventListener("change", choose_type);
type.addEventListener('click', addStory); 
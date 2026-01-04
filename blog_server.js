//------------------------------------------------------
// This is a simple blog project that I've always wanted
// to do.
//
//
// Lara Landis
// Personal Project
// December 5, 2025
//
//--------------------------------------------------------
const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const port = 3000; 					 // Default port for node
const storage = multer.diskStorage({destination: (req, file, cb) => {
	cb(null, path.join(__dirname, '/images'));
	} ,
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);	
	}

});
const upload = multer({storage});

//-----------------------------------------------
//
// Do some set up options.
//
//-----------------------------------------------
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


//---------------------------------------------------
//
// Global variables section
//
//---------------------------------------------------
 let username;
 let role;				// Players with the storyteller role will see "suggetions" that can be acted upon or not.
 

 const con = mysql.createConnection({
 	host: 'localhost',
 	user: 'mindseye',
 	password: 'mindsEye',
 	database: 'blog'
 });

//----------------------------------------------------
// 
// Let's see if we can clean things up a bit.
// using a deb query
//
//----------------------------------------------------
 function dbQuery(sql, params) {
 	return new Promise((resolve, reject) => {
 		con.query(sql, params, (err, result) =>{
 			if (err) reject(err);
 			else resolve(result)
 		});
 	});
 }
//----------------------------------------------------
// 
//  This is the route for the index page.
//
//----------------------------------------------------
 app.get('/', async (req, res) => {
 	// Get the news stories from the database
 	values = ["news"];
 	sql = "SELECT news_id, newsitem, photo FROM news";

 	titles = await dbQuery(sql, values);
 	console.log(titles[titles.length-1].photo) ;
 	res.render('index', { username: "Guest", titles })
 });



//---------------------------------------------------
//
// Render the About page
//
//----------------------------------------------------
 app.get('/about', (req, res) => {
 	/* This is just a static page so we need nothing fancy hee, unless we want to do somethings based on the role of the 
 	    person logged in. */

 	res.render('about.ejs', { username: "Guest" });
 });


//----------------------------------------------------
//
// This is where we render the login page
//
//----------------------------------------------------
 app.get ('/login', (req, res, next) => {
 	res.render ('login', {success: "undefined"});
 });


 
//---------------------------------------------------
// 
// Now let's handle the login page.
//
//---------------------------------------------------
app.post('/login', async (req, res) => {
	let success
	values = { username: req.body.username,
			   password: req.body.password };

	try {
	    sql = "SELECT * FROM user WHERE user_name = ? "
	    const result = await dbQuery(sql, [values.username]);
	   
	   	if (result.length === 0) {
	   		console.log('failed: user does not esxit.');
	   		return res.render('login.ejs', {success: false})
	   	}
	    	
	    const userinfo = result[0];
	    const match = await bcrypt.compare(values.password, userinfo.password)

	    if (!match) {
	    	console.log("Passwords do not match");
	    	return res.render('login.ejs', {success: false});
	    }  else {
	    	role = userinfo.user_role;

	    	res.render("index.ejs", {username: userinfo.user_name, userrole: userinfo.user_role});
	    }
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});


//---------------------------------------------------
//  
// Load the create user page 
//
//--------------------------------------------------
app.get('/create', (req, res) => {
	// Note: this is just for displaying the page,
	// the app.post('/login', ...) function will
	// handle the actual creation
	res.render('create.ejs', { success: 'undefined'} );

}); // End this function


//-----------------------------------------------
//
// This is where we insert the code into the
// database, and we're going  to try to be a little
// more secure than we were previously using
// the bcrypt function to store hashed passwords
// in the database.
//
//--------------------------------------------------
app.post('/create', async (req,res) => {
	let success;

	// The passwords do not match so return to the callling function

	if (req.body.password !== req.body.verify) {
		return res.render('create.ejs', {success: false})
	}


	const salt  = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(req.body.password, salt)
	let values = { username: req.body.username,
			   user_role: 'user', 
			   password: hashed
			  };

    // Check to see if the name is in use
    sql =  "SELECT * FROM user  WHERE user_name = ?";
    const existing = await dbQuery (sql, [values.username]);

    if (existing.length != 0) {
    	console.log("User name already in use.");
    	return res.render('create.ejs', {success: false})
    }

    // Finally insert things into the database.
    sql = "INSERT INTO user (user_name, user_role, password) VALUES (?, ?, ?)";
    const insertSql = await dbQuery (sql, [values.username, values.user_role, values.password], (err, result) => {
     	if (err) {
     		res.status(500).send(err);
     		return;
     	}
     	console.log(result);
     	res.redirect('/', {username: username, role: userinfo.user_role});
     	return;
    });

   
});



//--------------------------------------------------
//
// Does  the user want to contact us?
//
//-------------------------------------------------- 
 app.get('/contact', (req, res) => {
 	res.render('contact.ejs', {username})
 });


//----------------------------------------------
app.get('/serena', async (req, res) => {
	values = ["posts"];
	sql = "SELECT title, blog_post FROM posts";
	let titles = await dbQuery(sql, values);
	console.log(titles[titles.length-1].photo)
	res.render('serena', { titles});
});
 //--------------------------------------------------
 // 
 // Display the administrator page.
 //
 //--------------------------------------------------
 app.get('/admin', (req,res) => {

	res.render('admin.ejs', {role: role});
 });


//----------------------------------------------------
//
//	 Handle the blog posts
//
//----------------------------------------------------
 app.post('/blogStory',  async (req, res) => {


 	// Now we are going to need to write things to the
 	// database...
 	values = [req.body.story, req.body.author ];

 	sql = "INSERT INTO posts (blog_post, title) VALUES (?, ?);"

 	try {
 		blogEntry = await dbQuery(sql, values);
 		return res.status(200).send({message: 'Post added successfully'});
 	} catch (err) {
 		console.error(err);
 		res.status(500).send({message: 'Database access failed', details: err})
 	}


 });


//---------------------------------------------------
//
// Handle the news posts
//
//----------------------------------------------------
 app.post('/newsStory', upload.single('image'), async (req, res) => {
 	console.log('/newsStory running');
 	console.log(req.file);
 	console.log(req.body);

 	// Okay now we need to post these items to the blog
 	values = [req.file.filename, req.body.newsText]
 	sql = "INSERT INTO news (photo, newsItem) VALUES (?, ?)" ;

 	try {
 		newsEntry = await dbQuery(sql, values);
 		return res.status(200).send({message: 'Post added successfully.'});
 	}  catch (err) {
 		console.error(err);
 		res.status(500).send({message: 'Database access failed', detais: err });
 	}                        

 });
//-------------------------------------------------
// 
// This is where we just call the .listen function 
// to set up a simple web server.
//
//---------------------------------------------------
 console.log(`Now listening on port ${port}`)
app.listen(port);
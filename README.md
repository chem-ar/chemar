# ChemAR-Winter-2023
https://git.cs.dal.ca/belcher/chemar-winter-2023


- [ChemAR-Winter-2023](#chemar-winter-2023)
  - [Molecular AR Viewer Application](#molecular-ar-viewer-application)
    - [Description](#description)
    - [Minimum Requirements](#minimum-requirements)
    - [Installation](#installation)
  - [Running the application](#running-the-application)
  - [Technical Inventory](#technical-inventory)
    - [Client-side Technologies:](#client-side-technologies)
  - [Server-side Technologies:](#server-side-technologies)
  - [Database Technologies:](#database-technologies)
    - [Back End](#back-end)
      - [Node.js](#nodejs)
      - [Express.js](#expressjs)
      - [EJS (Embedded JavaScript) Templating Engine](#ejs-embedded-javascript-templating-engine)
  - [Routing](#routing)
    - [Express.js](#expressjs-1)
      - [express-generator](#express-generator)
    - [The `/catalog` route:](#the-catalog-route)
    - [Adding an admin route to the application:](#adding-an-admin-route-to-the-application)
    - [The `/public/` directory:](#the-public-directory)
  - [Three.js](#threejs)
    - [Getting Started](#getting-started)
    - [Running a Web Server](#running-a-web-server)
  - [Creating a Three.js Scene](#creating-a-threejs-scene)
    - [Importing Three.js](#importing-threejs)
    - [Create an init() function](#create-an-init-function)
    - [Load a mol file](#load-a-mol-file)
    - [Parsing a mol file](#parsing-a-mol-file)
    - [Adding the `.mol` file converter](#adding-the-mol-file-converter)
    - [Clear the scene when the init function is called](#clear-the-scene-when-the-init-function-is-called)
    - [Style the spheres](#style-the-spheres)
    - [Adding lights](#adding-lights)
    - [Add an axes helper](#add-an-axes-helper)
    - [Center the molecule to the origin](#center-the-molecule-to-the-origin)
    - [Using ES6 modules](#using-es6-modules)
    - [Importing OrbitControls](#importing-orbitcontrols)
    - [Add the atoms to a group](#add-the-atoms-to-a-group)
  - [Adding datgui and manipulating the molecule group](#adding-datgui-and-manipulating-the-molecule-group)
    - [Adding auto-rotation](#adding-auto-rotation)
    - [Adding buttons to toggle the molecule type in the menu](#adding-buttons-to-toggle-the-molecule-type-in-the-menu)
  - [Tracker Based AR Molecule Viewer](#tracker-based-ar-molecule-viewer)
- [Deployment](#deployment)
  - [Local Deployments](#local-deployments)
    - [CORS and HTTPS:](#cors-and-https)
  - [Remote Deployment](#remote-deployment)
    - [Deploying to Azure Websites:](#deploying-to-azure-websites)
- [References](#references)
  - [Blogs, tutorials and videos:](#blogs-tutorials-and-videos)
  - [Documentation:](#documentation)


## Molecular AR Viewer Application

### Description

This is a web application that allows users to view 3D models of molecules in Augmented Reality. The application uses the AR.js library to detect markers and display 3D models in the browser. The models are generated from a mol file and are intended to look like classic "ball and stick" models.

### Minimum Requirements

Before running the program, make sure you have [Node.js](https://nodejs.org/en/) installed on your computer. You can check if you have Node.js installed by running the following command in your terminal:

```bash
node -v
```

### Installation

Clone the repository:

```bash
git clone https://git.cs.dal.ca/belcher/chemar-winter-2023
```

Install the dependencies:

```bash
cd <project-root-directory>
```

```bash
npm install
```

## Running the application

To start the server, run the following command:

```bash
npm start
```

The server will start listening on port 4000. You can now access the web application by visiting https://localhost:4000 in your browser.



## Technical Inventory
### Client-side Technologies:
* **Bootstrap**: A CSS and JS framework and UI toolkit for styling web applications
* **jQuery**: A JavaScript library for manipulating the DOM
* **jQuery Datatables**: A jQuery plugin for displaying, filtering, paginating and searching tabular data
* **Three.js**: A JavaScript library for creating 3D graphics in a web browser
* **WebXR**: A JavaScript API for accessing augmented reality and virtual reality devices, like cameras and motion sensors

## Server-side Technologies:
* **Node.js**: A JavaScript runtime engine
* **Express**: A web application framework for Node.js
* **EJS**: A templating engine for Node.js

## Database Technologies:
* **Supabase**: A Firebase alternative that provides a Postgres database, authentication, and storage.


### Back End
#### Node.js
Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser.

#### Express.js
Express has been called the de facto standard server framework for Node.js. Express provides a minimal and flexible set of features for creating web applications and APIs. It provides a set of features like routing, middleware, view system, etc. It simplifies the server creation process that can be used to create a web application more easily and quickly. [Here is a guide to getting started with Express.js](https://expressjs.com/en/starter/installing.html).

**To-Do:**
- Learn about Node.js and Express.js
- Learn how to create a simple Express.js server
- Learn how to create a new Express.js project using the Express Generator
- Learn how to create a new route in Express.js
- Learn how to serve static files in Express.js
- Learn how to send a variable to a template as part of a response in Express.js

#### EJS (Embedded JavaScript) Templating Engine
Templating engines are tools used to generate HTML from data and templates. They allow developers to separate the view (HTML) from the controller (data) and create dynamic HTML pages. Templating engines are used in a variety of web development frameworks and technologies, such as Node.js and Express.js. They allow developers to write HTML code with placeholders for variables, which are then replaced with the actual data when the page is rendered. This makes it easier to maintain and update the HTML code. There are quite a few templating engines available. [Here is a list in the Express.js docs](https://expressjs.com/en/resources/template-engines.html).


EJS (Embedded JavaScript) is a templating engine used by Node.js developers. It is used to generate HTML from data and templates. It more features such as loops, conditionals, and template inheritance. EJS is simple to use and supports the use of JavaScript for more complex operations. It is often used in combination with Node.js and Express.js to create dynamic web pages. [Here is a link to EJS's documentation](https://ejs.co/#docs).

**To-Do:**
- Learn EJS's syntax
- Practice sending a variable from the server to the client using EJS
- Practice using EJS to render a HTML using the contents of a variable, array, objects, etc.


## Routing

A website route is a URL or link on a website that directs users to a specific page or section of a website. A website route is typically written in a specific syntax and includes parameters such as the page name, controller, action, and any additional query strings.

When you visit a website, you are sending a request to a named resource. This resource is called a route. A route is a combination of a URL path and a specific HTTP request method (GET, POST, PUT, DELETE, etc.). Each route can have one or more handler functions, which are executed when the route is matched.

Say for instance I wish to visit our website, the route to the homepage might be:

```
https://localhost:4000/
```

I submit a GET request to this route, and the server responds with the HTML for the homepage.

Say for instance I wanted to visit the page that lists the complete list of the users. The route to this page might be:

```
https://localhost:4000/users/
```

When I submit a GET request to this route, the server responds with the HTML for the catalog page, as specified by the express route handler in the `routes/catalog.js` file:
```js
var express = require('express');
var router = express.Router();

var allUsers = [
    {
      "id": 1,
      "name": "Joe Doe",
    },
    {
      "id": 2,
      "name": "John Doe",
    },
    {
      "id": 3,
      "name": "Jane Doe",
    }
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('usersList', { title: 'Users', userArray: allUsers });
});

module.exports = router;
```

### Express.js
#### express-generator

You can install express globally and use the express command to generate a new application by executing the following command in your terminal:
```bash
npm install -g express-generator
```

or

```bash
npx express-generator
```

Then, you can generate a new site in your current directory with the following command:
```
express --view=ejs
```

You will have a new file and directory structure that looks something like this generated for you:
```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.ejs
    ├── index.ejs
    └── usersList.ejs
```

The `app.js` file is what run on startup. It is the entry point to the application. It is where we configure the application, and where we define the routes that the application will respond to.

Take a look a the the contents of the app.js file generate by the express site generator, in it you will see a few important lines:
```js
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
```
You can see these as files in the `routes` directory. Their names are `index.js` and `users.js`. These files are where we define the routes that the application will respond to. The `index.js` file is where we define the routes for the homepage, and the `users.js` file is where we define the routes for the user management pages.

After setting some parameters on the express app, we tell the Express app to use these routes in the ```app.js``` file:
```js
//Note how indexRouter has been called with just a "/"
app.use('/', indexRouter); 
//If you visit the base URL + "/users",
//you will be routed through the usersRouter:
app.use('/users', usersRouter);
```

These correspond to the `index.js` and `users.js` files in the `routes` directory. These files are where we define the routes that the application will respond to. The `index.js` file is where we define the routes for the homepage, and the `users.js` file is where we define the routes for the user management pages.

Lets take a look at the contents of the `index.js` file:
```js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
```

Look at where it says `res.render`: there are options here. What `res.render` is telling Express to do is to render the contents of the "index" view in the "views" directory. The "index" view is an EJS file, which is a templating engine that allows us to inject data into the HTML that we are serving. In this case, we are injecting the title "Express" into the HTML. This is how we can dynamically generate HTML pages. Take a look at the contents of the `index.ejs` file:
```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

Note the `<%= title %>` tags. These are where the data is injected into the HTML. The `<%=` tag is an EJS tag that tells the EJS engine to inject the data into the HTML. The `title` variable is defined in the `app.js` file, and is passed to the `index.ejs` file as a parameter.

Say we wanted to add another variable to the `index.ejs` file. We could do this by adding another parameter to the `res.render` function in the `index.js` file:

```js
//This code...
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Becomes...
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', subtitle: 'This is a website made using express' });
});

```

You could then edit your HTML to include the subtitle:
```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
    <p><%= subtitle %></p>
  </body>
</html>
```

You could even pass a JSON object through the `res.render` function:
```js
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', testJSON: {someText: "Hello", someNumber: 2, someArray: [1,2,3], anotherObject:{someMoreText: "World"}} });
});
```

We're not limited to just using the `render` function to render HTML. We can use `res.json` to instead send a JSON response:
```js
router.get('/', function(req, res, next) {
  res.json({someText: "Hello", someNumber: 2, someArray: [1,2,3], anotherObject:{someMoreText: "World"}});
});
```

If you visited that URL. It would will result in your browser displaying the response as JSON, rather than as HTML. 
```json
{
    "someText": "Hello",
    "someNumber": 2,
    "someArray": [1, 2, 3],
    "anotherObject": { "someMoreText": "World" }
}
```
Notice that router.get is a function that is called every time a route is called. This means we can invoke an operaton every time its called. For example, we could create a counter that increments every time a route is requested: 
```js
var counter = 0;

router.get('/', function(req, res, next) {
  counter++;
  res.render('index', { title: counter });
});
```
The result is that every time you visit the homepage, the counter will increment by one.

You may notice that counter is defined outside of the router.get function. This is because the router.get function is called every time a route is requested. If we defined the counter inside the router.get function, it would be reset to 0 every time a route was requested.

### The `/catalog` route:
The `routes/catalog.js` file includes the following code:

```js
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const molfiles = './public/molfiles/';
    res.render('catalog', { title: 'Catalog', list: fs.readdirSync(molfiles)});
});

module.exports = router;
```

To break this down, we first require `express` and `express.Router()`. Since I am creating the catalog page based on a the contents of a file folder, I also require the `fs` module. The `fs` module allows for operations such as reading and writing files, and creating directories. The `fs` module is part of the Node.js standard library, so it does not need to be installed.

I call the `fs.readdirSync` function, which reads the contents of a directory. The `fs.readdirSync` function takes a single parameter, which is the path to the directory. In this case, the path is `./public/molfiles/`. The `./` at the start of the path tells the function to look in the current directory. The `public` directory is the directory that contains the `molfiles` directory. The `molfiles` directory contains the files that will be displayed on the catalog page. The `fs.readdirSync` function returns an array of the names of the files in the directory.

The contents of the `molfiles` directory are displayed on the catalog page. The `molfiles` directory contains a number of `.mol` files.

For instance, in the viewer.js file:
```js
/* GET the viewer page. */
//This route used to render a page called "viewer".
//URL: https://localhost:4000/moleculeviewer
//This route takes in an id as a parameter and checks if there is a file with the same id as the parameter in the molfiles directory.
router.get('/', function(req, res, next) {
  //Render the viewer page with the id 2519 as an argument with the title "Molecule Viewer" and item 2519 (CID for Caffeine)
  res.render('viewer', { title: 'Molecule Viewer', item: 2519 });
});

/* GET the viewer page. */
//This route takes in an id as a parameter 
router.get('/:id', function(req , res){
  //Read the molfiles directory and store the names of the files in an array
  var molfiles = fs.readdirSync('./public/molfiles/')

  //Check if the array includes a file with the same name as the id parameter
  //req.params.id is the id parameter '/:id'
  if(molfiles.includes(req.params.id + '.mol')){
    //If the file exists, read the file and store the contents in a variable called molfile
    molfile = fs.readFileSync('./public/molfiles/'+req.params.id+'.mol', 'utf8');
    //Render the viewer page with the id as the item argument  
    res.render('viewer', {
      title: 'Molecule Viewer', 
      item: req.params.id
    });
  }
  //If the file does not exist, render the viewer page with the id 2519 as a fallback
  else{
    res.render('viewer', {
      title: 'Molecule Viewer', 
      item: 2519
    });
  }
});

```

You could also pass the contents of the file through the `res.render` function, as shown in the `item.js` file:

```js
router.get('/:id', function(req , res){
  
  //Read the molfiles directory and store the names of the files in an array
  let molfiles = fs.readdirSync('./public/molfiles/')
  
  //Read the contents of the catalogData.json file and store the contents in a variable called data
  let catalogData = JSON.parse(fs.readFileSync('./public/catalog/catalog.json', "utf8"));
  
  //Check if the array includes a file with the same name as the id parameter
  if(molfiles.includes(req.params.id + '.mol')){
    
    //If the file exists, read the file and store the contents in a variable called molfile
    let molfile = fs.readFileSync('./public/molfiles/'+req.params.id+'.mol', 'utf8');
    
    let moleculeName = 'No name in catalog';
    let moleculeFormula = 'No formula in catalog';
    //Check if the catalogData object has a property with the same name as the id parameter (needs to correspond to file name)
    if(catalogData[req.params.id]){
      //If the property does exist, set the name and formula properties to 'No name in catalog' and 'No formula in catalog'
      moleculeName = catalogData[req.params.id].name;
      moleculeFormula = catalogData[req.params.id].formula;
    }
    
    //Render the item page with the id as the item argument and the molfile as the molfile argument
    res.render('item', {
      title: 'Molecule Viewer: '+ req.params.id, 
      item: req.params.id, 
      molfile: molfile,
      name: moleculeName,
      formula: moleculeFormula,
    });
  }
  
  //If the file does not exist, render the error page:
  else{
    res.render('error', {title: 'Error', message: 'Molecule not found', error: {status: 404}});
  }
});
```

### Adding an admin route to the application:

Say for instance we want to add a new page to our application. We could do this by creating a new route in the `app.js` file:

At the start of the file:
```js
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//New code to add:
var adminRouter = require('./routes/admin');
```

Then we need to tell the Express app to use the new route:
```js
app.use('/', indexRouter); 
app.use('/users', usersRouter);
//New code to add:
app.use('/admin', adminRouter);
```

Now we need to add a new file to the `routes` directory. We will call it `admin.js` and add this content to it:
```js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Admin Page' });
});

module.exports = router;
```

Then, in the "views" directory, we need to create a new file called `admin.ejs` and some content to it:
```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
  </body>
</html>
```

Once you add these files, you should be able to visit the `/admin` page and see the new page. For instance, visit `http://localhost:4000/admin` in your browser, and you will see the contents of the `admin.ejs` file rendered to HTML.

After adding these files, your directory structure should look like this:

```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── admin.js
│   ├── index.js
│   └── users.js
└── views
    ├── admin.ejs
    ├── error.ejs
    ├── index.ejs
    └── userList.ejs
```

By adding new files to the `routes` directory, we can add new routes to our application. We can also add new files to the `views` directory, and use them to render HTML pages. This is the basic structure of an Express application.

Of course, there may be things that we want to do like creating "dynamic routes". For instance, you may want a route that looks like this: `/users/1234`. This would be a route that would display the user with the ID of 1234. If you want to read up on how to do this, you can read the [Express documentation on route parameters.](https://expressjs.com/en/guide/routing.html#route-parameters)

### The `/public/` directory:
Note how in the previous example I was able to access the the contents of the `style.css` file by using the URL: `/stylesheets/style.css`. This is because Express has a built-in middleware function called `express.static` which is used to serve static files. This means that any files in the `public` directory can be accessed by using the `/public` URL. For instance, if you wanted to access the `style.css` file, you could use the URL: `/public/stylesheets/style.css`.

The contents of the public folder for a project with Threex and AR.js might look like this:
```
├── public
    ├── catalog
    ├── cjson
    ├── data
    ├── datgui
    ├── img
    ├── js
    ├── jsartoolkit5
    ├── molfiles
    └── threex
```

The `catalog` directory includes a .JSON file which has information about the particulars of the molecules. The `cjson` folder includes a script called `converter.js` which converts molfiles to JSON objects. We then have a folder called `data` which included some sample patterns and molecules. The `datgui` folder includes a script called `dat.gui.js` which is used to create a GUI for the application. The `img` folder includes some images which are used in the application. The `js` folder includes the main script for the application. The `jsartoolkit5` folder includes the AR.js library. The `molfiles` folder includes some sample molecules as .mol files . The `threex` folder includes scripts which handle DOM events.

You can see that how these files are accessed in the by the HTML rendered from the `molecule.ejs` file:

```html
<link rel='stylesheet' href='/styles/style.css' />
<script src='/js/three.js'></script>
<!-- include jsartookit -->
<script src="/jsartoolkit5/artoolkit.min.js"></script>
<script src="/jsartoolkit5/artoolkit.api.js"></script>
<!-- include threex.artoolkit -->
<script src="/threex/threex-artoolkitsource.js"></script>
<script src="/threex/threex-artoolkitcontext.js"></script>
<script src="/threex/threex-arbasecontrols.js"></script>
<script src="/threex/threex-armarkercontrols.js"></script>
<!-- include datgui debugging purposes -->
<script type="text/javascript" src="/datgui/dat.gui.min.js"></script>
<!-- include Mol file to CJSON conversion extras -->
<script src="/cjson/converter.js"></script>
```

## Three.js
A demonstration of how to draw molecular diagrams with Three.js

### Getting Started
This is a demonstration of how to draw molecular diagrams with Three.js. It is based on the [Three.js](https://threejs.org/) library, which is a JavaScript library for drawing 3D graphics in a web browser. This code takes a `.mol` file and converts it to a JSON object, which is then used to draw the 3D model of the molecule.

### Running a Web Server
Because we may need to load external files, such as images and 3D models, we have to deal with Cross-Origin Resource Sharing (CORS) requests. You can allow access to local files in a particular directory in your browser, but its preferable to run a web server to serve the files.

If you have Node.js installed, you can use the [`http-server`](https://www.npmjs.com/package/http-server) package to quickly run a web server from the project director, using the command:
```
http-server -a localhost -p 8000
``` 
You can then visit [http://localhost:8000](http://localhost:8000) in your browser and will see the contents of the `index.html` file in the root of the directory being served.

If you don't have Node.js installed, you can use the `python -m SimpleHTTPServer` command to run a web server instead.

You can also use something like a [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for Visual Studio Code, though not all functionality will work.

## Creating a Three.js Scene

### Importing Three.js

Start by setting up a basic file structure and importing version `r150` of the Three.js library. Note: you can also install the ES6 module version of Three.js using `npm install three` and this method is recommended for more complex projects. But for this simple example, we will use the minified version of the older version of the library.

First, make a file called `index.html` and add the following code:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Three JS Molecules</title>
</head>
<body>
    
</body>
</html>
```

Then, you need to download the Three.js library. You can download the minified version from the [Three.js Github Repository](https://raw.githubusercontent.com/mrdoob/three.js/dev/build/three.min.js) and save it in a folder called `js` in the root of your project directory,
so we have something like this to get started from:

```bash
.
├── index.html
├── js
│   └── three.min.js
└── README.md
```

Now, we can add the Three.js library to our `index.html` file. We will add it to the `<head>` section of the file, and we will add it as a `<script>` tag.

```diff
<!DOCTYPE html>
<html>
<head>
    <title>Three JS Molecules</title>
+   <script src="js/three.min.js"></script> 
</head>
<body>
    
</body>
</html>
```

and then add a `<script>` tag to the end of the `<body>` section of the file.

```diff
<!DOCTYPE html>
<html>
<head>
    <title>Three JS Molecules</title>
    <script src="js/three.min.js"></script> 
</head>
<body>
+   <script>
+
+   </script>   
</body>
</html>
```

Inside that script tag, we can start to write our JavaScript code that will define what our 3D scene looks like.

Using the code from the [creating a scene](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene) page of the official Three.js docs, we can start by with creating a scene, a camera, and a renderer. We can then add the camera to the scene, and add the renderer to the `<body>` section of the page:

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```

Next, to add a basic cube to the scene, we can use the code from the documentation and add it to the scene, and adjust the camera's `position.x`, `position.y` and `position.z` values so that we can see the multiple faces of the cube, then we can use the `lookAt()` method to make the camera look at the center of the scene (coordinates `0,0,0`):

```js
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(0,0,0);
```

Finally, we can add a `render()` function that will be called every time the screen needs to be updated, and call it once to render the scene:

```js
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
```

You will also want to set a margin of 0 on the `<body>` tag to prevent the margins from creating overflow in the window:

```html
<style>
    body { margin: 0; }
</style>
```

Put everything together, and your code will look like this:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Three JS Molecules</title>
    <script src="js/three.min.js"></script>
    <style>
        body { margin: 0; }
    </style> 
</head>
<body>
    <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = 5;
        camera.lookAt(0,0,0);
        
        function animate() {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }
        animate();
    </script>
</body>
</html>
```

You should see a green cube in the center of the browser window.

### Create an init() function

Now that we have a basic scene set up, we can start to add some more complex objects to the scene. We will start by creating a function called `init()` that will be called when the page loads, and will contain all of the code that we need to set up the scene.

We need to declare the `scene`, `camera`, and `renderer` variables globally, then define items like geometries within the `init()` function:

and then we can define the `init()` function:

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function init(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(0,0,0);
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
init();
animate();
```

When we call the `init()` function before the `animate()` function, the geometry is added to the scene and the camera positioned before the animation loop starts.

### Load a mol file

Now that we have a basic scene set up, we can start to add some more complex objects to the scene. We will start by creating a function that fetches a mol file from the server, and then parses it to create a Three.js mesh.

First, create folder where you will store your mol files, in my case I will create a folder called `molecules` in the root of the project and add some mol files retrieved from ChemSpider and named using their respective ChemSpider IDs:

```bash
.
├── index.html
├── js
│   └── three.min.js
├── molecules
│   └── 2424.mol
└── README.md
```

I've added 2424.mol to the molecules folder, the Chemspider ID for caffeine.

Let's fetch the mol file from the server and parse it to create a Three.js mesh. We will start by fetching the mol file from the server using the `fetch()` function.

```js
function init(){
    fetch('molecules/2424.mol')
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });
}
```

We can refactor the `init()` function to use a parameter which defines the ID of the molfile to load:

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function init(CSID){
    fetch('molecules/' + CSID + '.mol')
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

const defaultCSID = 2424;

init(defaultCSID);
animate();
```

This will log the mol file to the console. In order to understand the mol file format, articles [like this](https://chem.libretexts.org/Courses/University_of_Arkansas_Little_Rock/ChemInformatics_(2017)%3A_Chem_4399_5399/2.2%3A_Chemical_Representations_on_Computer%3A_Part_II/2.2.2%3A_Anatomy_of_a_MOL_file) are very useful as well as the [Wikipedia article on chemical table file formats](https://en.wikipedia.org/wiki/Chemical_table_file#:~:text=An%20MDL%20Molfile%20is%20a,sections%20for%20more%20complex%20information.).


### Parsing a mol file

Let's break down the basic contents of the 2424.mol file:

The first three lines of a mol file contain information about the file itself, including a name (first line), information about the program that created the file (second line), and a third line that may contain a comment (and is sometimes used to store dates). The contents of these lines vary depending on the program used for their creation and there is a degree of inconsistency in the way that they are used.

```bash
2519
  Marvin  12300703363D          

```

Next, the fourth line contains information about the number of atoms and bonds in the molecule:

```bash
 24 25  0  0  0  0            999 V2000
```

Here it becomes important to note that mol files are arranged in a fixed-width format, with each line containing a fixed number of characters. The first three characters of each line contain the number of atoms in the molecule, the next three characters contain the number of bonds, and the next six characters contain the number of charges, the number of isotopes, the number of stereo centers, the number of stereo bonds, and the number of unknown properties, respectively. The next six characters are reserved for future use, and the last three characters are used to indicate the version of the mol file format (in the case of the caffeine mol file retrieved from Chemspider, this is V2000).

The first two numbers are what we are particularly interested in, as they are going to help with parsing the rest of the file, as each atom receives its own line after the fourth line, and the bonds are listed after the atoms.

We can start by creating a function that parses the content of the mol file that will return a JSON object containing the information we want about the atoms and bonds in the molecule:

```js
function molFileToJSON(molFile){
    let molObj = {};
    return molObj;
}
```

We can then split the string in to an array of lines:

```js
function molFileToJSON(molFile){
    let molObj = {};

    const split = molFile.split('\n');

    return molObj;
}
```

We can then get the counts by chunking the line of the array:
```js
function molFileToJSON(molFile){
    let molObj = {};

    const split = molFile.split('\n');

    const countChunks = [];
    for (let i = 0; i < split[3].length; i+=3) {
        countChunks.push(split[3].slice(i, i+3));
    }

    return molObj;
}
```

Since mol files don't use padding on their number we then need to trim their the whitespace from the chunks before assigning them in the molObj:

```js
function molFileToJSON(molFile){
    let molObj = {};

    const split = molFile.split('\n');

    const countChunks = [];
    for (let i = 0; i < split[3].length; i+=3) {
        countChunks.push(split[3].slice(i, i+3));
    }

    molObj.counts.molecules = countChunks[0].trim();
    molObj.counts.bonds = countChunks[1].trim();
    molObj.counts.lists = countChunks[2].trim();
    molObj.counts.chiral = countChunks[4].trim() == 1 ? true : false;
    molObj.counts.stext = countChunks[5];

    return molObj;
}
```

Once we have count for `molObj.counts.molecules` and `molObj.counts.bonds` we can then use them to parse the atoms and bonds in the file. In 2425.mol, since there are 24 atoms and 25 bonds, the atoms are listed from line 5 to line 28, and the bonds are listed from line 29 to line 53. A line describing a single atom looks like this:
```text
    0.2334   -2.4028    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
```
The X, Y, and Z columns contain the coordinates of the atom, the next column contains the element symbol. The X, Y, and Z coordinates are in the format #####.####, five digits for the integer part and four digits for the decimal part, so columns 1-10 contain the X coordinate, columns 11-20 contain the Y coordinate, and columns 21-30 contain the Z coordinate. The next column contains the Molecule's symbol (i.e. O for Oxygen, Na for Sodium, etc.).

We can parse each of the atoms by iterating over the lines starting from the fifth line and finishing at line 5 + `molObj.counts.molecules`:

```js
const atomsArray = [];
for (let i = 4; i < 4 + parseInt(molObj.counts.molecules); i++) {
    const atom = {};
    atom.position = {};
    atom.position.x = split[i].slice(0, 10).trim();
    atom.position.y = split[i].slice(10, 20).trim();
    atom.position.z = split[i].slice(20, 30).trim();
    atom.type = split[i].slice(31, 33).trim();
    atomsArray.push(atom);
}
molObj.atoms = atomsArray;
```
I like to use the format `position: {x,y,z}` to store the positions, as it matches the syntax used in the Three.js library. Thus you can access the X coordinate of the first atom in the molecule by using `molObj.atoms[0].position.x` and it's type (element symbol, i.e. O for Oxygen, Na for Sodium) by using `molObj.atoms[0].type`.

Next, we want to retrieve the bonds. A line describing a single bond looks like this:
```text
  1  9  2  0  0  0  0
```
This is a connection table. The first two columns contain the index of the atoms that are connected by the bond (the order in which they appeared in the file). The third column contains the bond type. Thus it is crucial to keep the order of the atoms in the molObj's atom array in the same order as the order in which they appear in the file. One should note that **`.mol` files have a starting index of 1**.

We can retrieve the bonds by iterating over the lines starting from the 5 + `molObj.counts.molecules` line and finishing at line 5 + `molObj.counts.molecules` + `molObj.counts.bonds`, and write them in a 2D array as `molObj.bonds`:

```js
const bondsArray = [];
for (let i = 4+parseInt(molObj.counts.molecules); i < 4 +parseInt(molObj.counts.molecules)+ parseInt(molObj.counts.bonds); i++) {
    const bond = [split[i].slice(0, 3).trim(), split[i].slice(3, 6).trim(), split[i].slice(6, 9).trim()];
    bondsArray.push(bond)
}
molObj.bonds = bondsArray;
```

With the addition of objects to represent the header of the `.mol` file, the code looks like this:

```js
const molFileToJSON = (molFile) => {
    let molObj = {};
    const split = molFile.split('\n');
    
    molObj.header = {};
    molObj.header.title = split[0];
    molObj.header.program = split[1].split('  ')[1];
    molObj.header.timeStamp = split[1].split('  ')[2];
    molObj.header.comment = split[2];

    molObj.counts = {};
    
    const countChunks = [];
    for (let i = 0; i < split[3].length; i += 3) {
        countChunks.push(split[3].slice(i, i + 3));
    }

    molObj.counts.molecules = countChunks[0].trim();
    molObj.counts.bonds = countChunks[1].trim();
    molObj.counts.lists = countChunks[2].trim();
    molObj.counts.chiral = countChunks[4].trim() == 1 ? true : false;
    molObj.counts.stext = countChunks[5];

    const atomsArray = [];
    for (let i = 4; i < 4 + parseInt(molObj.counts.molecules); i++) {
        const atom = {};
        atom.position = {};
        atom.position.x = split[i].slice(0, 10).trim();
        atom.position.y = split[i].slice(10, 20).trim();
        atom.position.z = split[i].slice(20, 30).trim();
        atom.type = split[i].slice(31, 33).trim();
        atomsArray.push(atom);
    }
    molObj.atoms = atomsArray;

    const bondsArray = [];
    for (let i = 4+parseInt(molObj.counts.molecules); i < 4 +parseInt(molObj.counts.molecules)+ parseInt(molObj.counts.bonds); i++) {
        const bond = [split[i].slice(0, 3).trim(), split[i].slice(3, 6).trim()];
        bondsArray.push(bond)
    }
    molObj.bonds = bondsArray;

    return molObj;
}
```

### Adding the `.mol` file converter

We can make a new file and call it `molFileToJSON.js`. We can then import the function into the project by adding the following line to the top of `index.js`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Three JS Molecules</title>
    <script src="js/three.min.js"></script>
    <script src="js/molFileToJSON.js"></script>

    ...

</head>
```

We can then call the function in the `drawMolecule` function:

```html
<body>
    <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        const geometry = new THREE.SphereGeometry( .1, 32, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

        function drawMolecule(molFile){
            const molObject = molFileToJSON(molFile);
            
            for(let item of molObject.atoms){
                const sphere = new THREE.Mesh( geometry, material );
                sphere.position.x = item.position.x;
                sphere.position.y = item.position.y;
                sphere.position.z = item.position.z;
                scene.add( sphere );
            }
        }

        function init(CSID){
            fetch('molecules/' + CSID + '.mol')
                .then(response => response.text())
                .then(molFile => {
                    drawMolecule(molFile);
                });

            camera.position.x = 5;
            camera.position.y = 5;
            camera.position.z = 5;
            camera.lookAt(0,0,0);
        }
        
        function animate() {
            requestAnimationFrame( animate );
            renderer.render( scene, camera );
        }

        const defaultCSID = 2424;
        
        init(defaultCSID);
        animate();
    </script>
</body>
</html>
```

You will now see a sphere for each atom in the molecule, positioned according to the coordinates specified in the `.mol` file. The spheres are all the same size and color, and due to a lack of shading, appear to be flat.

### Clear the scene when the init function is called

We can clear the scene when the `init` function is called by adding the following lines to the start of the `init` function:

```js
while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
}
```

This removes the spheres from the scene, so that when the `init` function is called again, the spheres are not drawn again. By changing the `CSID` variable to a different value, a different molecule can be drawn (so long as the  corresponding file is present in the `molecules` folder).

### Style the spheres

The various elements of the molecule can be styled by changing the values of the `geometry` and `material` variables. The `geometry` variable is used to define the shape of the sphere, and the `material` variable is used to define the color and shading of the sphere. The `geometry` variable is defined as follows:

```js
const sphere = new THREE.Mesh( geometry, material );
```

If we want to vary the size of the sphere, we can use an object to hold these values in a map, and then use the `atom.type` value to select the appropriate item.

```js
const moleculeGeometries = {
    "C": new THREE.SphereGeometry( .8, 32, 32 ),
    "H": new THREE.SphereGeometry( .3, 32, 32 ),
    "O": new THREE.SphereGeometry( .5, 32, 32 ),
    "N": new THREE.SphereGeometry( .6, 32, 32 ),
    "S": new THREE.SphereGeometry( .8, 32, 32 ),
    "P": new THREE.SphereGeometry( .9, 32, 32 ),
    "F": new THREE.SphereGeometry( .4, 32, 32 ),
    "Cl": new THREE.SphereGeometry( .5, 32, 32 ),
    "Br": new THREE.SphereGeometry( .6, 32, 32 ),
    "I": new THREE.SphereGeometry( .7, 32, 32 ),
}
const moleculeMaterials = {
    "C": new THREE.MeshStandardMaterial( { color: 0x333333 } ),
    "H": new THREE.MeshStandardMaterial( { color: 0xffffff } ),
    "O": new THREE.MeshStandardMaterial( { color: 0xff0000 } ),
    "N": new THREE.MeshStandardMaterial( { color: 0x0000ff } ),
    "S": new THREE.MeshStandardMaterial( { color: 0xffff00 } ),
    "P": new THREE.MeshStandardMaterial( { color: 0xff00ff } ),
    "F": new THREE.MeshStandardMaterial( { color: 0x00ff00 } ),
    "Cl": new THREE.MeshStandardMaterial( { color: 0x00ff00 } ),
    "Br": new THREE.MeshStandardMaterial( { color: 0x00ff00 } ),
}
```

And we then access these items in the `drawMolecule` function when we define the sphere:

```js
for(let item of molObject.atoms){
    const sphere = new THREE.Mesh( moleculeGeometries[item.type], moleculeMaterials[item.type] );
    ...
}
```
### Adding lights

See the Three.js docs on [ambient lighting.](https://threejs.org/docs/#api/en/lights/SpotLight)

We can add ambient and spotlighting in our scene by including the following lines in the `init` function:

```js
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );
spotLight.map = new THREE.TextureLoader().load( url );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );
```

### Add an axes helper

An axis helper is a useful tool built in to Three.js for visualizing orientation. We can add an axis helper to the scene by including the following line in the `init` function:

```js
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
```

This particular mol file of caffeine has been centered to the origin, which is useful if we consider that we will want to be able to rotate the molecule later on in the tutorial.


### Center the molecule to the origin
In order to center the molecule to the origin, we need to calculate the center of the molecule. To do this, we need to determine the minimum and maximum values for the x, y, and z coordinates. We can do this by iterating through the atoms in the molecule, and comparing the current value of the x, y, and z coordinates to the current minimum and maximum values. We can then use the midpoint of these values to center the molecule to the origin.

First, we need to create a variable to hold the minimum and maximum values for the x, y, and z coordinates, and set these to an initial value using the first item in the atoms array.

Doing this 

```js
//Get the first point in the molecule:  
let firstPoint = new THREE.Vector3(
    molObject.atoms[0].position.x, 
    molObject.atoms[0].position.y, 
    molObject.atoms[0].position.z);
//Set the initial limits to the first point:
let limits = {
    x: {
        min: firstPoint.x,
        max: firstPoint.x
    },
    y: {
        min: firstPoint.y,
        max: firstPoint.y
    },
    z: {
        min: firstPoint.z,
        max: firstPoint.z
    }
}
```

Then, we need to iterate through the atoms in the molecule, and compare the current value of the x, y, and z coordinates to the current minimum and maximum values:

```js
for(let item of molObject.atoms){
    let point = new THREE.Vector3(
        item.position.x, 
        item.position.y, 
        item.position.z);

    if(Number(point.x) < Number(limits.x.min)){
        limits.x.min = point.x;
    }
    if(Number(point.x) > Number(limits.x.max)){
        limits.x.max = point.x;
    }
    if(Number(point.y) < Number(limits.y.min)){
        limits.y.min = point.y;
    }
    if(Number(point.y) > Number(limits.y.max)){
        limits.y.max = point.y;
    }
    if(Number(point.z) < Number(limits.z.min)){
        limits.z.min = point.z;
    }
    if(Number(point.z) > Number(limits.z.max)){
        limits.z.max = point.z;
    }
}
```

Then, we can create a new variable to hold the midpoint of the x, y, and z coordinates:

```js
let moleculeCenter = new THREE.Vector3(
    (Number((limits.x.min)) + Number(limits.x.max))/2,
    (Number((limits.y.min)) + Number(limits.y.max))/2,
    (Number((limits.z.min)) + Number(limits.z.max))/2);
```

Then, this can be used to center the molecule to the origin:

```js
sphere.position.x = item.position.x - moleculeCenter.x;
sphere.position.y = item.position.y - moleculeCenter.y;
sphere.position.z = item.position.z - moleculeCenter.z;
```

If we go back and load the Sodium Stearate molecule, we should see something like this:

### Using ES6 modules

First, download `three.modules.js` file from the Three.js repository or install Three.js using npm:
https://threejs.org/docs/#manual/en/introduction/Installation

Next, remove the script tag for `three.js` from the `index.html` file:

```diff
<head>
    <title>Three JS Molecules</title>
-   <script src="js/three.min.js"></script> -->

    <script src="js/molFileToJSON.js"></script>

    <style>
        body { margin: 0; }
    </style> 
</head>
```
And we then add `type="module"` to the script tag for `molFileToJSON.js`:

```html
<script type= "module" >
</script>
```

Then, import the THREE module:

```diff
<script type= "module" >
+   import * as THREE from './js/three.module.js';
</script>
```

This will allow us to use the ES6 module syntax in our `molFileToJSON.js` file.

### Importing OrbitControls

OrbitControls is an addition to Three.js that allows us to rotate the camera around the scene. We can import OrbitControls by adding the following line to the `molFileToJSON.js` file. First, start by saving the `OrbitControls.js` file to the `./js/` folder, the continue by adding an import map to the head of the HTMl file:
```
<script type="importmap">
    {
        "imports": {
            "three": "./js/three.module.js",
            "OrbitControls": "./js/OrbitControls.js"
        }
    }
</script>
```
Then, we can import OrbitControls by adding the following to our main script:

```js
import {OrbitControls} from './js/OrbitControls.js';
```

Then, in the global scope, we can create a new instance of OrbitControls, after the camera and render have been created:

```diff
    import * as THREE from './js/three.module.js';
+   import {OrbitControls} from './js/ OrbitControls.js';
 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(    75, window.innerWidth / window.innerHeight,   0. 1, 1000 ); 

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.   innerHeight );
    document.body.appendChild( renderer.   domElement ); 

+   const controls = new THREE.OrbitControls( camera, renderer.domElement );
```

Then, in the animation loop, we can call the `update()` method on the controls object:

```js
controls.update();
```

With everything in place, we should be able to rotate the camera around the scene by clicking and dragging the mouse. Dragging the mouse in combination with the shift or control key will allow us to pan the camera, and the scroll wheel will allow us to zoom in and out.

### Add the atoms to a group
Since we will be adding multiple molecules to the scene, we can add each molecule to a group, and then add the group to the scene. This will allow us to manipulate the group as a whole, rather than each individual molecule.

Begin by creating a new group in the global scope:

```js
let moleculeGroup = new THREE.Group();

function drawMolecule(molFile){
    ...
}
```

Then, instead of adding the sphere to the scene, we can add it to the group, and then add the group to the scene:

```diff
let moleculeGroup = new THREE.Group();

function drawMolecule(molFile){
    ...
    for(let item of molObject.atoms){
        const sphere = new THREE.Mesh( moleculeGeometries[item.type], moleculeMaterials[item.type] );
        
        sphere.position.x = item.position.x - moleculeCenter.x;
        sphere.position.y = item.position.y - moleculeCenter.y;
        sphere.position.z = item.position.z - moleculeCenter.z;
        
-       scene.add( sphere );
+       moleculeGroup.add( sphere );
    }
+   scene.add( moleculeGroup );
}
```

This will allow us to manipulate the group as a whole, rather than each individual molecule. This will be useful in the next step, when we add the ability to manipulate the molecule.

## Adding datgui and manipulating the molecule group
We can use datgui to add a user interface to our application. This will allow us to manipulate the molecule group, and see the changes in real time.

To use datgui, download or install it using npm. To use it with the project, we can add the following to the head of the HTML file:

```html
<head>
    ...
    <script type="text/javascript" src="js/datgui/dat.gui.min.js"></script>
    ...
</head>
```

We can then add a new GUI in the init function:

```diff
+   const gui = new dat.GUI();
```

Then, we can add a folder to the GUI, and add a slider to the folder:

```js
const moleculePosition = gui.addFolder('Position')
moleculePosition.add(moleculeGroup.position, 'x', -10, 10)
moleculePosition.add(moleculeGroup.position, 'y', -10, 10)
moleculePosition.add(moleculeGroup.position, 'z', -10, 10)

const moleculeRotation = gui.addFolder('Rotation')
moleculeRotation.add(moleculeGroup.rotation, 'x', -Math.PI, Math.PI)
moleculeRotation.add(moleculeGroup.rotation, 'y', -Math.PI, Math.PI)
moleculeRotation.add(moleculeGroup.rotation, 'z', -Math.PI, Math.PI)

const moleculeScale = gui.addFolder('Scale')
const scaleX = moleculeScale.add(moleculeGroup.scale, 'x', .1, 1.5).name("Scaling Factor")
scaleX.onChange(function(value){
moleculeGroup.scale.y = value;
moleculeGroup.scale.z = value;
})
```

This will give you a set of controls that will allow you to manipulate the molecule group. The controls should look something like this:

### Adding auto-rotation

We can add auto-rotation to the molecule group by adding a few things, firstly, a variable to keep track of whether or not auto-rotation is enabled:

```js
let autoRotate = {
    switch: false
}
```

Then, within the `init()` function, we can add a checkbox to the GUI, and add an event listener to the checkbox:

```js
gui.add(autoRotate, "switch").name("Auto Rotate");
```

Finally, we can add a check to the animation loop, to see if auto-rotation is enabled, and if so, rotate the molecule group:

```js
if(autoRotate.switch){
    moleculeGroup.rotation.x-=.5*deltaTime;
}
```

Then, we'll be able to toggle auto-rotation on and off, and see the molecule rotate in real time, like so:


### Adding buttons to toggle the molecule type in the menu

We can add buttons to the menu, to toggle between the different molecule types. To do this, we can add a new function to the GUI object, that will be called when the button is clicked:

```js
var params = {
    showCaffeine : function(CSID) { 
        getMolecule(2424);
    },
    showEthanol : function(CSID) { 
        getMolecule(682);
    },
    showCatnip : function(CSID) { 
        getMolecule(141747);
    },
    showCinnamon : function(CSID) { 
        getMolecule(553117);
    }
};
```

Then, we can add the buttons to the menu:

```js
const moleculeType = gui.addFolder('Example Molecules   ')
moleculeType.add(params, 'showCaffeine').name('Caffeine (Coffee, Chocolate, Tea)');
moleculeType.add(params, 'showEthanol').name('Ethanol (Alcohol)');
moleculeType.add(params, 'showCatnip').name('Nepetalactone (Catnip)');
moleculeType.add(params, 'showCinnamon').name('Cinnamaldehyde (Cinnamon Smell)');
```
That will give us a set of buttons that will allow us to toggle between the different molecule types.


## Tracker Based AR Molecule Viewer
The primary basis for the viewer application is this example, the "Hello Cube" from [Lee Stemkoski's AR.js examples](
https://github.com/stemkoski/AR-Examples/blob/master/hello-cube.html)

The simplest part of this application to modify is the section following the markerRoot setup. This is where we can add our own 3D objects to the scene. For instance, we can add a cube to the scene like this:
```js
let geometry1 = new THREE.CubeGeometry(1,1,1);
let material1 = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
}); 

mesh1 = new THREE.Mesh( geometry1, material1 );
mesh1.position.y = 0.5;

markerRoot1.add( mesh1 );
```

We create a cube geometry, and a material. We then create a mesh, and add it to the markerRoot. The markerRoot is the object which is attached to the marker. This means that the cube will be attached to the marker. If we instead wanted to add a sphere, we could change the geometry1 properties like this:
```js
let geometry1 = new THREE.SphereGeometry(1,32,16);
let material1 = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
}); 

mesh1 = new THREE.Mesh( geometry1, material1 );
mesh1.position.y = 0.5;

markerRoot1.add( mesh1 );
```
Thus, we can modify this code to add our own 3D objects to the scene, and attach them to the marker. Using the molecule viewer as a basis, we can add a molecule to the scene, and attach it to the marker. We can then use the camera of the device to view the molecule in AR, with the marker as a reference point.



# Deployment
## Local Deployments
### CORS and HTTPS:
The AR.js library requires that the application is served over HTTPs. This is because the AR.js library uses the WebRTC API, which requires special permissions to be granted by the user. This is why we need to use HTTPS. If you want to develop locally, you can ignore the warnings about the SSL certificate being invalid.
 
If you want to secure the application locally, you will need to generate some unique SSL certificate credentials. For instruction on how to do this (particularly, generating `cert.pem`, `csr.pem` and `key.pem` files), and how to use them with NodeJS, [take a look at this article](https://adamtheautomator.com/https-nodejs/)

When deploying to a cloud service like Azure Websites, HTTPS is enabled by default, which means that you don't need to worry about this.

## Remote Deployment
### Deploying to Azure Websites:
To deploy to Azure Websites, you will need to create an Azure account. Once you have done this, you can create a new web application. You can do this from the Azure Portal, or from the integrated tools in your IDE. Once you have created the web application, you can deploy the application to it. You can do this from the integrated tools in your IDE, or from the command line. If you want to see a helpful guide on how to do this specifically with express.js, [take a look at this article.](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)

For instructions on using the integrated tools in your IDE, [take a look at this blog post](https://davidgiard.com/deploying-a-web-app-to-azure-from-visual-studio-code)




# References
## Blogs, tutorials and videos:
Net Ninja Express Tutorials:
https://www.youtube.com/watch?v=yXEesONd_54

FreeCodeCamp Data Structures and Algorithms Course:
https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/


## Documentation:
Node.js:
https://nodejs.org/en/

Express:
https://expressjs.com/en/guide/using-template-engines.html

AR.js:
Custom AR.js marker generator:
https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html

Stemkoski AR.js examples:
https://stemkoski.github.io/AR.js-examples/index.html

The Three.js docs:
https://threejs.org/

Libraries:
https://github.com/dataarts/dat.gui
https://github.com/artoolkitx/jsartoolkit5
https://github.com/jeromeetienne/threex.domevents

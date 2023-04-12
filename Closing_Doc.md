# ChemAR-Winter-2023
https://git.cs.dal.ca/belcher/chemar-winter-2023

## Winter 2023 Team Contacts

| Name | Role | Email |
|------|------|-------|
| Khaled Al-Mahbashi | Development Lead | khaled.al-mahbashi@dal.ca |
| Geoffrey Belcher | Technical Lead | gbelcher@dal.ca |
| Liam Osler | Senior Developer | liam.osler@dal.ca |
| Jacob Sehl | Senior Developer | jc373992@dal.ca |
| Brent Stevens | Junior Developer | br477448@dal.ca |
| Etienne Lafond | Junior Developer | etienne.lafond@dal.ca |
| Lawrence Jordan | Junior Developer | l.jordan@dal.ca |

## Logins
| Service | Email | Password |
|---------|-------|----------|
| Dal Account | chemar@dal.ca | HJ9z@CS554 |
| Github | chem-ar | HJ9z@CS554 |
| Chemspider API | chemar@dal.ca | QDn2#y72Hwuf |
| Jira/Confluence | chemar@dal.ca | 7Eow&27&qD!R |
| Google (domain name) | chemar@dal.ca | HJ9z@CS554 |
| Render | Github Auth |

## Description
This is a web application that allows users to view 3D models of molecules in Augmented Reality. The application uses the AR.js library to detect markers and display 3D models in the browser
The app allows the admin to edit and add lessons as well as molecules and custom scenes to the molecule and scene catalogs, which users can browse. When users click on a molecule, it renders the viewer page displaying a 3D model of the molecule in the browser. Users can also view 3D models in AR by scanning QR codes on their page. In the lesson editor page, admin can upload lesson sheets and add molecules which can be manipulated in position and size in relation to the sheet.

## Setup:
### Install:
Clone the repository:
```bash
git clone https://git.cs.dal.ca/belcher/chemar-winter-2023
```

Install the dependencies:
```bash
npm install
```

#### Running the application
To start the server, run the following command:
```bash
npm start
```

The server will start listening on port 4000. You can now access the web application by visiting https://localhost:4000 in your browser.

### Key Features
- View 3D models of molecules in Augmented Reality using AR.js library. [Implemented]
- Admin panel to edit and add lessons, molecules, and custom scenes. [Implemented]
- Molecule, scenes and lesson catalogs for users to browse. [Implemented]
    - Ability to add, edit, and delete molecules and scenes in the molecule and scene catalogs.
    - Ability to add, edit, and delete molecules, scenes and lessons in their respective catalog pages.
- Viewer page to display 3D models of molecules in the browser.
- Lesson editor page for admins to upload lesson sheets and add molecules.
    - Retrieve lesson sheets from the database and display them in the lesson editor page.
    - Manipulation of molecule position and size in relation to the sheet in the lesson.
    - Manipulation of tracking marker position and size in relation to the sheet in the viewer page.
    - Customization options for molecule display, such as color, rotation, and zoom.
- User authentication and authorization for admin panel access.
- Responsive design for seamless use across different devices.
- Search functionality to easily find molecules or scenes in the catalogs.
- Interactive and user-friendly interface for smooth navigation and usage.

#### Glossary of Important Terms:
- **Catalogs**: A catalog is a collection of molecules, scenes, or lessons that can be viewed in the browser. Catalogs are used to organize and display molecules, scenes, and lessons in a way that is easy to browse and search. There are three types of catalogs:
  - **Molecule Catalog**: A catalog that contains a list of molecules that can be viewed in the browser.
  - **Scene Catalog**: A catalog that contains a list of scenes that can be viewed in the browser.
  - **Lesson Catalog**: A catalog that contains a list of lessons that can be viewed in the browser.
  - Information about molecules, scenes, and lessons are stored in a JSON file in the `public/catalog/` directory:
    - `moleculeCatalog.json`: A JSON file that contains information about molecules in the molecule catalog.
    - `sceneCatalog.json`: A JSON file that contains information about scenes in the scene catalog.
    - `lessonCatalog.json`: A JSON file that contains information about lessons in the lesson catalog.
  - *General features across all catalog pages*:
    - With the edit button the admin can modify the item in the catalog.
    - With the preview button the user can quickly view a 3d preview of the molecule, scene or lesson.
    - With the share button the user can get a QR code link to view the particular item.
- **Molecules**: A molecule is a group of atoms held together by chemical bonds. Molecules are the smallest fundamental units of a pure substance that can exist in the physical state of matter.
  - **`.mol` file**: A serialized data file (SDF) that contains information about a molecule. It contains the positions and names of atoms, bonds, and other information about the molecule. It is a text file that can be opened in a text editor. These files can be exported from the [Avogadro](https://avogadro.cc/) molecule editor and visualizer software. There is also API such as [ChemSpider](https://www.chemspider.com/) and [PUBCHEM](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest#section=URL-based-API) that can be used to retrieve files in this format.
  - Molecules are stored in the `public/molecules` directory.
- **Scenes**: A scene is a collection of molecules that can be viewed together in the viewer page.
  - **`.wrl` file**: A VRML file format used to represent 3D objects. It is a text file that can be opened in a text editor. This file format can be exported from the [Avogadro](https://avogadro.cc/) molecule editor and visualizer software. Latest versions of Blender can import `.wrl` files, but cannot export them.
  - **`.gltf` file**: A 3D model file format that can be used to represent 3D objects. This file format can be exported from the [Blender](https://blender.org/) 3D modelling and animation software. Latest versions of Blender can export `.gltf` files, but not `.wrl` files.
  - The scenes are located in the `public/scenes` directory.
- **Lessons**: A lesson is a collection of molecules that can be viewed together in the viewer page. A lesson sheet is a PNG file that contains the lesson sheet to be printed.
  - **`.json`**: A JSON file is a text file that contains data in a structured format. It is used to store data in a way that is easy to read and write. It is a common file format used to store data in web applications. It can be opened in a text editor.
    - **`[lesson].json`**: A JSON file that contains information about the position, size and rotation of molecules in a lesson. It is used to store data in a way that is easy to read and write. It is a common file format used to store data in web applications. It can be opened in a text editor. 
  - These files are located in the `public/lessons` directory.

### Technical Inventory
#### Client-side Technologies:
- **[Bootstrap](https://getbootstrap.com/)**: A CSS and JS framework and UI toolkit for styling web applications
- **[jQuery](https://jquery.com/)**: A JavaScript library for manipulating the DOM
  - **[jQuery Datatables](https://datatables.net/manual/)**: A jQuery plugin for displaying, filtering, paginating and searching tabular data
- **[Three.js](https://threejs.org/)**: A JavaScript library for creating 3D graphics in a web browser.
- **[WebXR](https://immersive-web.github.io/)**: A JavaScript API for accessing augmented reality and virtual reality devices, like cameras and motion sensors
- **[AR.jS](https://ar-js-org.github.io/AR.js/)**: AR.js is a lightweight library for Augmented Reality on the Web, coming with features like Image Tracking, Location-based AR and Marker tracking.  Some examples can be found [here](https://stemkoski.github.io/AR.js-examples/index.html).

#### Server-side Technologies:
- **[Node.js](https://nodejs.org/en/)**: A JavaScript runtime engine
  - **[Express](https://expressjs.com/en/guide/using-template-engines.html)**: A web application framework for Node.js
  - **[EJS](https://ejs.co/)**: A templating engine for Node.js

## Setup
### Local Development

Before running the program, make sure you have [Node.js](https://nodejs.org/en/) installed on your computer. You can check if you have Node.js installed by running the following command in your terminal:



## Development
### Back End
##### Node.js
Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser.

##### Express.js
Express has been called the de facto standard server framework for Node.js. Express provides a minimal and flexible set of features for creating web applications and APIs. It provides a set of features like routing, middleware, view system, etc. It simplifies the server creation process that can be used to create a web application more easily and quickly. [Here is a guide to getting started with Express.js](https://expressjs.com/en/starter/installing.html).

##### EJS (Embedded JavaScript) Templating Engine
Templating engines are tools used to generate HTML from data and templates. They allow developers to separate the view (HTML) from the controller (data) and create dynamic HTML pages. Templating engines are used in a variety of web development frameworks and technologies, such as Node.js and Express.js. They allow developers to write HTML code with placeholders for variables, which are then replaced with the actual data when the page is rendered. This makes it easier to maintain and update the HTML code. There are quite a few templating engines available. [Here is a list in the Express.js docs](https://expressjs.com/en/resources/template-engines.html).

EJS (Embedded JavaScript) is a templating engine used by Node.js developers. It is used to generate HTML from data and templates. It more features such as loops, conditionals, and template inheritance. EJS is simple to use and supports the use of JavaScript for more complex operations. It is often used in combination with Node.js and Express.js to create dynamic web pages. [Here is a link to EJS's documentation](https://ejs.co/#docs).

## Deployment
### Local Deployments
#### CORS and HTTPS:
The AR.js library requires that the application is served over HTTPs. This is because the AR.js library uses the WebRTC API, which requires special permissions to be granted by the user. This is why we need to use HTTPS. If you want to develop locally, you can ignore the warnings about the SSL certificate being invalid.
 
If you want to secure the application locally, you will need to generate some unique SSL certificate credentials. For instruction on how to do this (particularly, generating `cert.pem`, `csr.pem` and `key.pem` files), and how to use them with NodeJS, [take a look at this article](https://adamtheautomator.com/https-nodejs/)

When deploying to a cloud service like Azure Websites, HTTPS is enabled by default, which means that you don't need to worry about this.

### Remote Deployment
#### Deploying to Azure Websites:
To deploy to Azure Websites, you will need to create an Azure account. Once you have done this, you can create a new web application. You can do this from the Azure Portal, or from the integrated tools in your IDE. Once you have created the web application, you can deploy the application to it. You can do this from the integrated tools in your IDE, or from the command line. If you want to see a helpful guide on how to do this specifically with express.js, [take a look at this article.](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)

For instructions on using the integrated tools in your IDE, [take a look at this blog post](https://davidgiard.com/deploying-a-web-app-to-azure-from-visual-studio-code)

### Other Options
Besides Azure Websites, there are multiple other options which might suit the needs of the client, however each has their own pricing options and product suite. Some options we also considered were [render.com](https://render.com/) and [Cyclic](https://www.cyclic.sh/), but there are so many it would be worth doing research otherwise.

## Screenshots
## Molecule Catalog (Non-Admin View)
![ChemAR Molecule Catalog](/README_images/chemar_molecules.png)

## Scenes Catalog (Non-Admin View)
![ChemAR Molecule Catalog](/README_images/chemar_scenes.png)

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


## Other:
Biovia CT File Formats:
https://discover.3ds.com/sites/default/files/2020-08/biovia_ctfileformats_2020.pdf

Anatomy of a MOL file:
https://chem.libretexts.org/Courses/University_of_Arkansas_Little_Rock/ChemInformatics_(2017)%3A_Chem_4399_5399/2.2%3A_Chemical_Representations_on_Computer%3A_Part_II/2.2.2%3A_Anatomy_of_a_MOL_file

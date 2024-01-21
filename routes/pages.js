const express = require("express");
const router = express.Router();




// Define the route for the home page
router.get('/', (req, res) => {
    res.sendFile("home.html", { root: './public/pages/' });
});
router.get('/home', (req, res) => {
    res.sendFile("home.html", { root: './public/pages/' });
});

// Define the route for the about page
router.get('/about', (req, res) => {
    res.sendFile("about.html", { root: './public/pages/' });
});

// Define the route for the contact page
router.get('/contact', (req, res) => {
    res.sendFile("contact.html", { root: './public/pages/' });
});

//LOGIN PAGES
//Admin Login Page
router.get('/adminLoginPage', (req, res) => {
    res.sendFile("adminLogin.html", { root: './public/pages/' });
});
//Student Login Page
router.get('/studentLoginPage', (req, res) => {
    res.sendFile("studentLogin.html", { root: './public/pages/' });
});
//Staff Login Page
router.get('/staffLoginPage', (req, res) => {
    res.sendFile("StaffLogin.html", { root: './public/pages/' });
});
//Warden Login Page
router.get('/wardenLoginPage', (req, res) => {
    res.sendFile("wardenLogin.html", { root: './public/pages/' });
});



module.exports = router;

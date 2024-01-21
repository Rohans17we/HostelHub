const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const studentController = require("./controllers/student");
const adminController = require("./controllers/admin");
const wardenController = require("./controllers/warden");
const staffController = require("./controllers/staff");

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

// DB CONNECT
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MYSQL CONNECTED");
    }
});

// ROUTES
//NoticeBoard
function formatDate(date) {
    const formattedDate = new Date(date).toDateString();
    return formattedDate;
}
function trimPublicFromPath(filePath) {
    const directoryToRemove = 'public';
    const trimmedPath = filePath.replace(directoryToRemove, '');
    return trimmedPath.startsWith('/') ? trimmedPath.slice(1) : trimmedPath;
  }
app.use(express.static(path.join(__dirname, 'public')));
app.get('/NoticeBoard', (req, res) => {
    // Fetch notices from the database
    db.query('SELECT * FROM notices ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Error in database query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Render the template with the notices and the formatDate function
        res.render('NoticeBoard', { notices: results, formatDate, trimPublicFromPath });
    });
});

//General Pages
const pagesRouter = require('./routes/pages');
app.use('/', pagesRouter);

//Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminController.adminisLoggedIn, (req, res, next) => {
    if (req.user) {
        adminRoutes(req, res);
    } else {
        res.send("<script>alert('Admin Login Required!');  window.location.href = '/adminLoginPage';</script>");
    }
});
app.use('/adminlogin', adminController.adminlogin, (req, res) => {
    res.render("adminDashboard", {username:req.user.username});
});


//Student Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/student', studentController.studentisLoggedIn, (req, res, next) => {
    if (req.user) {
        studentRoutes(req, res);
    } else {
        res.send("<script>alert('Student Login Required!');  window.location.href = '/studentLoginPage';</script>");
    }
});
app.use('/studentlogin', studentController.studentlogin, (req, res) => {
    res.render("studentDashboard", {username:req.user.enrollment});
});

//Warden Routes
const wardenRoutes = require('./routes/wardenRoutes');
app.use('/warden', wardenController.wardenisLoggedIn, (req, res, next) => {
    if (req.user) {
        wardenRoutes(req, res);
    } else {
        res.send("<script>alert('Warden Login Required!');  window.location.href = '/wardenLoginPage';</script>");
    }
});
app.use('/wardenlogin', wardenController.wardenlogin, (req, res) => {
    res.render("wardenDashboard", {username:req.user.username});
});

//Staff Routes
const staffRoutes = require('./routes/staffRoutes');
app.use('/staff', staffController.staffisLoggedIn, (req, res, next) => {
    if (req.user) {
        staffRoutes(req, res);
    } else {
        res.send("<script>alert('Staff Login Required!');  window.location.href = '/staffLoginPage';</script>");
    }
});
app.use('/stafflogin', staffController.stafflogin, (req, res) => {
    res.render("staffDashboard", {username:req.user.username});
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars')
var PORT = process.env.PORT || 3306;
//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
require('./routes/htmlroutes')(app);



app.get('/', function (req, res) {
    res.render();
});

//Models
var models = require("./models/index.js");

//Routes
var authRoute = require('./routes/auth.js')(app, passport);



//load passport strategies
require('./config/passport/passport.js')(passport, models.User);

//Sync Database
models.sequelize.sync({force: true}).then(function () {
    console.log('Nice! Database looks fine')

}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!")
});

app.use(express.static('public'));
app.use(express.static('controllers'));

// app.listen(PORT, () => {
//     console.log(`App listening on PORT ${PORT}`);
// });





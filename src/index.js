const express = require('express');
const app = express();
const googleApiUtil = require('./google-api-util')
const session = require('express-session');
const googleAPIController = require('./controllers/google-calendar-api.controller');
const googlePeopleApiController = require('./controllers/google-people-api.controller');
const PORT = 3400;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));// To parse the incoming requests with JSON payloads
app.use(express.json())
app.use(session({
    secret: "NoSecretForSession",
    resave: true,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    var url = googleApiUtil.getUrl();
    res.render("login", { url: url });
});

// OAuthcallback
app.get("/redirect", function(req, res) {

    var session = req.session;
    //authorization code
    var code = req.query.code;
    
    //direct authorization code and session credentails to OAuth Server
    googleApiUtil.client.getToken(code, function(err, tokens, body) {
        session.tokens = tokens; //receive Auth Token
        console.log(tokens);
        googleApiUtil.client.setCredentials(tokens);
    });
    res.render("event");
})


// Adding an event to google calender 
app.post("/addEvent", function(req, res){
    googleAPIController.createCalenderEvent(req, res)
});

//get events of google calendar instance
app.get('/getevents', function(req, res){
    googleAPIController.getAllCalenderEvents(req,res)
});

// Adding an contact to google contact list 
app.post("/addContact", function(req, res){
    googlePeopleApiController.createGoogleContact(req, res)
});

//get contacts of logged in user
app.get('/getContacts', function(req, res){
    googlePeopleApiController.getGoogleContact(res)
});

app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
});
const express = require('express');
const app = express();
const googleApiUtil = require('./google-api-util')
const session = require('express-session');
const googleAPIController = require('./controllers/google-api.controller');

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
    //res.status(200).json({ url: url });
    res.render("login", { url: url });
});

// OAuthcallback
app.get("/redirect", function(req, res) {

    var session = req.session;
    var code = req.query.code;
    
    googleApiUtil.client.getToken(code, function(err, tokens, body) {
        session.tokens = tokens;
        console.log(tokens);
        googleApiUtil.client.setCredentials(tokens);
    });
    res.render("event");
})


// Adding an event to google calender 
app.post("/addEvent", function(req, res){
    googleAPIController.createCalenderEvent(req, res)
});
app.get('/getevents', function(req, res){
    googleAPIController.getAllCalenderEvents(req,res)
});



app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
});

const express = require('express');
const app = express();
const {google} = require('googleapis')
const googleApiUtil = require('./google-api-util')
const session = require('express-session');
const PORT = 3400;
app.set("view engine", "ejs");

// To parse the incoming requests with JSON payloads
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(session({
    secret: "NoSecretForSession",
    resave: true,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    console.log("get request")
    var url = googleApiUtil.getUrl();
    //res.status(200).json({ url: url });
    res.render("event", { url: url });
});


app.get('/getevents', function(req, res) {
    const calendar = google.calendar({ version: 'v3', auth: client });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, response) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = response.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
        return res.json({ result: events });
    });
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
app.post("/addEvent", function(req, res) {

    var body_data = JSON.stringify(req.body);
    var objectVal = JSON.parse(body_data);
    var summary = objectVal.summary;
    var location = objectVal.location;
    var description = objectVal.description;
    var startTime = new Date(objectVal.start);
    var endTime = new Date(objectVal.end);

    const calendar = google.calendar({ version: 'v3', auth: googleApiUtil.client });

    var event = {
        summary: summary,
        location: location,
        description: description,
        start: {
            dateTime: startTime
        },
        end: {
            dateTime: endTime
        }
    };

    calendar.events.insert({
            auth: googleApiUtil.client,
            calendarId: 'primary',
            resource: event
        },

        function(err, event) {
            var result;
            var url = "no";
            if (err) {
                console.log('An error occured while connecting too the calender API');
                result = false

            } else {
                console.log('Event created  successfully: %s', event.data.htmlLink);
                result = true
                url = event.data.htmlLink;
            }
            return res.json({ result: result, url: url });
        }
    );
})


app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
});

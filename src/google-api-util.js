const {google} = require('googleapis')

//Registered client id
const CLIENT_ID = '971463985476-ao11dct9ga9567mvb945m6jcdb4hpqaf.apps.googleusercontent.com'
//client secret
const CLIENT_SECRET = '0xHUKpuzaQts3V5hyfOvB-qS'
//OAuth 2.0 Server redirect url
const REDIRECT_URL = 'http://localhost:3400/redirect'
  
//return google auth object
function createConnectionToAPI() {
    return new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URL
    );
  }
 
//permissions
const scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
];

//google auth object
const oauth2Client = createConnectionToAPI()

//generate authorization request url
const authRequestUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope: scopes
  });

exports.client = oauth2Client
exports.getUrl = function(){
    return authRequestUrl;
}  



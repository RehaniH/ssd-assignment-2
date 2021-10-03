const {google} = require('googleapis')

const CLIENT_ID = '971463985476-eq1s0pe0g74a7k6a2rf9nojhguctonl5.apps.googleusercontent.com'
const CLIENT_SECRET = 'ac6LJoVRE5yNlVUjLrvzbwsx'
const REDIRECT_URL = 'http://localhost:3400/redirect'
  
/**
 * Create the google auth object.
 */
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
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
];

const oauth2Client = createConnectionToAPI()
const URL_TO_GOOGLE = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope: scopes
  });

exports.client = oauth2Client
exports.getUrl = function(){
    return URL_TO_GOOGLE;
}  



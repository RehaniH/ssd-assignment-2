const googleApiUtil = require('../google-api-util') 
const {google} = require('googleapis')


exports.createGoogleContact = function(req, res){

}

exports.getGoogleContact = function(req, res){

    const contacts = google.people({version: 'v1', auth: googleApiUtil.client});
    contacts.people.connections.list({
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
    }, (err, res) => {
        if (err) return res.json({ error_msg: 'Unexpected Error' , error_stat: 1});

        const connections = res.data.connections;
        if (connections) {
            contactList = []
            connections.forEach((person) => {
                if (person.names && person.emailAddresses) {
                    contactList.push({
                        displayName: person.names[0].displayName,
                        email: person.emailAddresses[0].value
                    })
                }
            })

            return res.json({ result: contactList});
        } else {
            console.log('No connections found.');
        }
    });
}
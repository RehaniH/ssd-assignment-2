const googleApiUtil = require('../google-api-util')
const {google} = require('googleapis')


exports.createGoogleContact = function(req, res){

}

exports.getGoogleContact = function(res){

    const contacts = google.people({version: 'v1', auth: googleApiUtil.client});
    contacts.people.connections.list({
        resourceName: 'people/me',
        pageSize: 10,
        personFields: 'names,emailAddresses',
    }, (err, resp) => {
        if (err) return res.json({error_stat:1, error_msg: 'insufficient permission'});
        const connections = resp.data.connections;
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
            console.log(contactList)
        } else {
            console.log('No connections found.');
        }
        return res.json({ result: contactList, error_stat: 0 });
    });
}
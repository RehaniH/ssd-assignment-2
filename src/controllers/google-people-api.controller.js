const googleApiUtil = require('../google-api-util')
const {google} = require('googleapis')


exports.createGoogleContact = function(req, res){

    var body_data = JSON.stringify(req.body);
    var objectVal = JSON.parse(body_data);
    
    var email = {
        "value": objectVal.email,
        "type": objectVal.type,
        "displayName": objectVal.name
    }
    var name = {
        "displayName": objectVal.name,
        "familyName": objectVal.familyName,
        "givenName": objectVal.givenName,
    }
    
    var emailAddresses = []
    var names = []

    emailAddresses.push(email)
    names.push(name)
    const contacts = google.people({version: 'v1', auth: googleApiUtil.client});
    contacts.people.createContact({
        personFields: 'names,emailAddresses',
        requestBody: {
            "emailAddresses": emailAddresses,
            "names": names
        }

    },

    function(err, resp) {

        if (err) {
            return res.json({error_stat:1, error_msg: 'insufficient permission'});
        } else {
            const emailContacts = resp.data.emailAddresses
            var contactList = []

            if(emailContacts.length){
                emailContacts.map((contact, i)=> {
                    contactList.push({
                        "email": contact.value,
                        "name": contact.displayName,
                        "contactType": contact.type
                    });
                });
            }    
        }
        return res.json({ result: contactList, error_stat: 0 });
    });
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
        } else {
            console.log('No connections found.');
        }
        return res.json({ result: contactList, error_stat: 0 });
    });
}
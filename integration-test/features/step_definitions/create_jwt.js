const fs = require('fs');
const jwt = require('jsonwebtoken');

const create_jwt = async (org_id) => {


    // const cert = fs.readFileSync('./key.pem');
    const cert = process.env.KEY_PEM;

    const payload = {
        iat: 1712578722,
        aud: "api.platform.pagopa.it",
        iss: "https://api.dev.platform.pagopa.it",
        uid: "5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8",
        name: "Anselmo",
        family_name: "Sartori",
        email: "furiovitale@martino.it",
        org_id: org_id,
        org_vat: "00264560608",
        org_party_role: "MANAGER",
        org_role: "admin"
    };

    const signOptions = {
        algorithm: 'RS256',
        expiresIn: '1h'
    };

    jwt.sign(payload, cert, signOptions, (err, token) => {
        if (err) {
            console.error('Erro during the creation of the token:', err);
            throw err;
        } else {
            return token;
        }
    });

}
module.exports = {create_jwt};

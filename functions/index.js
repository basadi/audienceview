const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Instagram OAuth 2 setup
exports.authInstaUser = functions.https.onRequest((req, res) => {
    
    const credentials = {
        client: {
          id: 'a8c26beb002140439dacf3bb0ff15e2f', // Change this!
          secret: 'a49354553a444e348a0aef0b4032874e', // Change this!
        },
        auth: {
            tokenHost: 'https://api.instagram.com',
            tokenPath: '/oauth/authorize'
        }
    };

    const oauth2 = require('simple-oauth2').create(credentials);

    //var redirect_uri = `${req.protocol}://${req.get('host')}/instagram-callback`;
    //res.send(redirect_uri);
    
    // Generate a random state verification cookie.
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    // Allow unsecure cookies on localhost.
    const secureCookie = req.get('host').indexOf('localhost:') !== 0;
    res.send(secureCookie);
    res.cookie('state', state.toString(), {maxAge: 3600000, secure: secureCookie, httpOnly: true});

    
    // Authoirzation URI
    const redirectUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: `${req.protocol}://${req.get('host')}/instagram-callback`,
        scope: 'basic+public_content',
        state: state
    });

        
        res.redirect(redirectUri);
});
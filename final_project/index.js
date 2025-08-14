const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session management for the /customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Set up authentication middleware for all routes starting with /customer/auth/
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user's session contains authorization information
    if (req.session.authorization) {
        // Retrieve the access token from the session
        let token = req.session.authorization['accessToken'];
        
        // Verify the JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // If the token is valid, attach the user's details to the request object
                req.user = user;
                // Proceed to the next middleware or route handler
                next();
            } else {
                // If token verification fails, send an authentication error response
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // If there is no authorization info in the session, the user is not logged in
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

// Define the routes for authenticated users
app.use("/customer", customer_routes);
// Define the routes for general users
app.use("/", genl_routes);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log("Server is running on port " + PORT));

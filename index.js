const express = require('express');
const app = express();
const promise = require('bluebird');
const bcrypt = require('bcrypt');
const session = require('express-session');

// for bcrypt hashing
const saltRounds = 10;

const portNumber = process.env.PORT || 3000;

// pg-promise initialization options:
const initOptions = {
    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,
};


// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'ticketapp',
    user: 'filmonkesete'
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

// Session manager
app.use(session({
    secret: process.env.SECRET_KEY || 'cantbemorelost',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));


app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// landing page will be referenced in this directory
app.use(express.static(__dirname + '/public'));


// ---------------- Beginning of Routes ---------------- //

// Routes to read and write events to database
// get all items from events table
app.get('/api/all', authenticatedMiddleware, (req, res) => {
    db.query('SELECT * FROM events')
        .then((results) => {
            console.log(results);
            res.json(results);
        })
})


// add item to events database
app.post('/api/addevents', (req, res) => {
    db.query(`INSERT INTO events (event_name, event_date, event_venue, city, state, event_time)
            VALUES('${req.body.event_name}', '${req.body.eventDate}', '${req.body.eventVenue}', '${req.body.city}', '${req.body.state}', '${req.body.eventTime}')`)
})



// add item to wishlist
app.post('/api/addwish', (req, res) => {
    db.query(`INSERT INTO wishlist (profile_id, event_id)
            VALUES('${req.body.profile_id}', '${req.body.event_id}')`)
})


// get wishlist items and return json
app.get('/api/getwish', (req, res) => {
    db.query(`SELECT profile.user_name, events.event_name, events.event_date
            FROM profile
            JOIN wishlist on profile.id = wishlist.profile_id
            JOIN events on events.id = wishlist.event_id`)
        .then((response) => {
            res.json(response)
        });
})



// ---------------- Routes for Authentication ---------------- //

// check if user is already authenticated and has a session
app.get('/checkuser', authenticatedMiddleware, (req, res) => {
    res.send("yah, you good to go");
})


// register a user
app.post('/register', (req, res) => {
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
    } else {
        let email = req.body.email;
        let password = req.body.password;

        bcrypt.hash(password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            passHash = hash;
            //for postman testing....can delete
            // res.json({
            //     status: "User successfuly registered",
            //     "hash": passHash
            // })

            db.query(`INSERT INTO profile ("email", "account_password") VALUES('${email}', '${passHash}')`)
            //for postman testing...can delete
            // .then((results) => {
            //     res.json(results);
            //     console.log(results);
            // })
        });

    }

})

// login for user
app.post('/login', (req, res) => {
    //console.log(req);
    if (!req.body.email) {
        res.status(404).send("Email is required");
    }
    if (!req.body.password) {
        res.status(404).send("Password is required");
    }

    db.query(`SELECT * FROM profile WHERE email = '${req.body.email}'`)
        .then((results) => {
            // json for postman test
            //res.json(results);
            //console.log(results);

            bcrypt.compare(req.body.password, results[0].account_password, function (err, result) {
                //console.log(req.body.password, results.account_password);
                //res.send("Yay..logged in");
                //console.log(results);
                //console.log(`the results...${results[0].account_password}`);
                if (result === true) {
                    // assign results from db.query above to a session
                    req.session.user = results;
                    
                    console.log(req.session.user)
                    res.send(req.session.user);
                    //res.redirect('/path to logged in page') *********** redirects
                } else {
                    res.send("Please enter valid crededitals");
                    //res.redirect('/') ************ redirects
                }
            })
        })
})

// route to log user out


// ---------------- Functions ---------------- //

// Middleware to check if user has session
function authenticatedMiddleware(req, res, next) {
    // if user is authenticated let request pass
    if (req.session.user) {
        next();
    } else { // user is not authenticated send them to login
        console.log('user not authenticated');
        //res.redirect('/login');
    }
}


// ---------------- End of Routes ---------------- //

app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});
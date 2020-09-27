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
    host: 'ec2-54-211-169-227.compute-1.amazonaws.com',
    port: 5432,
    database: 'd339h64cgck3tj',
    user: 'ebtpsuehyjnjuv',
    password: 'b0f634fafa8c6a315a85ee46487b70da1512ad65203cd8cadd0f78ba131ce3e6'
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
        maxAge: 360000
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
    db.query(`INSERT INTO events (event_name, seller_id, event_date, event_venue, city, state, event_time, event_image, price)
            VALUES('${req.body.event_name}', '${req.body.seller_id}', '${req.body.event_date}', '${req.body.event_venue}', '${req.body.city}', '${req.body.state}', '${req.body.event_time}', '${req.body.event_image}', '${req.body.price}')`)
})


//add item to wishlist
app.post('/api/addwish', authenticatedMiddleware, (req, res) => {
    db.query(`INSERT INTO wishlist (profile_id, event_id)
                SELECT '${req.session.user[0].id}', '${req.body.event_id}'
                FROM events
                LIMIT 1`)
})

// get event details that are randomly posted from home page
app.get('/api/addevents', (req, res) => {
    db.query(`SELECT events.id, events.seller_id, events.event_name, events.event_date, events.event_venue, events.city, events.state, events.event_time, events.event_image, events.price
            FROM events`)
        .then((response) => {
            res.json(response)
        });
})

// get wishlist items and return json
app.get('/api/getwish', authenticatedMiddleware, (req, res) => {
    db.query(`SELECT events.event_name, events.event_date, events.event_venue, events.city, events.state, events.event_time, events.event_image
                FROM events
                JOIN wishlist on events.id = wishlist.event_id
                JOIN profile on wishlist.profile_id = profile.id`)
        .then((response) => {
            res.json(response)
        })
        .catch((error) => {
            res.send(error);
        })
})

// get user's events for sale
app.get('/api/myitems', authenticatedMiddleware, (req, res) => {
    console.log(req.session);
    db.query(`SELECT * FROM events
              WHERE seller_id = ${req.session.user[0].id}`)
        .then((results) => {
            //console.log(results); 
            res.json(results);  
        })
        .catch((err) => {
            console.log(err);
        })
})


// ---------------- Routes for Authentication ---------------- //

// check if user is already authenticated and has a session
app.get('/api/checkuser', authenticatedMiddleware, (req, res) => {
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

            db.query(`INSERT INTO profile ("account_password", "email") VALUES('${passHash}', '${email}')`)
               console.log("You've been registered...");
               //send redirect to main index page
               res.send('Ok');
           
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
                    
                    console.log(req.session.user);
                    //return res.json(req.session.user);
                    res.send('Ok');
                } else {
                    res.send("Invalid Credentials");
                }
            })
        })
        .catch((err) => {
            console.log(`Error while logging in...${err}`);
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
        console.log('Middleware check...user not authenticated');
        //res.redirect('/login');
    }
}



// ---------------- End of Routes ---------------- //

app.listen(portNumber, function () {
    console.log(`My API is listening on port ${portNumber}.... `);
});
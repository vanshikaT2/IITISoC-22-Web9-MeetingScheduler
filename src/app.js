const express = require("express");    //importing express
const path = require("path");    //importing path
const ejs = require("ejs");             //importing hbs
const mongoose = require("mongoose");             //importing hbs
const bodyParser = require("body-parser");             //importing hbs
const cookieParser = require('cookie-parser');
const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth20');
mongoose.Promise = global.Promise;
//const authroutes = require(__dirname, "../routes/auth-routes")


//google auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '592188886867-mqravv7ttd1gtcqn6pb25nlpfg1i63c8.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

require("./db/conn");

const User = require("./models/usermessage");
const Account = require("./models/account");
const app = express();                  //express ke sare properties app me chale gaye
const port = process.env.port || 2000   //creating port

//setting the path

const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");
const aditi = path.join(__dirname, "../routes");

app.set("view engine", "ejs");         //setting view engine
app.set("views", templatepath);

//ejs.registerPartials(partialpath);

//middleware

app.use('/css', express.static(path.join(__dirname, "../nodemodules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../nodemodules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../nodemodules/jquery/dist")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
passport.use(
    new GoogleStratergy({

        callbackURL: "/auth/google/dashboard",
        clientID: '592188886867-q094fbee2nv801dr2gbushujqt7aclf5.apps.googleusercontent.com',

        clientSecret: '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'
    }, (accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired');
        console.log(profile);
        const newAccount = new Account({
            name: profile.name,
            email: profile.email
        }).save().then((newUser) => {
            console.log('new user created' + newUser);
        })

    })
)

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
//express.static.mime.define({ 'text/css': ['month'] });
////
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


//HOME PAGE

app.get("/", (req, res) => {          //home page pe jo bhi request ayegi vo yaha get hogi and response me index.hbs ka page render ho ke milega..same can be done for any page

    var ourdate = new Date();
    var currentday = ourdate.getMonth() + 1;

    User.find({}, function (err, value) {
        res.render("index", { createEvent: value });

    });

})

//HOME PAGE ENDS

//DAY PAGE
var ourdate = new Date();
app.get("/day", (req, res) => {          //home page pe jo bhi request ayegi vo yaha get hogi and response me index.hbs ka page render ho ke milega..same can be done for any page


    var currentday = ourdate.getMonth() + 1;
    var todaydate = ourdate.getMonth();
    var month = months[todaydate];
    // kindofday: ourdate.getDate() + " " + month + " " + ourdate.getFullYear(),
    User.find({}, function (err, value) {
        res.render("day", { createEvent: value });
    });


})

//DAY PAGE ENDS

//MONTH PAGE STARTS

app.get("/month", (req, res) => {


    // res.render("month");

    User.find({}, function (err, value) {
        res.render("month", { createEvent: value });
        //console.log("heyyy", value);
    });

})
var date = ourdate.getDate();
console.log(date);

//MONTH ENDS

//week PAGE STARTS

app.get("/week", (req, res) => {


    User.find({}, function (err, value) {
        res.render("week", { createEvent: value });
        //console.log("heyyy", value);
    });

})

app.get('/login', (req, res) => {

    // const name = req.body.name;
    // const email = req.body.email;
    // const Account = new Account({
    //     name: name,
    //     email: email
    // })
    // Account.save();
    // console.log(res.body.name);
    res.render('login');
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
    let user = req.user;

    User.find({}, function (err, value) {
        res.render("dashboard", { user });
        //console.log("heyyy", value);
    });


    // console.log(req.user.name);

    // res.render('dashboard', { user });


})
app.get('/protectedroute', checkAuthenticated, (req, res) => {

    res.render('protectedroute');
})
app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
})



//week ENDS

app.post("/day", async (req, res) => {
    try {

        const eventname = req.body.eventname;
        const event_type = req.body.event_type;
        const calanderdate1 = req.body.calanderdate1;
        const calanderdate2 = req.body.calanderdate2;
        const time1 = req.body.time1;
        const time2 = req.body.time2;
        const description = req.body.description;

        const finaluser = new User({
            eventname: eventname,
            event_type: event_type,
            calanderdate1: calanderdate1,
            calanderdate2: calanderdate2,
            time1: time1,
            time2: time2,
            description: description
        });
        await finaluser.save();
        //var eventdate = finaluser[2].calanderdate1;

        res.redirect("/day");
        //res.redirect("/month");


        // const userdata = new User(req.body);
        // await userdata.save();
        // res.status(201).render("day");

    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/day/:eventdate", (req, res) => {


    res.render("protectedroute")

})

app.post('/login', (req, res) => {
    let token = req.body.token;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
    }
    verify().then(() => {
        res.cookie('session-token', token);
        res.send('success')
    }).catch(
        console.error
    );


})
function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })
}

app.post("/dashboard", async (req, res) => {
    try {

        const name = req.body.name;
        const email = req.body.email;
        const newAccount = new Account({
            name: name,
            email: email
        })
        await newAccount.save();
        res.redirect("/dashboard")

    } catch (error) {
        res.status(500).send(error);
    }
})



//creating server
app.listen(port, () => {

    console.log(`server is running at port ${port}`);
})



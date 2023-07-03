var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('../lib').Strategy
  , app      = express();

var cors = require('cors');

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', 'email'];

passport.use(new Strategy({
    domain: 'https://dev.forgehub.com/api',
    clientID: '1234',
    clientSecret: '2345',
    callbackURL: 'http://localhost:5000/callback',
    authorizationURL: 'http://localhost:3031/oauth2/authorize',
    scope: scopes,
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(cors());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', passport.authenticate('forgehub', { scope: scopes }), function(req, res) {});
app.get('/callback',
    passport.authenticate('forgehub', { failureRedirect: '/' }), function(req, res) { res.redirect('/info') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

app.listen(5000, function (err) {
    if (err) return console.log(err)
    console.log('Listening at http://localhost:5000/')
})

# passport-forgehub

Passport strategy for authentication with [Forgehub](http://forgehub.com) through the OAuth 2.0 API.

## Usage
`npm install passport-forgehub --save`

#### Configure Strategy
The Forgehub authentication strategy authenticates users via a Forgehub user account and OAuth 2.0 token(s). A Forgehub API client ID, secret and redirect URL must be supplied when using this strategy. The strategy also requires a `verify` callback, which receives the access token and an optional refresh token, as well as a `profile` which contains the authenticated Forgehub user's profile. The `verify` callback must also call `cb` providing a user to complete the authentication.

```javascript
var ForgehubStrategy = require('passport-forgehub').Strategy;

passport.use(new ForgehubStrategy({
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'callbackURL',
    scope: ['identify', 'email'],
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ forgehubId: profile.id }, function(err, user) {
        return cb(err, user);
    });
}));
```

#### Authentication Requests
Use `passport.authenticate()`, and specify the `'forgehub'` strategy to authenticate requests.

For example, as a route middleware in an Express app:

```javascript
app.get('/auth/forgehub', passport.authenticate('forgehub'));
app.get('/auth/forgehub/callback', passport.authenticate('forgehub', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/secretstuff') // Successful auth
});
```

#### Refresh Token Usage
In some use cases where the profile may be fetched more than once or you want to keep the user authenticated, refresh tokens may wish to be used. A package such as `passport-oauth2-refresh` can assist in doing this.

Example:

`npm install passport-oauth2-refresh --save`

```javascript
var ForgehubStrategy = require('passport-forgehub').Strategy
  , refresh = require('passport-oauth2-refresh');

var forgehubStrat = new ForgehubStrategy({
    clientID: 'id',
    clientSecret: 'secret',
    callbackURL: 'callbackURL'
},
function(accessToken, refreshToken, profile, cb) {
    profile.refreshToken = refreshToken; // store this for later refreshes
    User.findOrCreate({ forgehubId: profile.id }, function(err, user) {
        if (err)
            return done(err);

        return cb(err, user);
    });
});

passport.use(forgehubStrat);
refresh.use(forgehubStrat);
```

... then if we require refreshing when fetching an update or something ...

```javascript
refresh.requestNewAccessToken('forgehub', profile.refreshToken, function(err, accessToken, refreshToken) {
    if (err)
        throw; // boys, we have an error here.
    
    profile.accessToken = accessToken; // store this new one for our new requests!
});
```


## Examples
An Express server example can be found in the `/example` directory. Be sure to `npm install` in that directory to get the dependencies.

## License
Licensed under the ISC license. The full license text can be found in the root of the project repository.

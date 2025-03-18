const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimiter = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

app.use(compression({
    level: 5,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} - ${res.statusCode}`);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, headers: true }));

// Main landing page with buttons
app.all('/player/login/dashboard', function (req, res) {
    res.render('landing');
});

// Login dashboard page
app.all('/player/login/login_dashboard', function (req, res) {
    res.render('dashboard', { title: 'GTPS Account' });
});

// Register redirect with predefined token
app.all('/player/register', function(req, res) {
    res.redirect('/player/growid/login/validate?token=X3Rva2VuPSZncm93SWQ9JnBhc3N3b3JkPQ==');
});

app.all('/player/growid/login/validate', (req, res) => {
    console.log("Request Body (Server):", req.body);
    const _token = req.body._token;
    const growId = req.body.growId;
    const password = req.body.password;

    const token = Buffer.from(
        `_token=${_token}&growId=${growId}&password=${password}`,
    ).toString('base64');
   
    res.send(
        `{"status":"success","message":"Account Validated.","token":"${token}","url":"","accountType":"growtopia", "accountAge": 2}`,
    );
});

app.all('/player/growid/checktoken', (req, res) => { /*
    const { refreshToken } = req.body;
    try {
    const decoded = Buffer.from(refreshToken, 'base64').toString('utf-8');
    if (typeof decoded !== 'string' && !decoded.startsWith('growId=') && !decoded.includes('passwords=')) return res.render(__dirname + '/public/html/dashboard.ejs');
    res.json({
        status: 'success',
        message: 'Account Validated.',
        token: refreshToken,
        url: '',
        accountType: 'growtopia',
        accountAge: 2
    });
    } catch (error) {
        console.log("Redirecting to player login dashboard");
        res.render(__dirname + '/public/html/dashboard.ejs');
    }
    */
    const encodedToken = req.body._token;

    // Dekripsi token jika diperlukan
    // const decodedToken = Buffer.from(encodedToken, 'base64').toString('utf-8');
    // console.log('Decoded Token:', decodedToken);

    res.json({
        status: 'success',
        message: 'Account Validated.',
        token: encodedToken,
        url: '',
        accountType: 'growtopia',
        accountAge: 2
    });
});

app.get('/', function (req, res) {
    res.redirect('/player/login/dashboard');
});

app.listen(5000, function () {
    console.log('Listening on port 5000');
});

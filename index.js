const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

function middlewareToAddHelloWorldText(req, res, next) {
    res.customData = 'This is added using middleware\n';
    next();
}

function authenticate(req, res, next) {
    // Write code for athentication
    // by checking token on req Object
    // Writing code for failed authentication
    res.statusCode = 401;
    res.write('Authentication Failed\n');
    res.end();
}

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.post('/', (req, res) => {
//     res.send('Got a POST request');
// });

// app.get('/users', (req, res) => {
//     res.send('Hello users');
// });
app.use('/users', authenticate, middlewareToAddHelloWorldText,  userRoutes);

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
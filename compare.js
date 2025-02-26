const http = require('http');
// const fs = require('fs');

const validHTMLPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to my page.</p>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    if(req.url === '/') {
        // if(req.method === 'GET') {
        //     res.write('Hello world');
        //     res.end();
        // }
        // else if(req.method == 'POST') {
        //     res.write('Hello World POST');
        //     res.end();
        // }
        // else {
        //     res.write('Method not allowed.');
        //     res.end();
        // }
        res.writeHead(200, {'content-type': 'text/html'});
        res.write(validHTMLPage);
        res.end();
    }
    else if(req.url === '/home') {
        res.write("Welcome to home page!");
        res.end();
    }
    else if(req.url === '/about') {
        res.write("Welcome to about page!");
        res.end();
    }
    else {
        res.write('Page not found');
        res.end();
    }
});

server.listen(3030, () => {
    console.log("Server is listening on port 3030");
});
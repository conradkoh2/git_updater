let setup = require('./setup');
let Express = require('express');
let app = Express();
let router = require('./router');
let config = require('./config');
let bodyParser = require('body-parser');

//Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(router);
app.listen(config.port, function () {
    console.log(`Server started on port ${config.port}`);
})
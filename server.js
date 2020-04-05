//express server
var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
app.use(express.static(__dirname + '/public'));
app.use(router);
app.route('/');


//port to listen on
app.listen(3000, function () {
    console.log('app listening on port 3000!');
});

//root html file

app.get('/', function (req, res) {
    res.sendFile('root');
});






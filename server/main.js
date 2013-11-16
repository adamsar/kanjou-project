/*jslint node: true */
'use strict';
var mongoose = require("mongoose"),
    config = require("../config");
mongoose.connect('mongodb://localhost/tweets');
require('./models/tweet');
var express = require('express'),
    routes = require('./routes/geo_data'),
    app = express();

app.use(express.bodyParser());
app.get('/data/:latlon', routes.geo.all);

app.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

module.exports = app;

'use strict';

var config = require('../config');
var express = require('express');
var router = express.Router();

router.route('/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.scorersData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            res.render('scorers/scorers', { data: obj });
        });
    });

module.exports = router;
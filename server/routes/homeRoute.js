'use strict';

var items = require('../data/items');
var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

var data = {
    title: 'Football Peek - The quickest access to football results',
    description: 'Access football results, tables, top scorers and top assists from the major leagues and competitions',
    items: items
};

router.route('/').get((req, res) => {
    res.render(
        'pages/home',
        Object.assign(data, {
            competitionsMatches: getItemsMatches(items.filter(p => p.isCompetition), 14),
            leaguesMatches: getItemsMatches(items.filter(p => !p.isCompetition), 4)
        })
    );
});

function getItemsMatches(filteredItems, limitDate) {
    var dates = getHandledDates(limitDate);
    var itemsMatches = [];

    filteredItems.forEach(item => {
        var matches = item.isCompetition ? getCompetitionMatches(item, dates) : getLeagueMatches(item, dates);

        if (matches.length) {
            itemsMatches.push({ item, matches });
        }
    });

    return itemsMatches;
}

function getLeagueMatches(item, handledDates) {
    var resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.periods.current));
    var matches = [];

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date) !== -1) {
                matches.push(matche);
            }
        });
    });

    return matches;
}

function getCompetitionMatches(item, handledDates) {
    var tournamentData = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, item.code, config.periods.current));
    var tournamentMatches = [];

    for (let i = tournamentData.length - 1; i >= 0; i--) {
        var tournamentMatches1 = [];
        var tournamentMatches2 = [];
        const round = tournamentData[i];

        round.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date1) !== -1) {
                tournamentMatches1.push({
                    date: matche.date1,
                    hour: matche.hour1,
                    score: matche.score1,
                    homeTeam: matche.team1,
                    awayTeam: matche.team2,
                    homeTeamLogo: matche.team1Logo,
                    awayTeamLogo: matche.team2Logo
                });
            }

            if (handledDates.indexOf(matche.date2) !== -1 && matche.score2.indexOf(':') != -1) {
                var reversedScore = matche.score2.split(':')[1] + ':' + matche.score2.split(':')[0];
                tournamentMatches2.push({
                    date: matche.date2,
                    hour: matche.hour2,
                    score: reversedScore,
                    homeTeam: matche.team2,
                    awayTeam: matche.team1,
                    homeTeamLogo: matche.team2Logo,
                    awayTeamLogo: matche.team1Logo
                });
            }
        });

        tournamentMatches = tournamentMatches.concat(tournamentMatches1, tournamentMatches2);
    }

    if (tournamentMatches.length) {
        return tournamentMatches;
    }

    var groupsData = helper.readJsonFile(helper.stringFormat(config.paths.groupsData, item.code, config.periods.current));
    var groupMatches = [];

    groupsData.forEach(group => {
        group.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date) !== -1) {
                groupMatches.push(matche);
            }
        });
    });

    return groupMatches;
}

function getHandledDates(limitDate) {
    var currentDate = new Date();
    var dates = [];

    for (var i = limitDate; i >= 1; i--) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() - i))));
    }

    dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate()))));

    for (var j = 1; j <= limitDate; j++) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() + j))));
    }

    return dates;
}

function getFormattedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return dd + '/' + mm + '/' + yyyy;
}

module.exports = router;
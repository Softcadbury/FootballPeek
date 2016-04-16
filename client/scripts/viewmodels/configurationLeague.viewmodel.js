'use strict';

var gridHelper = require('../helpers/grid.helper');

// View model used to configure components of a specified league
function ConfigurationLeagueViewModel(league) {
    var displayTable = ko.observable(false);
    displayTable.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/tables/', '#table-', 4, 4); });

    var displayTableMini = ko.observable(false);
    displayTableMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/tables/mini/', '#table-mini-', 2, 2); });

    var displayScorers = ko.observable(false);
    displayScorers.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/scorers/', '#scorers-', 3, 4); });

    var displayScorersMini = ko.observable(false);
    displayScorersMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/scorers/mini/', '#scorers-mini-', 2, 2); });

    var displayAssists = ko.observable(false);
    displayAssists.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/assists/', '#assists-', 3, 4); });

    var displayAssistsMini = ko.observable(false);
    displayAssistsMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/assists/mini/', '#assists-mini-', 2, 2); });

    var displayResults = ko.observable(false);
    displayResults.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/results/', '#results-', 3, 3); });

    // Manage the new value of the display property
    function manageNewDisplayValue(newValue, url, id, sizeX, sizeY) {
        if (newValue) {            
            $.ajax({
                type: 'GET',
                url: (url + league.code),
                success: gridHelper.addComponent
            });
        } else {
            gridHelper.removeComponent(id + league.code);
        }
    }

    return {
        league: league,
        displayTable: displayTable,
        displayTableMini: displayTableMini,
        displayScorers: displayScorers,
        displayScorersMini: displayScorersMini,
        displayAssists: displayAssists,
        displayAssistsMini: displayAssistsMini,
        displayResults: displayResults
    };
}

module.exports = ConfigurationLeagueViewModel;
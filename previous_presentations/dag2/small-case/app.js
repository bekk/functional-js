var Bacon = require('baconjs');
var $ = require('jquery');
var _ = require('lodash');

var api = require('./api.js');

/*
  HELPER FUNCTIONS

  See their respective comments for clarifications
*/

//Takes a record and produces a html string
var renderRecord = function (record) {
  return '<li>' +
    '<h3>' + record.album + '</h3>' +
    '<p> Artist: ' + record.artist + '</p>' +
    '<p>Year: ' + record.year + '</p>' +
    '<p>Genre: ' + record.genre + '</p>' +
  '</li>';
};

//Takes a recor collection and produces a html string
var renderRecords = function(records) {
  return _.reduce(records, function(acc, record) {
    return acc + renderRecord(record);
  }, '');
};

//Takes a regex pattern as a string and returns a function that tests a value
var testRegex = function(pattern) {
  return function(value) {
    if(!value) return false;
    return new RegExp(pattern, 'i').test(value);
  };
};

//Takes a record collection and a filter
//Returns a filtered collection with regex matching on all fields of all records
var filterRecords = function(records, recordFilter) {
  return _.filter(records, function(record) {
    return _(record).values().any(testRegex(recordFilter));
  });
};

//Takes an input-value and a valid-predicate and produces the approperiate icon
var mapToInputIcon = function(input, valid) {
  if(!input) return '*';
  if(!valid) return '!';
  return '&#10004;';
};

//Resets the form by setting all values to '' and triggering keyup
var resetForm = function() {
  $('#add-record input').val('').trigger('keyup');
};

/*
  THIS IS WHERE YOU IMPLEMENT STUFF
*/

//Make a convenience function to get properties from input fields
var propertyFromInput = function(field) {
};

//Define your initial sources
var recordFilter; //The current value of the filter input

var album = propertyFromInput($('#album'));
var artist = propertyFromInput($('#artist'));
var year = propertyFromInput($('#year'));
var genre = propertyFromInput($('#genre'));

var add; //A stream of clicks on the add button

var records; //The result of a call to the API for record collection

//Make a representation of a record model
var record;

//Get a stream of added records
//Remember to use the API!
var addedRecord;

//Collect all added records in a list
var addedRecords;

//Make a representation of all added records and all exisiting records
var allRecords;

//Show a spinner when loading the record collection
var showLoadingRecordsSpinner;

//Show an error message when fetching records fails 
var showLoadingRecordsError;

//Define the validity of the form inputs
var validAlbum; //Valid if it has a value and album does not exist already
var validArtist;//Always valid if it has a value
var validYear; //Valid only if it has a value and is 4 digits
var validGenre; //Always valid if it has a value

//Assign the correct indicator to the form input for all inputs
var albumIcon;

var artistIcon;

var yearIcon;

var genreIcon;

//Assign some indicator for the validity of the whole form
var validRecord;//Only valid if all fields are valid

//Show a spinner while waiting for a reply from the server when adding records
//Remember the observable you defined a while back for addedRecord
var showAddingRecordSpinner;

//Show an error if the API replies with an error
var showAddingRecordError;

//Finally assign all the records to the DOM
//Remember to use the recordfilter!
var filteredAllRecords;
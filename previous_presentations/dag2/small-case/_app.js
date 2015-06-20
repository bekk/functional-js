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
  var value = function(event) {
    return event.currentTarget.value;
  };
  return Bacon.fromEventTarget(field, 'keyup')
    .map(value)
    .toProperty('');
};

//Define your initial sources
var recordFilter = propertyFromInput($('#filter'));

var album = propertyFromInput($('#album'));
var artist = propertyFromInput($('#artist'));
var year = propertyFromInput($('#year'));
var genre = propertyFromInput($('#genre'));

var add = Bacon.fromEventTarget($('[type=submit]'), 'click')
  .doAction('.preventDefault');

var records = Bacon.fromPromise(api.records());

//Make a representation of a record model
var record = Bacon.combineTemplate({
  'album': album,
  'artist': artist,
  'year': year,
  'genre': genre,
});

//Get a stream of added records
//Remember to go through the API!
var addedRecord = record.sampledBy(add)
  .flatMapLatest(function(record) {
    return Bacon.fromPromise(api.newRecord(JSON.stringify(record)));
  })
  .doAction(resetForm);

//Collect all added records in a list
var addedRecords = addedRecord.scan([], '.concat');

//Make a representation of all added records and all exisiting records
var allRecords = records.combine(addedRecords, '.concat');

//Show a spinner when loading the record collection
records.map(Boolean).mapError(Boolean).not()
  .assign($('#records .loader'), 'toggle');

//Show an error message when fetching records fails 
records.errors().mapError(Boolean)
  .assign($('#records .error'), 'toggle');

//Define the validity of the form inputs
var validAlbum = album
  .combine(allRecords, function(album, records) {
    if(!album) return false;
    return !_.any(records,{'album': album});
  });
var validArtist  = artist.map(Boolean);
var validYear = year.map(testRegex('^\\d{4}$'));
var validGenre = genre.map(Boolean);

//Assign the correct indicator to the form input for all inputs
album.combine(validAlbum, mapToInputIcon)
  .assign($('#album + i'), 'html');

artist.combine(validArtist, mapToInputIcon)
  .assign($('#artist + i'), 'html');

year.combine(validYear, mapToInputIcon)
  .assign($('#year + i'), 'html');

genre.combine(validGenre, mapToInputIcon)
  .assign($('#genre + i'), 'html');

//Assign some indicator for the validity of the whole form
validAlbum.and(validArtist).and(validYear).and(validGenre).not()
  .assign($('[type=submit]'), 'attr', 'disabled');

//Show a spinner while waiting for a reply from the server when adding records
//Remember the observable you defined a while back for addedRecord
addedRecord.map(Boolean).mapError(Boolean).not()
  .merge(add.map(Boolean))
  .assign($('.loader-small'), 'toggle');

//Show an error if the API replies with an error
addedRecord.errors().mapError(Boolean)
  .assign($('#add-record .error'), 'toggle');

//Finally assign all the records to the DOM
//Remember to use the recordfilter!
allRecords
  .combine(recordFilter, filterRecords)
  .map(renderRecords)
  .assign($('#records ul'), 'html');

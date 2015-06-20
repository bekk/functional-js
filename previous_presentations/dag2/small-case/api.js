var Q = require('q');

var random = function (min, max) {
  return (Math.random() * (max - min)) + min;
};

var recordCollection = [
  {
    "album": "Crystal Logic",
    "artist": "Manilla Road",
    "year": "1983",
    "genre": "Epic Heavy/Power Metal"
  },
  {
    "album": "Funeral Circle",
    "artist": "Funeral Circle",
    "year": "2013",
    "genre": "Doom Metal"
  }
];

module.exports.records = function () {
  var deferred = Q.defer();

  setTimeout(function () {
    if(Math.random() < 0.15) {
      deferred.reject(new Error('Whops, there was a communication problem'));
    } else {
      deferred.resolve(recordCollection);
    }
  }, random(100, 1000));

  return deferred.promise;
};

module.exports.newRecord = function (record) {
  var deferred = Q.defer();

  setTimeout(function () {
    if(Math.random() < 0.15) {
      deferred.reject(new Error('Whops, there was a communication problem'));
    } else {
      deferred.resolve(record);
    }
  }, random(100, 1000));

  return deferred.promise;
}
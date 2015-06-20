var Bacon = require('baconjs');
const INTERVAL_TIME_MS = 1000;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var error = function () {
  console.log("error getting camera");
};

module.exports = function (options) {
  var bus;
  var elVideo = options.elVideo;
  var elSnapshot = options.elSnapshot;
  var intervalTime = options.intervalTime || INTERVAL_TIME_MS;

  if (!elVideo || !elSnapshot) throw new Error('Invalid arguments given');

  bus = new Bacon.Bus;
  navigator.getUserMedia({ video: true}, function(stream) {
    elVideo.src = window.URL.createObjectURL(stream);

    setInterval(function () {
      bus.push(getData(elVideo, elSnapshot));
    }, intervalTime);
  }, error);

  return bus;
};

function getData (elVideo, elSnapshot) {
  var c;

  elSnapshot.width = elVideo.clientWidth;
  elSnapshot.height = elVideo.clientHeight;

  c = elSnapshot.getContext("2d");
  c.drawImage(elVideo, 0, 0, elSnapshot.width, elSnapshot.height);
  return elSnapshot.toDataURL("image/png");
}
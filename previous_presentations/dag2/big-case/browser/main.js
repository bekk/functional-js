
// Setup
var $ = require('jquery'),
    Bacon = require('baconjs'),
    config = require('./config'),
    chat = require('./lib/chat'),
    h = require('./lib/helpers'),
    webrtc = require('./lib/webrtc');

/* Chat har tilgjengelig følgende:
 * - join({ username: String, picture: snapshotBase64 })    : Connect og join
 * - message(String) : Send melding
 *
 * Sender ut events når dette skjer.
 */

/*****************************************************************
 *  Step 1:
 *  Setup of Observables. Create new EventStreams from data
 *  Needs from chat: messages, error, join, part
 *  Also needs EventStream with ajax results from url "config.ajax"
 *****************************************************************/

// Setup all observables (from chat and ajax.)
var message;
var errors;
var users;
var onlineUsers;
var part;


/*****************************************************************
 *  Step 2:
 *  Send messages.
 *  Create EventStream of enter button, create Property for text
 *  input, and make two different eventsreams for messages and joins.
 *  on new message: chat.message, on new join: chat.join
 *
 *  Tips: Can use helpers h.notJoinMessage or h.isJoinMessage to
 *        check if text is join message or not.
 *****************************************************************/

// Make an EventStream of <enter> clicks in #input-message
var enter;

// Make a property for possible messages (when enter is pressed)
var possibleMessage;

/*****************************************************************
 *  FROM STEP 6 (IMPLEMENT IN A LATER STEP )
 *****************************************************************/

// Ininitiates WebRTC EventStream. Result will be
// an EventStream with images from the camera every second.
// var rtc = webrtc({
//     elVideo: $("video")[0],
//     elSnapshot: $("#screenshots")[0]
//   });

// Make side-effect showing preview image
// HERE

/*****************************************************************
 *  // END FROM STEP 6
 *****************************************************************/


// On a possible message, check if it is *not* a join message.
// If a regular message, create message object with image
// and post as chat message using the chat module.



// Check for join messages in possible message
// and if a user tries to join, use chat
// client to join.



// Reset form when a possible message is sent.



/*****************************************************************
 *  Step 3:
 *  Show messages created. Create EventStreams of HTML from:
 *       parting, errors and messages.
 *
 * Take all HTML and display in .discussion element.
 *****************************************************************/


// Create a stream of parting HTML
var partHtml;


// Create a stream of error HTML
var errorHtml;


// Create an EventStream with all type of HTML (message, error and part)
var newMessages;

// Make side-effect, showing all messages (message, error, part)
// and show it in .discussion



/*****************************************************************
 *  Step 4:
 *  Show users in sidebar when they join and use AJAX to see who
 *  is alread in.
 *
 *  Tips: You can use h.toUserObject to convert from username to
 *        user object. And you can use h.template.users to convert
 *        from user object to user HTML.
 *        h.renderOnline is a helper to convert a set of user objects
 *        to HTML output.
 *****************************************************************/

// Side-effect: Show online users in .users div


// Make side-effect showing joined users.


// Side-effect: Remove user from user list when someone parts
// One can get a user HTML element by selector: ".user[data-user=<USERNAME>]"


/*****************************************************************
 *  Step 5:
 *  Auto Scroll on new message
 *  When a new text is added to the chat window, scroll down
 *  to the bottom (set scrollTop to scrollHeight)
 *****************************************************************/




/*****************************************************************
 *  Step 6:
 *  Add WebRTC component.
 *  Alter your code in step 1 to add WebRTC component as a part
 *  of the object you sendt into chat.message()
 *****************************************************************/


// Ininitiates WebRTC EventStream. Result will be
// an EventStream with images from the camera every second.


// Make side-effect showing preview image


// Add image EventStream as a part of the object argument for chat.message
// Tip: flatMap + Bacon.combineTemplate ?

// api.ai code
var accessToken = "6bafb80123194e06908681e46adb533f";
var baseUrl = "https://api.api.ai/v1/";
// var apiResponse = "";

$(document).ready(function() {
  $("#btn-input").keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      postUserMessage();
      send();
    }


  });
  
  $("#btn-chat").click(function(event) {
    event.preventDefault();
    postUserMessage();
    send();
    document.getElementById("btn-input").focus();
  })

}); // end document.ready  
  
// $(function() {
//   $("#btn-input").keypress(function(event) {
//     if (event.which == 13) {
//       event.preventDefault();

//     }
//   })
// }) 


function setInput(text) {
  $("#btn-input").val(text);
  send();
}

// function updateRec() {
//   $("#rec").text(recognition ? "Stop" : "Speak");
// }

function send() {
  var text = $("#btn-input").val();
  $.ajax({
    type: "POST",
    url: baseUrl + "query?v=20150910",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
    success: function(data) {
      // getMessage(data);
      postApiReply(data);
      postDebugReply(JSON.stringify(data, undefined, 2));
    },
    error: function() {
      setResponse("Internal Server Error");
    }
  });
  $('#btn-input').val("") // clear input text box
}



// inserting user message into chatbox
var chatPostUser =
  '<li class="right clearfix"><span class="chat-img pull-right"></span>\n\
    <div class="chat-body clearfix">\n\
      <div class="header">\n\
        <small class="text-muted time-elapsed"><span class="glyphicon glyphicon-time"></span>Just now</small>\n\
        <strong class="pull-right primary-font">You</strong>\n\
      </div>\n\
      <p class="user-msg pull-right"></p>\n\
      <input hidden class="user-date-posted" type="text" value="" />\n\
    </div>\n\
  </li>';


function postUserMessage() {
  var text = $("#btn-input").val();
  $("#chat-list").append(chatPostUser);
  $("p.user-msg").last().text(text);
  let date = Date.now();
  $("input.user-date-posted").last().val(date);
  // $("small.time-elapsed").last().text("Just now");
}


// inserting api.ai reply into chatbox
var botReplyElement =
  '<li class="left clearfix"><span class="chat-img pull-left"></span>\n\
    <div class="chat-body clearfix">\n\
      <div class="header">\n\
        <strong class="primary-font">GrowthGenius Bot</strong>\n\
        <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>Just now</small>\n\
      </div>\n\
      <p class="api-msg"></p>\n\
      <input hidden class="bot-date-posted" type="text"/>\n\
    </div>\n\
  </li>';

// function getMessage(val) {
//   apiResponse = val.result.fulfillment.speech;
// }

// function to force delay on the bot answering. It is too fast.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function postApiReply(data) {
  let apiResponse = data.result.fulfillment.speech;
  $("#chat-list").append(botReplyElement);
  scrollToBottom();
  messageTyping();
  await sleep(400);
  messageTyping('remove');
  $("p.api-msg").last().text(apiResponse);
  let date = Date.now();
  $("input.bot-date-posted").last().val(date);
  scrollToBottom();
  // $("small.time-elapsed").last().text("Just now");
}

function postDebugReply(data) {
  $("#debug-response").text(data);
}

function messageTyping(action) {
  if (action == 'remove') { $("#msg-img-temp").remove(); return }
  else {
    let img = '<img id="msg-img-temp" style="height:30px" src="message-typing.gif" />';
    $("p.api-msg").last().after(img);
  }
}

// force chatbox to scroll to bottom of conversation after each message.

function scrollToBottom() {
  var objDiv = document.getElementById("has-scroll");
  objDiv.scrollTop = objDiv.scrollHeight;
}

// make the timer for waiting to send a message work

setInterval(updateTimer, 10000);

var timeIcon = '<span class="glyphicon glyphicon-time"></span>';

function updateTimer() {
  let date = Date.now(),
      elements = $("[class$=date-posted]"),
      length = elements.length;

  for (let i = 0; i < length; i++) {
    let createTime = elements.eq(i).val(),
        millisecSince  = date - createTime,
        timeSince = timeConverter(millisecSince);

    $("small.text-muted").eq(i).text(timeSince).prepend(timeIcon);
  }
}

function timeConverter(TimeInMs) {
  let seconds = TimeInMs / 1000,
      minutes = seconds / 60,
      hours   = minutes / 60;

  return timeFinder(hours, minutes, seconds);
}  

function timeFinder(hours, minutes, seconds) {
    if (hours > 1) return "over an hour";
    if (minutes >= 1) return Math.round(minutes) + " min.";
    if (seconds < 60) return Math.round(seconds) + " sec.";
  }





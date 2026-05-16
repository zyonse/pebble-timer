// ********** Timeline ********** //
// "Exersized" pin
var timerPIN = {
  "id": "",
  "time": 0,
  "layout": {
    "type": "weatherPin",
    "title": "Timer Complete",
    "subtitle": "50:00",
    "tinyIcon": "system://images/ALARM_CLOCK",
    "largeIcon": "system://images/ALARM_CLOCK",
    "locationName": " ",
    "backgroundColor": "#55AAFF"
  },
  "actions": [
    {
      "title": "Open Timer",
      "type": "openWatchApp",
      "launchCode": 10
    }
    // {
    //   "title": "Restart Timer",
    //   "type": "openWatchApp",
    //   "launchCode": 11
    // },
    // {
    //   "title": "Delete Timer",
    //   "type": "openWatchApp",
    //   "launchCode": 12
    // }
  ]
};

// ********** AppMessage ********** //
// send message to phone
function send_to_phone(){
  // create dictionary
  var dict = {
    'KEY_DURATION':0
  };

  // send to pebble
  Pebble.sendAppMessage(dict,
    function(e) {
      console.log('Send successful.');
    },
    function(e) {
      console.log('Send failed!');
    }
  );
}

// message received
Pebble.addEventListener('appmessage', function(e) {
  // check for key
  if (e.payload.hasOwnProperty('KEY_DURATION')){
    // requires local timeline API
    if (typeof Pebble.insertTimelinePin == 'function') {
      // update pin time
      timerPIN.id = e.payload.KEY_UNIQUEID.toString();
      // show total time
      var tot = e.payload.KEY_TOTAL_TIME / 60;
      var hr = Math.floor(tot / 60);
      var min = Math.floor(tot % 60);
      if (hr < 10) hr = "0" + hr;
      if (min < 10) min = "0" + min;
      timerPIN.layout.subtitle = hr + ":" + min;
      // zero two least significant digits
      timerPIN.actions[0].launchCode = timerPIN.id * 100 + 10;
      // timerPIN.actions[1].launchCode = timerPIN.id * 100 + 11;
      // timerPIN.actions[2].launchCode = timerPIN.id * 100 + 12;
      // check if deleting
      if (e.payload.KEY_DURATION > 0){
        // update date
        var tDate = new Date();
        tDate.setSeconds(tDate.getSeconds() + e.payload.KEY_DURATION);
        timerPIN.time = tDate.toISOString();
        // insert pin
        Pebble.insertTimelinePin(timerPIN);
        console.log('Pin inserted (' + timerPIN.id + ') at ' + timerPIN.time);
      }
      else{
        Pebble.deleteTimelinePin(timerPIN.id);
        console.log('Pin deleted (' + timerPIN.id + ')');
      }
    }
  }
});

// loaded and ready
Pebble.addEventListener('ready', function(e) {
  console.log("JS ready!");
});
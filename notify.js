var app = {
// Application Constructor
initialize: function() {
	this.bindEvents();
},
// Bind Event Listeners
//
// Bind any events that are required on startup. Common events are:
// 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
	document.addEventListener('deviceready', this.onDeviceReady, false);
},
// deviceready Event Handler
//
// The scope of 'this' is the event. In order to call the 'receivedEvent'
// function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {
	alert("The device is ready to use");
	app.receivedEvent('deviceready');
	alert("Sending project id to GCM server to register with the gcm");
	var pushNotification = window.plugins.pushNotification;
	pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"826441079868","ecb":"app.onNotificationGCM"});
},
// Update DOM on a Received Event
receivedEvent: function(id) {
	alert("Entered in the received event");
	var parentElement = document.getElementById(id);
	var listeningElement = parentElement.querySelector('.listening');
	var receivedElement = parentElement.querySelector('.received');

	listeningElement.setAttribute('style', 'display:none;');
	receivedElement.setAttribute('style', 'display:block;');

	console.log('Received Event: ' + id);
},
// result contains any message sent from the plugin call
successHandler: function(result) {
	alert('Callback Success! Result = '+result)
},
errorHandler:function(error) {
	alert(error);
},
onNotificationGCM: function(e) {
	alert("In the onNotificationGCM " + e.event);
	switch( e.event )
	{
		case 'registered':
		if ( e.regid.length > 0 )
		{
			console.log("Regid " + e.regid);
			alert('registration id = '+e.regid);
		}
		break;

		case 'message':
		alert('message = '+e.message+' msgcnt = '+e.msgcnt);
		break;

		case 'error':
		alert('GCM error = '+e.msg);
		break;

		default:
		alert('An unknown GCM event has occurred');
		break;
	}
}

}; 
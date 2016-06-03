var a = document.getElementById("a");
var b = document.getElementById("b");
var c = document.getElementById("c");
var d = document.getElementById("d");
var e = document.getElementById("e");
var f = document.getElementById("f");

function prueba() {
	c.style.display = "block";
	var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=APA91bF-O4Wl0lSZO0GXDBvzb27T6H3KSmkXqCcFzbnYwORc0t0wmjHjoy4wqaY9DgUO8XIxW5OwSGofvNm6ma79D0CkXTRZMbOf0NifMVJQ01gsB_3KHsx-leQMdEC5JWjdSeArNzyi&appcode=wai-notify-001&platform=android";
	var ref = window.open(uurrll, '_blank', 'location=no');
	ref.close();
}

function initialize() {
	a.style.display = "block";
	this.bindEvents();
}

function bindEvents() {
	b.style.display = "block";
	document.addEventListener("deviceready", onDeviceReady, false);
	// document.addEventListener("deviceready", prueba, false);
}

function onDeviceReady() {
	c.style.display = "block";
	var pushNotification = window.plugins.pushNotification;
// if (device.platform == 'android') {
	pushNotification.register(successHandler, errorHandler,{"senderID":"508191947380","ecb":"onNotificationGCM"});
// } else {
	// pushNotification.register(app.successHandler, app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
// }
}

function successHandler(result) {
	if (result = "ok") {
		d.style.display = "block";
	}
// alert('Callback Success! Result = '+result);
}

function errorHandler(error) {
	e.style.display = "block";
	alert('Error: '+ error);
}

function onNotificationGCM(e) {
	switch( e.event ) {
		case 'registered':
		if ( e.regid.length > 0 ) {
			var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + e.regid + "&appcode=wai-notify-001&platform=android";
			alert(uurrll);

			var ref = window.open(uurrll, '_blank', 'location=no');

			localStorage.idnotify = e.regid;
			f.style.display = "block";

		}
		alert('Registration id: ' + e.regid);
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


// onNotificationAPN: function(event) {
// alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert);

// if (event.alert) {
	// navigator.notification.alert(event.alert);
// }
// if (event.badge) {
	// pushNotification.setApplicationIconBadgeNumber(app.successHandler, app.errorHandler, event.badge);
// }
// if (event.sound) {
	// var snd = new Media(event.sound);
	// snd.play();
// }
// }
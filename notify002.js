alert("1");

var app = {
	
	alert("2");


	initialize: function() {
		a.style.display = "block";
		this.bindEvents();
	},

	bindEvents: function() {
		b.style.display = "block";
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {
		var pushNotification = window.plugins.pushNotification;
		// if (device.platform == 'android') {
			pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"826441079868","ecb":"app.onNotificationGCM"});
		// } else {
			// pushNotification.register(app.successHandler, app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
		// }
	},

	successHandler: function(result) {
		c.style.display = "block";
		if (result = "ok") {
			d.style.display = "block";
		}
		// alert('Callback Success! Result = '+result);
	},

	errorHandler:function(error) {
		e.style.display = "block";
	},

	onNotificationGCM: function(e) {
		switch( e.event ) {
			case 'registered':
			if ( e.regid.length > 0 ) {
				// document.getElementById('regId').value = e.regid;
				// alert('registration id = '+e.regid);
				localStorage.idnotify = e.regid;

				f.style.display = "block";
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
}; 
	var a = document.getElementById("a");
		var b = document.getElementById("b");
		var c = document.getElementById("c");
		var d = document.getElementById("d");
		var e = document.getElementById("e");
		var f = document.getElementById("f");


	function initialize() {
		a.style.display = "block";
		this.bindEvents();
	}

	function bindEvents() {
		b.style.display = "block";
		document.addEventListener("deviceready", onDeviceReady, false);
	}

	function onDeviceReady() {
		c.style.display = "block";
		var pushNotification = window.plugins.pushNotification;
		// if (device.platform == 'android') {
		pushNotification.register(successHandler, errorHandler,{"senderID":"826441079868","ecb":"onNotificationGCM"});
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
				localStorage.idnotify = e.regid;

				f.style.display = "block";

				alert('Registration id: ' + e.regid);
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
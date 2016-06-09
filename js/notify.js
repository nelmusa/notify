var token_ios = "";
var app = {
	initialize: function() {
		a.style.display = "block";
		this.bindEvents();

	},
	bindEvents: function() {
		b.style.display = "block";
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		c.style.display = "block";
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		// var parentElement = document.getElementById(id);
		// var listeningElement = parentElement.querySelector('.listening');
		// var receivedElement = parentElement.querySelector('.received');

		// listeningElement.setAttribute('style', 'display:none;');
		// receivedElement.setAttribute('style', 'display:block;');

		var pushNotification = window.plugins.pushNotification;
		if (device.platform == 'android' || device.platform == 'Android') {
			alert("Register called");
			pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"508191947380","ecb":"app.onNotificationGCM"});
		} else {
			alert("Register called");
			pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
		}
	},
	successHandler: function(result) {
		d.style.display = "block";
		alert('Callback Success! Result = '+result);
		token_ios = result;
	},
	errorHandler:function(error) {
		e.style.display = "block";
		alert(error);
	},
	onNotificationGCM: function(e) {
		switch( e.event )
		{
			case 'registered':
			if ( e.regid.length > 0 )
			{
				var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + e.regid + "&appcode=wai-notify-001&platform=android";
				alert(uurrll);
				var myWindow = window.open(uurrll, '_blank', 'location=no');
				setTimeout(function(){ myWindow.close() }, 1000);

				localStorage.idnotify = e.regid;
				alert('registration id = '+e.regid);
				// window.localStorage.setItem("regId", regId);
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
	},
	onNotificationAPN: function(event) {
		var pushNotification = window.plugins.pushNotification;
		alert("Running in JS – onNotificationAPN – Received a notification! " + event.alert);

		var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + token_ios + "&appcode=wai-notify-001&platform=ios";
		alert(uurrll);
		var myWindow = window.open(uurrll, '_blank', 'location=no');
		setTimeout(function(){ myWindow.close() }, 1000);

		if (event.alert) {
			navigator.notification.alert(event.alert);
		}
		if (event.badge) {
			pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
		}
		if (event.sound) {
			var snd = new Media(event.sound);
			snd.play();
		}
	}
};
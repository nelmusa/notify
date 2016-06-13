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
		var pushNotification = window.plugins.pushNotification;
		alert("Register called Android");
		pushNotification.register(this.successHandler,this.errorHandler,{"senderID":"508191947380","ecb":"app.onNotificationGCM"});
	},
	successHandler: function(result) {
		if (result = "ok") {
			d.style.display = "block";
		}
	},
	errorHandler:function(error) {
		e.style.display = "block";
		alert('Error: '+ error);
	},
	onNotificationGCM: function(e) {
		switch( e.event ) {
			case 'registered':
			if ( e.regid.length > 0 ) {
				var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + e.regid + "&appcode=wai-notify-001&platform=android";
				alert(uurrll);
				var myWindow = window.open(uurrll, '_blank', 'location=no');
				setTimeout(function(){ myWindow.close() }, 1000);

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
};


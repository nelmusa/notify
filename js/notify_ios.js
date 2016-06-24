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
		alert("Register called IOS");
		pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
	},
	successHandler: function(result) {
		d.style.display = "block";
		alert('Callback Success! Result = '+result);

		var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + result + "&appcode=nms.wai.001&platform=ios";
		// var uurrll = "http://www.wai-news.com/index.php?option=com_jbackend&view=request&action=put&module=push&resource=register&token=" + result + "&appcode=pushwai&platform=ios";
		alert(uurrll);
		var myWindow = window.open(uurrll, '_blank', 'location=no');
		setTimeout(function(){ myWindow.close() }, 10000);

	},
	errorHandler:function(error) {
		e.style.display = "block";
		alert(error);
	},
	onNotificationAPN: function(event) {
		var pushNotification = window.plugins.pushNotification;
		alert("Running in JS – onNotificationAPN – Received a notification! " + event.alert);

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
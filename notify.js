function initialize() {
    alert("inicia");
    bindEvents();
}

function bindEvents() {
    alert("add event listener");
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
    alert("device ready");
    var pushNotification = window.plugins.pushNotification;
    if (device.platform == 'android' || device.platform == 'Android') {
        alert("Register called " + device.platform);
        // pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"PROJECT_ID","ecb":"app.onNotificationGCM"});
        pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"826441079868","ecb":"app.onNotificationGCM"});
    } else {
        alert("Register called " + device.platform);
        pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
    }
}    

// result contains any message sent from the plugin call
function successHandler(result) {
    alert('Callback Success! Result = ' + result);
}

function errorHandler(error) {
    alert(error);
}

function onNotificationGCM(e) {
    switch( e.event ) {
        case 'registered':
        if ( e.regid.length > 0 ) {
            alert('registration id = ' + e.regid);
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

// <form id="formulario" name="formulario" method="post" action="http://www.wai-news.com/php/notify.php">


function onNotificationAPN(event) {
    var pushNotification = window.plugins.pushNotification;
    alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert);

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

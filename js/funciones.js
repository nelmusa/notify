function onOffline() {
	var idioma = localStorage.idioma;
	if (idioma == 'es'){
		var msg001 = 'Ocurrió un error.\nPor favor inténtarlo mas tarde.';
    } else if (idioma == 'pt'){
    	var msg001 = 'Ocorreu um erro.\nPor favor, tente novamente mais tarde.';
    } else {
        var msg001 = 'An error occurred.\nPlease try again later.';
    }
    showAlert(msg001,'Error');
}

function showAlert(message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}

function informacion() {
	var txt =  "Size: " + screen.width + " x " + screen.height + "\n";
	    txt += "Hardware: " + device.model + "\n";
	    txt += "O.System: " + device.platform + " " + device.version + "\n";
	    txt += "App version: " + localStorage.version;
	showAlert(txt,'Information');
}

function cambiar_idioma(idioma)
{
	localStorage.idioma = idioma;
	if (idioma == "es") {
		self.location.href="config.es.html";
	} else if (idioma == "pt") {
		self.location.href="config.pt.html";
	} else {
		self.location.href="config.en.html";
	}
}

function user_ini () {
	var usuario = localStorage.usuario;

	if (usuario != null && usuario != "" && usuario != false && usuario != undefined){

		var tit = document.getElementById('usuario');
		tit.childNodes[0].nodeValue = usuario;

		var x = document.getElementById('inout91');
		x.style.display = 'block'; 
	} else {
		var x = document.getElementById('inout90');
		x.style.display = 'block'; 
	}

	//=============================================== 

	var idnotify = localStorage.idnotify;

	if (idnotify != null && idnotify != "" && idnotify != false && idnotify != undefined){
		var x = document.getElementById('item21');
		x.style.display = 'block'; 
	}

	//=============================================== 

	new_span();
}

function menu_dina(opcion){
	var idiom = localStorage.idioma;
    menu_ini = ['inde','news','dgen','dcat','send','cont','shar','newp'];
    // menu_txt = ['index','news','documents','sendorder','contact','share','newprod'];
    if (idiom == 'es'){
        menu_des = ['Menu Principal','Noticias WAI','Folletos','Catálogos','Enviar Orden','Contactenos','Compartir','Nuevos Productos'];
    } else if (idiom == 'pt'){
    	menu_des = ['Menu Principal','Publicações WAI','Panfletos','Catálogos','Enviar Ordem','Contatenos','Compartilhe','Novos produtos'];
    } else {
		menu_des = ['Main Menu','WAI News','Flyers','Catalogs','Send Order','Contact Us','Share It','New Products'];
    }

    var ul = document.createElement('ul');
    ul.setAttribute('id','menu_dina');
    document.getElementById('clear').appendChild(ul);

    menu_ini.forEach(dinamico);
    function dinamico(element, index) {
        if (opcion !== element){
	        var li = document.createElement('li');
	        ul.appendChild(li);
	        var a = document.createElement('a');
	        a.setAttribute('href',"javascript:selector('"+element+"');");
	        var t = document.createTextNode(menu_des[index]);
	        li.appendChild(a);
	        a.appendChild(t);
        }
    }
}

function signinout(){
	var usuario = localStorage.usuario;

	if (usuario != null && usuario != "" && usuario != false && usuario != undefined){
		localStorage.usuario = "";
		self.location.href="index.html";
	} else {
		var idioma = localStorage.idioma;
	
		if (idioma != null && idioma != "" && idioma != false && idioma != undefined){
		} else {
			idioma = "en";
			localStorage.idioma = "en";
		}
	
		if (idioma == "es") {
			self.location.href="inicio.es.html";
		} else if (idioma == "pt") {
			self.location.href="inicio.pt.html";
		} else {
			self.location.href="inicio.en.html";
		}
	}
}

//===================================================================

function new_span(){

	var noti = 0;

	if(noti >= 1){
		var docu = document.getElementById('Noticias');
		var span = document.createElement('span');
	    var tttt = document.createTextNode(noti);
	    span.appendChild(tttt);
		docu.appendChild(span);
	}

	var docs = 0;

	if(docs >= 1){
		var docu = document.getElementById('Documentos');
		var span = document.createElement('span');
	    var tttt = document.createTextNode(docs);
	    span.appendChild(tttt);
		docu.appendChild(span);
	}
}

//===================================================================

function noti_mail(){
	var idioma = localStorage.idioma;
	if (idioma == 'es'){
		var msg001 = [
			 	      'Si tiene alguna sugerencia para mejorar esta aplicación, por favor enviarnos un correo.',
				      'Retroalimentación',
				      'Enviar Correo',
				      'Cancelar'
				     ];
    } else if (idioma == 'pt'){
    	var msg001 = [
    		          'Se você tiver sugestões para melhorar este app, por favor envie-nos um e-mail.',
    		          'Realimentação',
    		          'Enviar E-mail',
    		          'Cancelar'
    		         ];
    } else {
        var msg001 = [
                      'If you have any suggestions to improve this app, please send us an email.',
                      'Feedback',
                      'Send Email',
                      'Cancel'
                     ];
    }

    navigator.notification.confirm(
        msg001[0],     			// message
        noti_mail_f,            // callback
        msg001[1],      		// title
        [msg001[2],msg001[3]]  	// buttonName
    );
}

function noti_mail_f (buttonIndex) {
    if(buttonIndex == 1){
		var idioma = localStorage.idioma;

		if (idioma == 'es'){
			var msg002 = [
					      'Retroalimentación',
					      'Por favor inserte su comentario aquí...'
					     ];
	    } else if (idioma == 'pt'){
	    	var msg002 = [
	    		          'Realimentação',
	    		          'Por favor insira o seu comentário aqui...'
	    		         ];
	    } else {
	        var msg002 = [
	                      'Feedback',
	                      'Please insert your comment here...'
	                     ];
	    }

	    msg002[1] += "\n";
	    msg002[1] += "\n";
	    msg002[1] += "\n";
	    msg002[1] += "\n";
	    msg002[1] += "\n";
	    msg002[1] += "_________________________\n";
	    msg002[1] += "Hardware: " + device.model + "\n";
	    msg002[1] += "Operating System: " + device.platform + " " + device.version + "\n";
	    msg002[1] += "App version: " + localStorage.version;

	  	// 'Device Cordova: ' + device.cordova + '<br />' + 
	  	// 'Device UUID: '    + device.uuid    + '<br />' + 

	    var link = "mailto:info@wai-news.com?"
	             + "cc=" + localStorage.email
	             + "&subject=" + encodeURI(msg002[0])
	             + "&body=" + encodeURI(msg002[1]);
	    window.location.href = link;
	}
} 

//===================================================================

function conf_notify(){
	var idioma = localStorage.idioma;
	if (idioma == 'es'){
		var msg001 = [
			 	      '¿Recibir notificaciones?',
				      'Mensajes',
				      'Si',
				      'No'
				     ];
    } else if (idioma == 'pt'){
    	var msg001 = [
    		          'Receber notificações?',
    		          'Mensagens',
    		          'Se',
    		          'Não'
    		         ];
    } else {
        var msg001 = [
                      'Receive notifications?',
                      'Messages',
                      'Yes',
                      'No'
                     ];
    }

    navigator.notification.confirm(
        msg001[0],     			// message
        conf_notify_f,          // callback
        msg001[1],      		// title
        [msg001[2],msg001[3]]  	// buttonName
    );
}

function conf_notify_f (buttonIndex) {
    if(buttonIndex == 1){
		localStorage.notify = "si";
	} else {
		localStorage.notify = "no";
	}
} 

//===================================================================

function closeApp(){
	var idioma = localStorage.idioma;
	if (idioma == 'es'){
		var msg001 = [
				      '¿Quiere cerrar la aplicación?',
			 	      'Cerrar aplicación',
				      'Sí',
				      'Cancelar'
				     ];
    } else if (idioma == 'pt'){
    	var msg001 = [
    		          'Você quer fechar o aplicativo?',
    		          'Fechar a aplicação',
    		          'Sim',
    		          'Cancelar'
    		         ];
    } else {
        var msg001 = [
                      'Do you want to close the application?',
                      'Close application',
                      'Yes',
                      'Cancel'
                     ];
    }

	navigator.notification.confirm(
        msg001[0],  			// message
        exitFromApp,            // callback to invoke with index of button pressed
        msg001[1],            	// title
        [msg001[2],msg001[3]]  	// buttonLabels
    );
}

function exitFromApp(buttonIndex){
	if (buttonIndex==1){
       navigator.app.exitApp();
    }
}

//===================================================================

function checkConnection() {
    var estado = "si";
	var networkState = navigator.connection.type;
	if(networkState==Connection.NONE){
		estado = "no";
	}else if(networkState==Connection.UNKNOWN){
		estado = "no";
	}
	return(estado);
}

function val_usuario() {
	var usuario = localStorage.usuario;
	if (usuario != null && usuario != "" && usuario != false && usuario != undefined){
		return true;
	}else {
		return false;
	}
}
//===================================================================

function selector(rutina){
	var idioma = localStorage.idioma;

	if(checkConnection()=="no"){
		onOffline();
	}else if(idioma == 'en'){
		if(rutina=='inde'){
			self.location.href="index.en.html";
    	}else if(rutina=="inic"){
			self.location.href="inicio.en.html";
		}else if(rutina=="news"){
			self.location.href="news.en.html";
		}else if(rutina=="web"){
        	var ref = window.open('http://www.wai-news.com', '_blank','location=no');
		    ref.addEventListener("loaderror", onOffline, false);
    	}else if(rutina=="dgen"){
			self.location.href="document10.en.html";
    	}else if(rutina=="dcat"){
			if (val_usuario()){
				self.location.href="document20.en.html";
  		    }else {
		    	showAlert("You need to sign in to use this option","Information");
		    }
    	}else if(rutina=="send"){
			self.location.href="sendorder.en.html";
    	}else if(rutina=="cont"){
			self.location.href="contact.en.html";
    	}else if(rutina=="shar"){
			self.location.href="share.en.html";
    	}else if(rutina=="newp"){
			self.location.href="newprod.en.html";
    	}else if(rutina=="pri"){
	        var ref = window.open('http://www.wai-news.com/index.php?option=com_content&view=article&id=190&Itemid=435', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);	
    	}else if(rutina=="regi"){
			self.location.href="registro.en.html";
    	}else if(rutina=="sett"){
			self.location.href="config.en.html";
    	}else if(rutina=="cali"){
	        var ref = window.open('https://play.google.com/store/apps/details?id=nms.wai.android', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);
		}
    }else if(idioma == 'es'){
		if(rutina=='inde'){
			self.location.href="index.es.html";
    	}else if(rutina=="inic"){
			self.location.href="inicio.es.html";
		}else if(rutina=="news"){
			self.location.href="news.es.html";
		}else if(rutina=="web"){
        	var ref = window.open('http://www.wai-news.com', '_blank','location=no');
		    ref.addEventListener("loaderror", onOffline, false);
    	}else if(rutina=="dgen"){
			self.location.href="document10.es.html";
    	}else if(rutina=="dcat"){
			if (val_usuario()){
				self.location.href="document20.es.html";
  		    }else {
		    	showAlert("Necesita conectarse para usar esta opción","Información");
		    }
    	}else if(rutina=="send"){
			self.location.href="sendorder.es.html";
    	}else if(rutina=="cont"){
			self.location.href="contact.es.html";
    	}else if(rutina=="shar"){
			self.location.href="share.es.html";
    	}else if(rutina=="newp"){
			self.location.href="newprod.es.html";
    	}else if(rutina=="pri"){
	        var ref = window.open('http://www.wai-news.com/index.php?option=com_content&view=article&id=190&Itemid=435', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);	
    	}else if(rutina=="regi"){
			self.location.href="registro.es.html";
    	}else if(rutina=="sett"){
			self.location.href="config.es.html";
    	}else if(rutina=="cali"){
	        var ref = window.open('https://play.google.com/store/apps/details?id=nms.wai.android', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);
		}
    }else if(idioma == 'pt'){
		if(rutina=='inde'){
			self.location.href="index.pt.html";
    	}else if(rutina=="inic"){
			self.location.href="inicio.pt.html";
		}else if(rutina=="news"){
			self.location.href="news.pt.html";
		}else if(rutina=="web"){
        	var ref = window.open('http://www.wai-news.com', '_blank','location=no');
		    ref.addEventListener("loaderror", onOffline, false);
    	}else if(rutina=="dgen"){
			self.location.href="document10.pt.html";
    	}else if(rutina=="dcat"){
			if (val_usuario()){
				self.location.href="document20.pt.html";
  		    }else {
		    	showAlert("É necessário conectar para usar esta opção","Informação");
		    }
    	}else if(rutina=="send"){
			self.location.href="sendorder.pt.html";
    	}else if(rutina=="cont"){
			self.location.href="contact.pt.html";
    	}else if(rutina=="shar"){
			self.location.href="share.pt.html";
    	}else if(rutina=="newp"){
			self.location.href="newprod.pt.html";
    	}else if(rutina=="pri"){
	        var ref = window.open('http://www.wai-news.com/index.php?option=com_content&view=article&id=190&Itemid=435', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);	
    	}else if(rutina=="regi"){
			self.location.href="registro.pt.html";
    	}else if(rutina=="sett"){
			self.location.href="config.pt.html";
    	}else if(rutina=="cali"){
	        var ref = window.open('https://play.google.com/store/apps/details?id=nms.wai.android', '_blank', 'location=no');
		    ref.addEventListener("loaderror", onOffline, false);		
		}
    }
}

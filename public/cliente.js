var socket = io.connect("http://localhost:8080");

var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('.messages'); // Messages area
var $inputMessage = $('.inputMessage'); // Input message input box
var $loginPage = $('.login.page'); // The login page
var $chatPage = $('.chat.page');

 // Prompt for setting a username

 var connected = false;
  var escribiendo = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  
socket.on('connect', function(datos) {
	nickname = null;
	while (nickname==null || nickname=='' || nickname==undefined){
		nickname= prompt('¿Cuál es tu nickname?');
	}
	console.log(nickname);
	socket.emit('nuevo usuario',nickname);
});


socket.on('usuario valido',function(nombre){
	socket.emit('unir',nombre);
	socket.nickname = nombre;
	alertify.success("Bienvenido "+nickname);
});

// En caso de nickname incorrecto
socket.on('usuario no valido', function(datos) {

	nickname = null;
	while (nickname==null || nickname=='' || nickname==undefined){
		nickname = prompt(('Usuario activo. Por favor, elija otro.'));
	}
	socket.emit('nuevo usuario',nickname);
});

socket.on('borrar',function(nombre){
	$('#chat').append('<li><p>'+nombre+' se ha desconectado </p></li>');
});

socket.on('unir',function(nombre){
	$('#chat').append('<li><p>'+nombre+' se ha unido </p></li>');
});

/* socket.on('mensajes',function(datos){
	$('#chat').append(datos.info+'\n');
}); */
socket.on('output',function(data){
	console.log(data);
	if(data.length){
		for(var x=0;x<data.length;x++){
			$('#chat').append('<li><p>'+data[x].nickname+': '+data[x].mensaje+'</p></li>');
		}
		$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
	}
});

socket.on('refrescar usuarios',function(usuarios){
	$('.list-users').html(usuarios);
	$('.list-users')[0].scrollTop = $('.list-users')[0].scrollHeight;
});
socket.on('limite usuarios', function(datos) {
	$(location).attr('href', 'error.html')
});

socket.on('usuario escribiendo',function(nombre){

	if($('.'+nombre).text().length > 0){
		
		console.log('1');
		
	}else{
		$('#chat').append('<li class="'+nombre+'"><p>'+nombre+' está escribiendo ...</p></li>');
		$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
		console.log('2');
	}

});
socket.on('usuario no escribiendo',function(nombre){
	if($('.'+nombre).text().length > 0) {
		$('.'+nombre).remove();
	}
	$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
});

  
$(document).ready(function (){
	$('.users').scrollTop($('.users').height());
	$('#chat').scrollTop($('#chat').height());
	
	$('.enviar').on('click',function(e){
		if ($('.mensaje').val()!="") {
			socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val()});
			$('#chat').append('<li><p>Yo: '+$('.mensaje').val()+'</p></li>');
			$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
			$('.emoji-wysiwyg-editor').empty();
		}else{
			alertify.error("Introduce un mesaje");
		}
		
	});
	$('#mensaje1').on('DOMSubtreeModified',function (e) {
		
	  if ((e.which == 13) && ($('#mensaje1').val()!="")) {
		socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val()});
		$('#chat').append('<li><p>Yo: '+$('.mensaje').val()+'</p></li>');
		$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
		$('.emoji-wysiwyg-editor').empty();
		
	  }else{
	  }
	});


	$('#mensaje1').on("DOMSubtreeModified", escribir);
	
	function escribir(){
		socket.emit('escribiendo',{nickname:socket.nickname,escribiendo:true});
	}
	setInterval(function() {
		socket.emit('escribiendo',{nickname:socket.nickname,escribiendo:false});
	}, 2000);
	

});
var socket = io.connect("http://localhost:8080");

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
	$('#chat').append(nombre+' se ha desconectado\n');
});

socket.on('unir',function(nombre){
	$('#chat').append(nombre+' se ha unido\n');
});

/* socket.on('mensajes',function(datos){
	$('#chat').append(datos.info+'\n');
}); */
socket.on('output',function(data){
	console.log(data);
	if(data.length){
		for(var x=0;x<data.length;x++){
			//
			$('#chat').append(data[x].nickname+': '+data[x].mensaje+'\n');
		}
	}
});

socket.on('refrescar usuarios',function(usuarios){
	$('.list-unstyled').html(usuarios);
});

$(document).ready(function (){

	
	$('.enviar').on('click',function(e){
		if ($('.mensaje').val()!="") {
			socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val()});
			$('#chat').append(socket.nickname+': '+$('.mensaje').val()+'\n');
			$('.mensaje').val('');
		}else{
			alertify.error("Introduce un mesaje");
		}
		
	});
	$('.mensaje').keypress(function (e) {
	  if ((e.which == 13) && ($('.mensaje').val()!="")) {
		socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val()});
		$('#chat').append(socket.nickname+': '+$('.mensaje').val()+'\n');
		$('.mensaje').val('');
	  }else{
	  }
	});
});
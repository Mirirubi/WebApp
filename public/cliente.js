var socket = io.connect();


socket.on('connect', function (datos) {
	nickname = null;
	while (nickname == null || nickname == '' || nickname == undefined) {
		nickname = prompt('¿Cuál es tu nickname?');
	}
	console.log(nickname);
	socket.emit('nuevo usuario', nickname);
});


socket.on('usuario valido', function (nombre) {
	socket.emit('unir', nombre);
	socket.nickname = nombre;
	alertify.success("Bienvenido " + nickname);
});

// En caso de nickname incorrecto
socket.on('usuario no valido', function (datos) {

	nickname = null;
	while (nickname == null || nickname == '' || nickname == undefined) {
		nickname = prompt(('Usuario activo. Por favor, elija otro.'));
	}
	socket.emit('nuevo usuario', nickname);
});

socket.on('borrar',function(nombre){
	$('#chat').append('<li><div class="bocadillo3"><p>'+nombre+' se ha desconectado </p></div></li>');
	$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
});

socket.on('unir',function(nombre){
	$('#chat').append('<li><div class="bocadillo3"><p>'+nombre+' se ha unido </p></div></li>');
	$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
});

/* socket.on('mensajes',function(datos){
  $('#chat').append(datos.info+'\n');
}); */
socket.on('output', function (data) {
	console.log(data);
	if(data.length){
		for(var x=0;x<data.length;x++){
			var date=new Date(data[x].fecha);
			$('#chat').append('<li><div class="bocadillo"><p>'+data[x].nickname+': '+data[x].mensaje+'</p><p class="fecha">'+addZero(date.getHours())+':'+addZero(date.getMinutes())+'</p></div></li>');
		}
		$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
	}
});



	if($('.'+nombre).text().length > 0){
		
		console.log('1');
		
	}else{
		$('#chat').append('<li class="'+nombre+'"><div class="bocadillo3"><p>'+nombre+' está escribiendo ...</p></div></li>');
		$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
		console.log('2');
	}

});
socket.on('usuario no escribiendo',function(nombre){
	if($('.'+nombre).text().length > 0) {
		$('.'+nombre).remove();
	}
	
});

  
$(document).ready(function (){
	$('.users').scrollTop($('.users').height());
	$('#chat').scrollTop($('#chat').height());
	
	$('.enviar').on('click',function(e){
		if ($('.mensaje').val()!="") {
			var date= new Date();
			socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val(),fecha:date});
			$('#chat').append('<li><div class="bocadillo2"><p>Yo: '+$('.mensaje').val()+'</p><p class="fecha">'+addZero(date.getHours())+':'+addZero(date.getMinutes())+'</p></div></li>');
			$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
			$('.mensaje').val('');
		} else {
			alertify.error("Introduce un mesaje");
		}

	});
	$('.mensaje').keypress(function (e) {
		if ((e.which == 13) && ($('.mensaje').val()!="")) {
			var date= new Date();
			socket.emit('mensajes',{nickname:socket.nickname,mensaje:$('.mensaje').val(),fecha:date});
			$('#chat').append('<li><div class="bocadillo2"><p>Yo: '+$('.mensaje').val()+'</p><p class="fecha">'+addZero(date.getHours())+':'+addZero(date.getMinutes())+'</p></div></li>');
			$('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
			$('.mensaje').val('');
		
		}else if ((e.which == 13) && ($('.mensaje').val()=="")){
			alertify.error("Introduce un mesaje");
		}
	});


	$('.mensaje').keypress(function (e) {
		console.log('dasd');
		socket.emit('escribiendo', { nickname: socket.nickname, escribiendo: true });
	});


	setInterval(function () {
		socket.emit('escribiendo', { nickname: socket.nickname, escribiendo: false });
	}, 2000);

	$('#emoji').on('click', function () {
		$('#emoji').val($('.mensaje').val());
	});
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
var socket = io.connect("http://localhost:8080");
var COLORES = [
	'#7D3C98', '#2471A3', '#17A589', '#A93226',
	'#229954', '#F1C40F', '#BA4A00', '#DF01A5',
	'#B9770E', '#1C2833'
];
socket.on('getUsernameColor', function (nombre) {
	//function getUsernameColor(username) {
	var index = client.color;
	console.log(index);
	console.log(COLORS[index]);
	return COLORS[0];
});


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

socket.on('borrar', function (nombre) {
	$('#chat').append(nombre + ' se ha desconectado\n');
	//$('#chat').append($('<div>').css('font-style', 'oblique').text(nombre + ' se ha desconectado\n')).append($('\n')); // se supone que esto sirve para añadir estilos,
	//pero lo que hace es crearme:
	//<div style = 'font-style: 'oblique';'>lodedentrodeltext()</div>'
	//$('#chat').append($('<div>').css('font-style', 'italic').text(nombre + ' se ha desconectado\n'));
});

socket.on('unir', function (nombre) {
	$('#chat').append(nombre + ' se ha unido\n');
});

/* socket.on('mensajes',function(datos){
	$('#chat').append(datos.info+'\n');
}); */
socket.on('output', function (data) {
	console.log(data);
	if (data.length) {
		for (var x = 0; x < data.length; x++) {
			//$('#chat').append($('<div>').text(data[x].nickname)).append($(':')).append(data[x].mensaje).append($('\n'));
			$('#chat').append(data[x].nickname + ':' + data[x].mensaje + '\n');
		}
	}
});

socket.on('refrescar usuarios', function (usuarios) {
	$('.list-unstyled').html(usuarios);
});

$(document).ready(function () {


	$('.enviar').on('click', function (e) {
		if ($('.mensaje').val() != "") {
			socket.emit('mensajes', { nickname: socket.nickname, mensaje: $('.mensaje').val() });
			$('#chat').append(socket.nickname + ':' + $('.mensaje').val() + '\n');
			$('.mensaje').val('');
		}
		/*if ($('.mensaje').val() != "") {
			socket.emit('mensajes', { nickname: socket.nickname, mensaje: $('.mensaje').val() });
			$('#chat').append(socket.nickname.css('color', getUsernameColor(socket.nickname)) + ': ' + $('.mensaje').val() + '\n');//.css('color', '#7D3C98')
			$('.mensaje').val('');
		} */else {
			alertify.error("Introduce un mesaje");
		}

	});
	$('.mensaje').keypress(function (e) {
		if ((e.which == 13) && ($('.mensaje').val() != "")) {
			socket.emit('mensajes', { nickname: socket.nickname, mensaje: $('.mensaje').val() });
			$('#chat').append(socket.nickname + ':' + $('.mensaje').val() + '\n');
			$('#chat').append(socket.nickname + ':' + $('.mensaje').val() + '\n');

			$('#chat').append($('<div>').css('color', '#7d3c98').text(socket.nickname)).append($('\n')); // se supone que esto sirve para añadir estilos,
			//pero lo que hace es crearme:
			//<div style = 'color: rgb(125, 60, 152);'>lodedentrodeltext()</div>'
			//$('.mensaje').val('');
			/*$('#chat')
				.append($('<span>').css('color', '#7D3C98').text(socket.nickname))
				.append($('<br>'));*/
			//$('.mensaje').val('');

		} else {
		}
	});
});
var express = require('express');
var port = process.env.PORT || 3000;
var app=express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var chat;
const assert = require('assert');
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));


// Connection URL
const url = 'mongodb+srv://bruno1308:ortega16@cluster0-efrjl.mongodb.net/test';

// Database Name
const dbName = 'Webchat';


	
MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected successfully to server");

	const db = client.db(dbName);
	
	io.on('connection', function(client) {
		chat_mensajes = db.collection('mensajes');
		chat_usuarios = db.collection('usuarios');
		
		chat_mensajes.find().limit(80).sort({_id:1}).toArray(function(err,result){	
			if(err){
				throw err;
			}				
			//Emitir los mensajes
			client.emit('output',result);
			ActualizarUsuarios();
		});
		
		client.on('unir',function(nombre){
			client.nickname = nombre;
			
			var fecha = new Date();
			var objeto = {nickname: nombre,estado: true, fecha: fecha};
			chat_usuarios.insertOne(objeto,function(err,res){
				if (err) {
					throw err;
				}else{
					console.log(client.nickname+' se ha conectado.');
					ActualizarUsuarios();
				}
			});
		
			client.broadcast.emit('unir', client.nickname);
		});
	
	
		client.on('disconnect', function(){
			
			var query = {nickname: client.nickname};
			chat_usuarios.updateOne(query,{$set: {estado: false}},function(err,res){
				if (err) {
					throw err;
				}else{
					console.log(client.nickname+' se ha desconectado');
				}
			});
			ActualizarUsuarios();
			client.broadcast.emit('borrar', client.nickname);
		});
	
		client.on('mensajes', function(datos){
			//client.broadcast.emit('mensajes', datos);
			var fecha = new Date();
			var name =datos.nickname;
			var message=datos.mensaje;
			
			if (name=="" || message==""){
				
				
			}else{
				
				chat_mensajes.insert({nickname:name,mensaje:message,fecha:fecha},function(){
					client.broadcast.emit('output',[datos]);
				});
			}
			
			ActualizarUsuarios();	
		});
		
		client.on('nuevo usuario', function(nombre){
			chat_usuarios.find({estado: true}).toArray(function(err,res){
				if (err) {throw err;}
				if (res[25]!=undefined) {
					client.emit('limite usuarios',nombre);
				}else{
					
					chat_usuarios.find({nickname: nombre}).toArray(function(err,res){
						if (err) {throw err;}
						if (res[0]!=undefined) {
							client.emit('usuario no valido',res[0].nickname);
						//console.log(res[0].nickname);
						}else{
							client.emit('usuario valido',nombre);
							console.log('adiosssssss');
						}
					});
					ActualizarUsuarios();			
				}
			});		
		});
		
		client.on('escribiendo', function(datos){
			if(datos.escribiendo){
				client.broadcast.emit('usuario escribiendo',datos.nickname);
				console.log('escribiendo');
			}else{
				client.broadcast.emit('usuario no escribiendo',datos.nickname);
				console.log('no escribiendo');
			}
		});
		
		/* socket.on('escribiendo', function () {
			socket.broadcast.emit('escribiendo', {
			  username: socket.nickname
			});
		});
		socket.on('no escribiendo', function () {
			socket.broadcast.emit('no escribiendo', {
			  username: socket.nickname
			});
		 }); */
		
		function ActualizarUsuarios(){
			chat_usuarios.find({estado: true}).sort({nickname:1}).toArray(function(err,res){			
				if (err) {throw err;}
				var users = '';
				for (var i=0;i<res.length;i++){
				
						var par = '<li><p>'+res[i].nickname+'</p></li>';
						users=users+par;

				}
				client.emit('refrescar usuarios',users);
				client.broadcast.emit('refrescar usuarios',users);
			});
		}
		
		
	});
	
	
});


app.get('/',function(request,response){
	response.sendFile(path.join(__dirname, '/public', 'chat.html'));
});

app.get('/chat',function(request,response){
	response.sendFile(path.join(__dirname, '/public', 'chat.html'));
});

	
	
server.listen(port);
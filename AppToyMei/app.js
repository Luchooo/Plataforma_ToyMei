"use strict";
var express 		= 	require("express"),
	app				= 	express(),
	cons 			=	require("consolidate"),
	puerto 			= 	8082 || 8000,
	bodyParser 		= 	require('body-parser'),
	passport 		= 	require('passport'),
	LocalStrategy 	= 	require('passport-local').Strategy,
	cookieParser 	= 	require('cookie-parser'),
	session 		= 	require('express-session'),
	bcrypt 			= 	require('bcrypt-nodejs'),
	db   			= 	require('./modulos/database'),
	rutas			=	require('./modulos/rutas'),
	mailer 			= 	require('express-mailer'),
	fs 				= 	require('fs'),
	config 			= 	JSON.parse(fs.readFileSync('config.json', 'utf8'));

	//console.log(config.mail.user);
	//Realizar la conexión a la base de datos Mysql.....
		//Realizar la conexión a la base de datos Mysql.....
	db.conectaDatabase();
	//Para el manejo de autenticación...
	passport.use(new LocalStrategy(function(username, password, done)
	{
		var sql = "select password, correo from pacientes WHERE correo = '" + (username) + "' and eliminado = 0";
		db.queryMysql(sql, function(err, response)
		{
			if (err || response.length === 0 || !bcrypt.compareSync(password, response[0].password))
			{
				return done(null, false, {message: 'Usuario o contraseña no válido', usuario : username});
			}
			return done(null, response);
		});
	}));

	passport.serializeUser(function(user, done)
	{

		//console.log(user[0]);

	    done(null, user[0].correo);
	});

	passport.deserializeUser(function(username, done)
	{
		var sql = "select id, nombre from pacientes WHERE correo = '" + (username) + "' and eliminado = 0";
		//console.log(sql)

		db.queryMysql(sql, function(err, response)
		{
			if(response)
			{
				done(null, response);
			}
		});
	});


	//consolidate integra swig con express...
	app.engine("html", cons.swig); //Template engine...
	app.set("view engine", "jade");
	app.set("views", __dirname + "/vistas");
	app.use(express.static('public'));
	//Para indicar que se envía y recibe información por medio de Json...
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	//Para el manejo de las Cookies...
	app.use(cookieParser());
	app.use(session({
						name : 'cookiePaciente',
						secret: 'pacienteSecreto',
						cookie: { maxAge: 24 * 60 * 60 * 1000  }, // 24 hours
						resave: true,
						saveUninitialized: true
					}));
	
	//app.use(session({secret: 'muysecreto'}));
	app.use(passport.initialize());
	app.use(passport.session());

	//Para el manejo del correo electrónico...
	mailer.extend(app, {
		from: 'todo@udec.com',
		host: 'smtp.gmail.com', // hostname
		secureConnection: true, // use SSL
		port: 465, // port for secure SMTP
		transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
		auth:
		{
	    	user: config.mail.user,
	    	pass: config.mail.password
	  	}
	});
	//Fin de la Configuración para el correo electrónico...



	//Rutas/Servicios REST
	app.get("/", rutas.index);
	//Mostrar la página de autenticación...
	app.get("/login", rutas.login);
	//Para realizar el proceso de autenticación...
	app.post('/login', rutas.loginPost);
	//Para cerrar la sesión..
	app.get("/logout", rutas.logout);
	//Traer todas las tareas...
	app.get('/getAllTask', rutas.getAllTask);

	//Insertar informe 
	app.post('/enviarIdEjercicio/insertarInforme', rutas.insertarInforme);


	//Actualizar ejercicio al finalizar correctamente
	app.put('/enviarIdEjercicio/updateEjercicioFinalizado', rutas.updateEjercicioFinalizado);


	//Mostrar vista cambiar contraseña
	app.get('/change_password', rutas.change_password);



	//Mostrar vista no hay Ejercicios
	app.get('/ceroEjercicios', rutas.ceroEjercicios);


	
	// Enviar contraseñas para guardar
	app.post("/cambiar_password", rutas.cambiar_password);

	app.get('/traerDatos_Paciente', rutas.traerDatos_Paciente);


	//Traer vista de olvido su contraseña
	app.get("/olvido_contrasena", rutas.olvido_pass);



	//Validar correo para recuperar contraseña
	app.post("/validar_correo", rutas.validar_correo);


	app.get('/enviarIdEjercicio/:id', rutas.enviarIdEjercicio);

app.post("/ejercicioEliminado", rutas.ejercicioEliminado);


 //trae las cordenadas dado el ID del ejercicio
app.post('/enviarIdEjercicio/traerCoordenadas', rutas.traerCoordenadas);



	

	//Para realizar el envío de un email..
	app.post('/mail', function (req, res, next)
	{
		

			var data = req.body;

			if (data.tipo === "cambiar_contrasena_paciente")
			 {
				var txtMsg = "Cordial saludo " + data.nombre + ", se ha cambiado de contraseña recientemente, las credenciales para ingresar a la App ToyMei han cambiado, Usuario: " + data.correo +" ,Contraseña nueva es: " + data.contrasena + " ,cambio de contraseña exitoso :)."; 
				//console.log(txtMsg);
				app.mailer.send('mail',
				{
					to: data.correo,
					subject: 'ToyMei - Cambio de contraseña reciente - Paciente',
					text: txtMsg
				},
				function (err)
				{
					if (err)
					{
						res.json
					({
					  status  : false,
					  correo  : data.correo
					});
						return;
			    	}
					res.json
					({
					  status  : true,
					  correo  : data.correo
					});
				});
			 };


		if (req.body.tipo === "restablecer_password_paciente")
		 {
		 	
		 	var data = req.body;
			var txtMsg = "Cordial saludo " + data.nombre + ", las credenciales para ingresar a la App ToyMei han cambiado, Usuario: " + data.correo +" ,Contraseña nueva es: " + req.body.contrasena + " ,recuerda cambiarla en el menu principal."; 
			
			//console.log(txtMsg);

			app.mailer.send('mail',
			{
				to: req.body.correo,
				subject: 'ToyMei - Restablecer contraseña - Paciente',
				text: txtMsg
			},
			function (err)
			{
				if (err)
				{
					res.json
				({
				  status  : false,
				  correo  : req.body.correo
				});
					return;
		    	}
				res.json
				({
				  status  : true,
				  correo  : req.body.correo
				});
			});
		}
	});






	//Para cualquier url que no cumpla la condición...
	app.get("*", rutas.notFound404);
	//Iniciar el Servidor...
	var server = app.listen(puerto, function(err) {
	   if(err) throw err;
	   var message = 'Servidor corriendo en @ http://localhost:' + server.address().port;
	   console.log(message);
	});

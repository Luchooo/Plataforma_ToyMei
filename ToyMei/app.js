"use strict";
var express 		= 	require("express"),
	app				= 	express(),
	cons 			=	require("consolidate"),
	puerto 			= 	8081 || 3000,
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
	db.conectaDatabase();
	//Para el manejo de autenticación...
	passport.use(new LocalStrategy(function(username, password, done)
	{
		//console.log("ENTRO A MIRAR LOGIN PLATAFORMA")

		var sql = "select clave, usuario from users WHERE usuario = '" + (username) + "'";
		db.queryMysql(sql, function(err, response)
		{
			if (err || response.length === 0 || !bcrypt.compareSync(password, response[0].clave))
			{
				return done(null, false, {message: 'Usuario o contraseña no válido', usuario : username});
			}
			return done(null, response);
		});
	}));

	passport.serializeUser(function(user, done)
	{
	    done(null, user[0].usuario);
	});

	passport.deserializeUser(function(username, done)
	{
		var sql = "select idusuario, nombre from users WHERE usuario = '" + (username) + "'";
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
	//Para indicar que se envía y recibe información por medio de Json... con capacidad de 50mb
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



	//Para indicar que se envía y recibe información por medio de Json...
//	app.use(bodyParser.json());
//	app.use(bodyParser.urlencoded({extended: true}));
	//Para el manejo de las Cookies...
	

	//Para indicar que se envía y recibe información por medio de Json... con capacidad de 50mb
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


	app.use(cookieParser());
	app.use(session({
						name : 'cookieMedico',
						secret: 'medicoSecreto',
						cookie: { maxAge: 24 * 60 * 60 * 1000 }, //24 horas
						resave: true,
						saveUninitialized: true
					}));
	
	//app.use(session({secret: '$2a$10$GsvafBLCODG.gUNlB987fORJjTiwjiKs42MjAIqTMB3lour44n39K'}));
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
	//Para mostrar la vista de registro..
	app.get("/registrolol", rutas.registro);
	//Para guardar el usuario...
	app.post("/registroPost", rutas.registroPost);


	//Guardar en la BD los datos del ejercicio
	app.post("/insertarEjercicio", rutas.insertarEjercicio);
	
	// Traer vista cubos
	
	app.get("/vista_cubos", rutas.vistaCubos);


	// TraerDAtos actualziados por ID
	app.post("/datosActualizados", rutas.datosActualizados);

	
	//Vista no hay reportes
	app.get("/noHayReportes", rutas.noHayReportes);


	// Enviar contraseñas para guardar
	app.post("/cambiar_password", rutas.cambiar_password);



	//Olvido contraseña
	app.get("/olvido_contrasena", rutas.olvido_pass);

	//Validar correo para recuperar contraseña
	app.post("/validar_correo", rutas.validar_correo);

	//Mostrar vista registrar pacientes
	app.get("/Mostrar_vista_pacientes", rutas.vista_pacientes);


	//Mostrar Vista Reportes
	app.get("/Reportes", rutas.Reportes);



	app.post('/createRegistro123', rutas.createRegistro);
	//*************EJERCICIO********************
	//Mostrar Vista AsignarEjercicio
	app.get("/AsignarEjercicio", rutas.AsignarEjercicio);

	
	//******************************************
	//Traer todas los pacientes x medico
	app.get('/traerPersonas', rutas.traerPersonas);



	//Validar que un medico no exista en la base de datos
	app.post('/registroExiste', rutas.registroExiste);

	//Traer la vista para editar ejercicios
	app.get('/Editar_Ejercicios', rutas.vista_Editar_Ejercicios);


	//Trae todos los ejercicios asignados por el medico
	app.get('/traerEjercicios', rutas.traerEjercicios);



	//TraerPersona relacionadas con la cantidad de informes que cada uno tiene no importa que este sea malo o bueno
	app.get('/traerPersonasxNoInformes', rutas.traerPersonasxNoInformes);


	//Vista cero ejercicios
	app.get('/ceroEjercicios', rutas.ceroEjercicios);




	//Traer Email y Passwod de paciente
	app.post('/traerEmailandPass', rutas.traerEmailandPass);

	//Actualizar registro de usuario

	app.put('/updateUsuario', rutas.updateRegistro);


	//Actualizar ejercicio
	app.put('/updateEjercicio', rutas.updateEjercicio);

	

	//Traer datos MEDICO - PACIENTE - EJERCICIOS REALIZADOS para generar el reprote del PDF
	app.post('/traerDatosPaciente', rutas.traerDatosPaciente);

	app.post('/traerDatosInforme', rutas.traerDatosInforme);


	app.get('/Datos_Medico', rutas.Datos_Medico);



	app.get('/traerDatos_Medico', rutas.traerDatos_Medico);

	app.post('/traerDatosPorEjercicio', rutas.traerDatosPorEjercicio);
	


	//Mostrar vista cambiar contraseña
	app.get('/change_password', rutas.change_password);


	//Eliminar de forma logica el registro de un paciente
	app.put('/eliminarUsuario', rutas.eliminarUsuario);


	//Eliminar de forma logica eun ejercicio del paciente
	app.put('/eliminarEjercicio', rutas.eliminarEjercicio);
	

	app.put('/cambiarContrasena', rutas.cambiarContrasena);





	app.post('/mail', function (req, res, next)
	{	
		var data = req.body;
			
		
		if (data.tipo === "cambiar_contrasena")
		 {
			var txtMsg = "Cordial saludo " + data.nombre + ", se ha cambiado de contraseña recientemente, las credenciales para ingresar a la plataforma ToyMei han cambiado, Usuario: " + data.usuario +" ,Contraseña nueva es: " + data.contrasena + " ,recuerda cambiarla en el menu principal."; 
			//console.log(txtMsg);
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Cambio de contraseña reciente',
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

		 if (data.tipo === "informar_pacienteEliminadoEjercicio")
		 {
		 	
			var txtMsg = "Cordial saludo " + data.nombre + ", tu fisoterapeuta " + req.user[0].nombre +" ha eliminado un ejercicio recientemente. !Un ejercicio menos :)!"; 
			//console.log(txtMsg);
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Informe Ejercicio eliminado',
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



		 if (data.tipo === "informar_paciente_new_ejercicio")
		 {
			var txtMsg = "Cordial saludo " + data.nombre + ", tienes un nuevo ejercicio :)"; 
			//console.log(txtMsg);
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Nuevo Ejercicio',
				text: txtMsg
			},
			function (err)
			{
				if (err)
				{
					res.json
				({
				  status  : false,
				  nombre  : data.nombre,
				  correo  : data.correo
				});
					return;
		    	}
				res.json
				({
				  status  : true,
				  nombre  : data.nombre,
				  correo  : data.correo
				});
			});
		 };



		 if (data.tipo === "Bienvenido")
		 {
			var txtMsg = "Cordial saludo " + data.nombre + ", te damos la bienvenida a ToyMei, las credenciales para ingresar a la plataforma ToyMei son, Usuario: " + data.usuario +" ,Contraseña es: " + data.contrasena + " ."; 
			//console.log(txtMsg);
			
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Bienvenid@ ' + data.nombre,
				text: txtMsg
			},
			function (err)
			{
				if (err)
				{
					res.json
				({
				  status  : false
				});
					return;
		    	}
				res.json
				({
				  status  : true
				});
			});
		 };


		  if (data.tipo === "informar_pacienteOldEmail")
		 {
			var txtMsg = "Cordial saludo " + data.nombre +" "+ data.apellido + ", tu usuario de ingreso a la AppToyMei a cambiado, debido a que tu correo a sido actualizado por el fisioterapeuta " + req.user[0].nombre +". Revisa la bandeja de entrada del siguiente correo: "+ data.correoNuevo + " para encontrar las nuevas credenciales de acceso."; 
			//console.log(txtMsg);
			
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Cambio de Usuario AppToyMei ' + data.nombre +" "+ data.apellido,
				text: txtMsg
			},
			function (err)
			{
				if (err)
				{
					res.json
				({
				  status  : false
				});
					return;
		    	}
				res.json
				({
				  status  : true
				});
			});
		 }



		  if (data.tipo === "informar_pacientenewEmail")
		 {
			var txtMsg = "Cordial saludo " + data.nombre +" "+ data.apellido + ", el siguiente correo es para informar las credenciales para el acceso a la App ToyMei, podra hacerlo con los siguientes datos,  Usuario: " + req.body.correo + " Contraseña: "+ req.body.contrasena +" ,recuerda cambiarla en el menú principal. Por favor no responder este correo."; 
			//console.log(txtMsg);
			
			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Cambio de Usuario AppToyMei - Credenciales nuevas ' + data.nombre +" "+ data.apellido,
				text: txtMsg
			},
			function (err)
			{
				if (err)
				{
					res.json
				({
				  status  : false
				});
					return;
		    	}
				res.json
				({
				  status  : true
				});
			});
		 }












		if (req.body.tipo === "informar_paciente")
		 {

		 	//console.log("Entro a informar paciente");

		 	var txtMsg = "Cordial saludo " + req.body.nombre + ", el siguiente correo es para informar las credenciales para el acceso a la App ToyMei, podra hacerlo con los siguientes datos,  Usuario: " + req.body.correo + " Contraseña: "+ req.body.contrasena +" ,recuerda cambiarla en el menú principal. Por favor no responder este correo."; 
			
			//console.log(txtMsg);

			app.mailer.send('mail',
			{
				to: req.body.correo,
				subject: 'ToyMei - Información User and Pass',
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
		 };


		 if (req.body.tipo === "restablecer_password")
		 {
		 	//console.log("Entro a enviarle contraseña al medico");
		 	
		 	var data = req.body;
			var txtMsg = "Cordial saludo " + data.nombre + ", las credenciales para ingresar a la plataforma ToyMei han cambiado, Usuario: " + data.usuario +" ,Contraseña nueva: " + req.body.contrasena + " ,recuerda cambiarla en el menu principal."; 
			//console.log(txtMsg);

			app.mailer.send('mail',
			{
				to: req.body.correo,
				subject: 'ToyMei - Restablecer contraseña',
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



		if (req.body.tipo === "enviarPDF")
		 {




		 	
		 	var data = req.body;
	 	var pdf = data.pdf;

		
		
        if ( data.opcion === "paciente") 
        {
        	var txtMsg = "Cordial saludo " + data.nombrePaciente + ", el medico " +  data.nombreMedico +" ha compartido con tigo el informe de ejercicios desarrollados en la App ToyMei por usted."; 
			
        }
        if ( data.opcion === "otra_persona")
        {
        	var txtMsg = "Cordial saludo " + data.correo + ", el medico " +  data.nombreMedico +" ha compartido con tigo el informe de ejercicios desarrollados en la App ToyMei por " + data.nombrePaciente + "."; 
			
        }
			
		//console.log(txtMsg);

/*
			Enviar imagen
			var imagen = 'data:image/jpeg;base64,/9j/4AAQSkZ...etc'
			contents: new Buffer(imagen.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64')
*/

/*
			Enviar PDF
			var pdf="data:application/pdf;base64,JVBER....etc"
			contents: new Buffer(pdf.replace(/^data:application\/(pdf);base64,/,''), 'base64')
*/

			app.mailer.send('mail',
			{
				to: data.correo,
				subject: 'ToyMei - Informe Paciente ' + data.nombrePaciente,
				text: txtMsg,
				attachments: [  
						        {   
						            filename: 'Reporte '+ data.nombrePaciente +'.pdf',
            						contents: new Buffer(pdf.replace(/^data:application\/(pdf);base64,/,''), 'base64')
						        }   
						      ]

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

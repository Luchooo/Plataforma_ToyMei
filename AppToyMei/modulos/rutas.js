var bcrypt          = 	require('bcrypt-nodejs'),
    passport 	    = 	require('passport'),
    db   		    = 	require('./database'),
	date 			= 	new Date(),
	fechaActual     =   date.getDate()  + '/' + (date.getMonth()+1)  + '/' +  date.getFullYear();
    db.conectaDatabase();

//Crear un token único relacionado al ID de la tarea...
var guid = function()
{
	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var token = function()
{
	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4();
}

var index = function(req, res)
{
	if(!req.isAuthenticated())
    {

        res.redirect('/login');
    }
    else
    {

    	  // Cookies that have not been signed
		//  console.log('Cookies: ', req.cookies)

		  // Cookies that have been signed
		 // console.log('Signed Cookies: ', req.signedCookies)

        var user = req.user;
		res.render("index", 
		{
			titulo 	:  	"ToyMei - App",
			usuario	:	user[0].nombre
		});
    }
};

var login = function(req, res)
{
	res.render("login", {
		titulo 	:  	"ToyMei - App"
	});
};





var ceroEjercicios = function(req, res)
{

	if(req.isAuthenticated())
	{
		res.render("ceroEjercicios", 
		{
			usuario	:	req.user[0].nombre
		});
	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}

};






var enviarIdEjercicio = function(req, res)
{
	    res.render("vista_juego", 
		{
			id_ejercicio : req.params.id
		});
	

};



var change_password =  function(req, res)
{
	if(req.isAuthenticated())
	{

		var user = req.user;
		res.render("change_password", 
		{
			titulo 	:  	"Cambiar contraseña"
		});
	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}
	
};

var loginPost = function (req, res, next)
{
	passport.authenticate('local', {
	successRedirect: '/index',
	failureRedirect: '/login'},
	function(err, user, info)
	{
		if(err)
		{
			return res.render('login', {titulo: 'ToyMei - App', error: err.message});
		}
		if(!user)
		{
			return res.render('login', {titulo: 'ToyMei - App', error: info.message, usuario : info.usuario});
		}
		return req.logIn(user, function(err)
		{
			if(err)
			{
				return res.render('login', {titulo: 'ToyMei - App', error: err.message});
			}
			else
			{
				return res.redirect('/');
			}
		});
	})(req, res, next);
};

var logout = function(req, res)
{
	
		if(req.isAuthenticated())
	{
		req.logout();
    }
	res.redirect('/login');
   
}




var getAllTask =  function(req, res)
{
	
		if(req.isAuthenticated())
		{
			var sql = "select * from ejercicio where id_paciente = '" + req.user[0].id +"' and eliminado = 0 and termino = 0";
			//console.log(sql);
			db.queryMysql(sql, function(err, data)
			{
				if (err) throw err;
				res.json(data);
			});

		}
		else
		{
			res.status(404).send("Página no encontrada :( en el momento");
		}
	
};

var cambiar_password= function (req, res)
{	

	if(req.isAuthenticated())
	{
		var usuario = req.user[0];
		var data = req.body;
		
		var sql = "update pacientes SET password = '" + bcrypt.hashSync(data.password) + "' WHERE id = '"+ usuario.id + "'";
		//console.log(sql);


		db.queryMysql(sql, function(err, response)
		{
			if (err) throw err;
			var delay = 4000;
            
            setTimeout(function()
            { 
				
         
			res.render("index", 
			{
				titulo 	:  	"ToyMei - App",
				usuario	:	usuario.nombre
			});


            }, delay);
		});

	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}
	
};


var traerDatos_Paciente =  function(req, res)
{
	if(req.isAuthenticated())
	{
		var usuario = req.user[0].id;
		var sql = "select nombre as nombre , apellido as apellido, correo as correo from pacientes where id = '" + usuario+"'";

		//console.log(sql)

		db.queryMysql(sql, function(err, response){
				

		if (err) throw err;
			//Retorneme data
			res.json({ 
						nombre 		: response[0].nombre,
						apellido	: response[0].apellido,
						email 		: response[0].correo
					});
		});
	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}
};


var olvido_pass =  function(req, res)
{
	res.render("olvido_contrasena", 
	{
		titulo 	:  	"¿Olvidaste tu contraseña?"
		
	});

};


var traerCoordenadas =  function(req, res)
{
	if(req.isAuthenticated())
	{
		
		var data = req.body;

		var sql = "select id_paciente,id_ejercicio,id_medico, tiempo, repeticiones, tipo, coordenadas from ejercicio where id_ejercicio = '" + data.id_ejercicio +"'";
		//console.log(sql);
		db.queryMysql(sql, function(err, respuesta){
			if (err) throw err;

			//console.log(respuesta)
			res.json
			({
				tiempo : respuesta[0].tiempo,
				repeticiones : respuesta[0].repeticiones,
				tipo 		 : respuesta[0].tipo,
				coordenadas  : respuesta[0].coordenadas,
				id_medico	 : respuesta[0].id_medico,
				id_ejercicio : respuesta[0].id_ejercicio,
				id_paciente  : respuesta[0].id_paciente
			});
		});

	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}
	
};









var ejercicioEliminado = function (req,res) 
{

	if(req.isAuthenticated())
	{
			var data = req.body;
			var sql  = "";
			sql = "select ejercicio.eliminado from ejercicio where ejercicio.id_ejercicio = '" +data.id_ejercicio + "'";													
			//console.log(sql)	
			db.queryMysql(sql, function(err, response)
			{
				console.log(response[0]);
				if (err) throw err;
				res.json(response[0])
			});
	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}

}




var updateEjercicioFinalizado = function (req,res) 
{
	if(req.isAuthenticated())
	{
			var data = req.body;
			var sql  = "";
			sql = "UPDATE ejercicio SET " + "termino" 	 + " = 1" + 
												" WHERE id_ejercicio = '"+ data.id_ejercicio + "'";													
			console.log(sql)	
			db.queryMysql(sql, function(err, response)
			{
				if (err) throw err;
				res.json({
							status	: true
						})
			});

	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}


}




var insertarInforme = function(req,res)
{

    if(req.isAuthenticated())
	{

	var data = req.body;
    //console.log("Entro")

	//se esta creando un nuevo paciente...			
	var id = guid();
	var sql ="";
	sql = "INSERT INTO informes (id_informe, id_medico, id_ejercicio, id_paciente, fecha_inicio, fecha_finalizacion, termino_correctamente, observaciones, date) " +
	  "VALUES ('" + id 		 		 		     + "', '" + 
	  				data.id_medico   		  	 + "', '" +
	  		        data.id_ejercicio   	   	 + "', '" +
	  		   		data.id_paciente 		  	 + "', '" +
	  		   		data.fecha_inicio	 	  	 + "', '" +
	  		   		data.fecha_finalizacion	 	 + "', '" +  
	  		   		data.termino_correctamente	 + "', '" +
	  		   		data.observaciones       	 + "', '" +  
	  		   		data.date        	         + "')";

	//console.log(sql)

	db.queryMysql(sql, function(err, response)
			{
				if (err) throw err;
				res.json({
							status	: true,
							id_ejercicio : data.id_ejercicio
						})
			});

	}
	else
	{
		res.status(404).send("Página no encontrada :( en el momento");
	}

	
};




var validar_correo = function(req, res)
{

	
		var data = req.body;
		//console.log("El correo es: " + data.correo);
		var status;
			
		var sql = "select nombre as nombre, correo as email from pacientes where correo = '" + data.correo + "' and eliminado = 0";
		//console.log(sql)
		db.queryMysql(sql, function(err, response)
		{
			var encontro=response.length;

			//console.log("Encontro " + response.length);
			if (encontro === 1) 
			{
				var nombre = response[0].nombre;
				//console.log("El correo "+ data.correo+" si existe.");
				status=true;
				var contrasena_nueva = token();
				//console.log("Se va enviar a este correo: " + data.correo);

				var sql = "update pacientes SET password = '" + bcrypt.hashSync(contrasena_nueva) + "' WHERE correo = '"+ data.correo + "'";
				//console.log(sql);
				db.queryMysql(sql, function(err, response)
				{
					if (err) throw err;
					res.json({
								status 			 : status,
								contrasena_nueva : contrasena_nueva,
								correo 			 : data.correo,
								nombre       	 : nombre
							})
				});
			}
			else
			{
				//console.log("El correo "+ data.correo +" NO existe.");
				status=false;
				res.json({
							status : status,
							correo : data.correo
						})		
			};
		
		});	
	
};





var notFound404 = function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
};

//Crear o edita un usuario...

//Exportar las rutas...
module.exports.index = index;
module.exports.login = login;
module.exports.loginPost = loginPost;
module.exports.logout = logout;
module.exports.getAllTask = getAllTask;
module.exports.notFound404 = notFound404;
module.exports.enviarIdEjercicio = enviarIdEjercicio;

//Exportar metodo para UPDATE de contraseña
module.exports.cambiar_password = cambiar_password;

//Enviar los datos del paciente  la vista change password para enviar un correo informando del cambio de contraseña
module.exports.traerDatos_Paciente = traerDatos_Paciente;


//Mostrar vista olvido su contraseña
module.exports.olvido_pass = olvido_pass;

//Post para validar el correo
module.exports.validar_correo = validar_correo;

//Vista ceroEjercicios
module.exports.ceroEjercicios = ceroEjercicios;


module.exports.traerCoordenadas = traerCoordenadas;
module.exports.change_password = change_password;

module.exports.insertarInforme = insertarInforme;

module.exports.updateEjercicioFinalizado = updateEjercicioFinalizado;

module.exports.ejercicioEliminado = ejercicioEliminado;
















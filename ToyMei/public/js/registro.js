jQuery(document).ready(function($) 
{
    

    var delay = 700;
          setTimeout(function(){  $(".wait").fadeOut('slow'); }, delay);

    var campos = ["nombre", "correo", "username", "password"];
    

        function registroExiste (datos,callback) 
    {



        var data = {};
        data.correo = datos.correo;
        data.username = datos.usuario;
        $.ajax(
        {
            url         : "registroExiste",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
          callback(data);

        }).error(function(request, status, error)
        {
            
             sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";

            
        });

    }



        function insertarDatos(datos,callback) 
        {


        var data = {};
        data.correo = datos.correo;
        data.password = datos.contrasena;
        data.nombre = datos.nombre;
        data.username = datos.usuario;



        $.ajax(
        {
            url         : "registroPost",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
             $("#cargando").fadeOut('slow');
          //console.log("Registro exitoso")
          callback(data);
        }).error(function(request, status, error)
        {
            

         window.location = "/"
    
   

            
        });

    }




$(".pr-password").passwordRequirements();




     function enviarMensajeBienvenida (datos,callback) 
    {

        $("#form").hide();
        $("#imagen").hide();
        $("#banner").hide();
        $("#link").hide();

        $("body").css({
                        "background-color" : '#009688',
                        "font-family"  : 'arial'
        });
        $("#letreroAutenticarme").hide();
         $("#cargando").fadeIn('slow');


     
        var data = {};
        data.correo = datos.correo;
        data.contrasena = datos.contrasena;
        data.tipo = datos.tipo;
        data.nombre = datos.nombre;
        data.usuario = datos.usuario;
        $.ajax(
        {
            url         : "mail",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
             
            callback(data);

            

        }).error(function(request, status, error)
        {
            

            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }



$('#guarda').click(function(event) {
        
        var enviaForm = true; 
        
        for(var i = 0; i < campos.length; i++)
        {
            if($("#" + campos[i]).val().length === 0)
            {
                swal
                    ({  

                      title   : "Completar campos",   
                      text    : "Por favor completa el campo " + campos[i],   
                      type    : "error",  
                      confirmButtonColor: "#1fce6d"
                    });
                enviaForm = false;
                break;
            }
        }
        if(enviaForm)
        {
            //Validar que el e-mail sea válido...
            if(!validaEmail($("#correo").val()))
            {
                enviaForm = false;
                swal
                    ({  

                      title   : "Correo inválido",   
                      text    : "El correo "+($("#correo").val())+", no es válido",   
                      type    : "error",  
                      confirmButtonColor: "#1fce6d"
                    });
            }
            if(!validaPassword($("#password").val()))
            {
                swal
                    ({  

                    title   : "Oops :(",   
                    text    : "La contraseña no cumple con los requerimientos solicitados.",   
                    type    : "error",  
                    confirmButtonColor: "#1fce6d"
                    });

                $("#password").val("");
                enviaForm = false;
            }


            if(enviaForm)
            {

                registroExiste({"usuario" : $("#username").val(), "correo" : $("#correo").val() },function(data)
                            {
                              
                              // console.log("Existe: " + data.status)
                                

                                if(!data.status)
                                {
                                    enviarMensajeBienvenida({"contrasena": $("#password").val() ,"usuario" : $("#username").val() ,"nombre" : $("#nombre").val(),  "correo" : $("#correo").val(), "tipo": "Bienvenido"},function(data)
                                    {

                                      //  console.log("Envio correo: " + data.status)
                                        
                                        if(data.status)
                                        {   


                                            insertarDatos({"contrasena": $("#password").val(),"usuario" : $("#username").val() , "nombre" : $("#nombre").val(),"correo" : $("#correo").val()},function(data)
                                            {

                                              //Se guardaron los datos correctamente   
                                                if(data.status)
                                                {   

                                                    swal
                                                    ({   
                                                        title   : "!Nice Job! :)",   
                                                        text    : "Bienvenido a ToyMei " + $("#nombre").val(),   
                                                        timer   : 2000,
                                                        type    : "success",  
                                                        showConfirmButton: false 
                                                    });
                                                }

                                                else
                                                {
                                                    swal("Error!", "No se puedieron guardar los datos" , "error");
                                                    
                                                }
                                            });

                                        }

                                        else
                                        {
                                            $("#letreroAutenticarme").show();
                                            swal("Error!", "Falla al enviar el email" , "error");
                                            
                                        }
                                    });
                                }

                                else
                                {

                                    swal
                                    ({  
                                        title   : "!Oops!",   
                                        text    : "El usuario o correo ya existe.",   
                                        type    : "error",  
                                        confirmButtonColor: "#1fce6d"
                                    });

                                    $("#correo").val("");
                                    $("#username").val("");
                                    
                                }
                            

                            });
            }
        }
        






    });
    
    var validaEmail = function(email)
	{
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        return emailReg.test(email);
	};

    var validaPassword = function(password)
    {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
        return regex.test(password);
    };

    

   

});

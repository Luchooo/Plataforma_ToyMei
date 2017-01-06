$(document).ready(function() {
    
    var delay = 500;
    setTimeout(function(){  $(".loading").fadeOut('slow'); }, delay);

   


    $("#correo").focus();

    function enviarCorreo (callback) 
    {
        var data = {};
        data.correo = $("#correo").val();

        $.ajax(
        {
            url         : "validar_correo",
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


    function enviarContrasena (datos,callback) 
    {

        $(".loading").fadeIn('slow');
        var data = {};
        data.correo = datos.email;
        data.contrasena = datos.contrasena;
        data.tipo = datos.tipo;
        data.nombre = datos.nombre;
        

        $.ajax(
        {
            url         : "mail",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            $(".loading").fadeOut('slow');
            callback(data);
            //console.log(data.status)

        }).error(function(request, status, error)
        {
            

            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }




            
$("#enviar").click(function(event)
    {
        var enviaForm = true;
        var campos = ["correo"];
            if($("#correo").val() === "")
            {

                swal
                    ({  

                      title   : "Oops",   
                      text    : "Por favor completa el campo " + campos[0],   
                      timer   : 2000,
                      type    : "error",  
                      showConfirmButton: false 
                    });
                enviaForm = false;
                
            }
       
        if(enviaForm)
        {
            //Validar que el e-mail sea válido...
            if(!validaEmail($("#correo").val()))
            {
                
                swal
                    ({  

                      title   : "Oops",   
                      text    : "El correo "+($("#correo").val())+", no es válido",   
                      timer   : 2000,
                      type    : "error",  
                      showConfirmButton: false 
                    });
                $("#correo").val("");
                $("#correo").focus();
                enviaForm = false;
            }
            
        }
        if (enviaForm) 
            {
                enviarCorreo(function(data)
                {
                 
                 if(!data.status)
                    {
                                               
                        swal
                        ({  

                            title   : "Oops :(",   
                            text    : "El correo " + data.correo + " no existe en nuestras bases de datos.",   
                            timer   : 2000,
                            type    : "error",  
                            showConfirmButton: false 
                        });
                    

                    }
                    else
                    {
                        
                        
                        enviarContrasena({"nombre": data.nombre,"contrasena"  : data.contrasena_nueva, "email" : data.correo, "tipo" : "restablecer_password_paciente"}, function(data)
                            {
                                if(data.status)
                                {
                                    //event.preventDefault();
                                    swal
                                    ({   
                                        title   : "!Nice! :)",   
                                        text    : "Se ha enviado el email a: " + data.correo,   
                                        timer   : 2000,
                                        type    : "success",  
                                        showConfirmButton: false 
                                    });
                                    
                                    var delay = 2000;
                                    setTimeout(function(){ window.location = "/login" }, delay);
                                    
                                    
                                }

                                else
                                {
                                    swal("Error!", "No se ha podido enviar el email a: " + data.correo, "error");
                                }
                            });
                        
                    }
                });


            };
    });
    







       

 
    
    var validaEmail = function(email)
	{
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        return emailReg.test(email);
	};
});
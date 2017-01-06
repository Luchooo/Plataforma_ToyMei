$(document).ready(function() {
    
var delay = 500;
                                    setTimeout(function(){ $(".loading").fadeOut('slow');  }, delay);

    
     $(".pr-password").passwordRequirements();

    $("#nueva_contrasena").focus();


    $("#form").submit(function(event)
    {
        
    
        var enviaForm = true;
        var campos = ["nueva_contrasena", "confirmar_contrasena"];
        for(var i = 0; i < campos.length; i++)
        {
            if($("#" + campos[i]).val().length === 0)
            {
                
                 swal
                        ({  

                            title   : "Oops :(",   
                            text    : "Por favor completa el campo " + campos[i],   
                            timer   : 2000,
                            type    : "error",  
                            showConfirmButton: false 
                        });
                $("#" + campos[i]).focus();
                enviaForm = false;
                break;
            }
        }
      
        if(enviaForm)
        {
            
            if(!validaPassword($("#nueva_contrasena").val()))
            {
               
                swal
                        ({  

                            title   : "Oops :(",   
                            text    : "La contraseña no cumple con los requerimientos solicitados.",   
                            timer   : 2000,
                            type    : "error",  
                            showConfirmButton: false 
                        });
                $("#nueva_contrasena").val("");
                $("#confirmar_contrasena").val("");
                enviaForm = false;
            }
            else
            {
               
              
                    if ($("#nueva_contrasena").val() === $("#confirmar_contrasena").val())
                    {
                        
                        traerDatos_Paciente(function(data)
                        {
                            enviarEmailCambio_Password({"contrasena": $("#confirmar_contrasena").val() ,"apellido" : data.apellido ,"nombre" : data.nombre ,  "email" : data.email, "tipo": "cambiar_contrasena_paciente"}, function(respuesta)
                            {

                                 if(respuesta.status)
                                {
                                    swal
                                    ({   
                                        title   : "!Bien! :)",   
                                        text    : "Contraseña cambiada con éxito.",   
                                        timer   : 3000,
                                        type    : "success",  
                                        showConfirmButton: false 
                                    });

                                    var delay = 3000;
                                    setTimeout(function(){ enviaForm = true;  }, delay);

                                                                     
                                }

                                else
                                {
                                    swal("Error!", "No se ha podido enviar el email a: " + respuesta.correo, "error");
                                    var delay = 3000;
                                    setTimeout(function(){ enviaForm = false;  }, delay);
                                }
                            }); 

                         });
                        
                        
                    }
                    else
                    {
                        swal
                                    ({   
                                        title   : "Oops",   
                                        text    : "Las contraseñas no coinciden",   
                                        type    : "error",  
                                        confirmButtonColor: "#ff7600"
                                    });
                       

                       

                       $("#nueva_contrasena").val("");
                       $("#confirmar_contrasena").val("");
                        enviaForm = false;
                    }


            

            }



        }





        return enviaForm;
    });
    

    function enviarEmailCambio_Password (datos,callback) 
    {
         $(".loading").fadeIn('slow');
        var data = {};
        data.correo = datos.email;
        data.contrasena = datos.contrasena;
        data.tipo = datos.tipo;
        data.nombre = datos.nombre + " " + datos.apellido;
        
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

            

        }).error(function(request, status, error)
        {
            

            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }



    
    
    function traerDatos_Paciente (callback)
    {        
        $.ajax(
        {
            url         : "traerDatos_Paciente",
            type        : "GET",
            data        : "",
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        { 
            callback(data);

        }).error(function(request, status, error)
        {
            swal
            ({   
                title   : "Oops :(",   
                text    : request.responseText,   
                timer   : 3000,
                type    : "error",  
                showConfirmButton: false 
            });
            
            var delay = 3000;
            setTimeout(function()
                {  window.location = "/" 
                }, delay);
        });

    }






    var validaPassword = function(password)
    {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        return regex.test(password);
    };

   

});
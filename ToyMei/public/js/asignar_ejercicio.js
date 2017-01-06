jQuery(document).ready(function($) 
{
    

        
  var delay = 700;
  setTimeout(function(){  $(".se-pre-con").fadeOut('slow'); }, delay);
    
   
   var listadoEjercicios = []
   traerEjercicios();
   function traerEjercicios (callback)
    {

    $.ajax(
    {
        url         : "traerEjercicios",
        type        : "GET",
        data        : "",
        dataType    : "json",
        contentType: "application/json; charset=utf-8"
    }).done(function(data)
    { 

      listadoEjercicios=data;
      if (listadoEjercicios.length === 0) 
        {
            $('#edita_ejercicio').hide();
            $('#guarda').css('margin-left', '33%');
        };
     
      //console.log(listadoEjercicios)




    }).error(function(request, status, error)
    {
        sweetAlert("Oops...", request.responseText, "error");
        window.location = "/";
    });
    }






   var patron = /^\d*$/; //Expresión regular para aceptar solo números enteros positivos



    //En el select el valor "0" es para EJERCICIOS
    //En el select el valor "1" es para ESTIRAMIENTO
    var resultadoBusca = []; //Gurda los usuarios que cumplen con el criterio de búsqueda...
   
    $('#repeticionesEjercicio').hide();
    //--> Tareas iniciales
    traerPersonas(); //Traer pacientes
    traervistaCubos();
    //Traer los TO-DO creados...
    todos = [];



    

    $('#help').click(function(event) 
    {
            swal.setDefaults({
                              
                              confirmButtonText: 'Siguiente &rarr;',
                              showCancelButton: true,
                              animation: false,
                              progressSteps: ['1', '2', '3',"4"],
                              confirmButtonColor: '#2e3740',
                              cancelButtonColor: '#1fce6d',
                              cancelButtonText: 'Cancelar'

                            })

        var steps = [
          {
            title: 'Objetivo',
            text: ' Posicionar los cubos alrededor del plano, los cubos serán vistos por tus pacientes en la AppToyMei donde los ubicaste.',
            imageUrl: 'img/intro.gif'
          },
          {
            title: 'Mover cubos',
            imageUrl: 'img/mover_ejes.gif',
                        text: 'Selecciona cualquiera de los ejes y mueve tu mouse. !!El cubo se moverá!!'
          },
          {
            title: 'Agregar cubos',
            imageUrl: 'img/cubos_mas.gif',
            text: 'Oprime el botón (+) si quieres más cubos, si deseas eliminar los cubos oprime el botón (-).'
          },
          {
            title: 'Cámara',
            imageUrl: 'img/click.png',
             imageWidth: 150,
            imageHeight: 130,
            text: 'Con el scroll (rueda) de tu mouse podrás acercar o alejar la cámara, si das click izquierdo sostenido en el plano podrás rotar la cámara.'
          }
        ]

        swal.queue(steps).then(function(result) 
        {
          swal.resetDefaults()
          swal
          ({
            imageUrl: 'img/happy.png',
            imageWidth: 150,
            imageHeight: 100,
            animation: false,
            customClass: 'animated tada',
            text: '!! Espero haber sido de utilidad !!',
            showCancelButton: false,
            timer: 2600,
            showConfirmButton: false
            
          })
        }, function() 
        {
          swal.resetDefaults()
        })

    });







$('#edita_ejercicio').click(function(event) 
{
    window.location = "/Editar_Ejercicios";

 });



    $('#Opciones').change(function(event) {

        if ($('#Opciones').val() === "opcion1" )  
        {

            $('#repeticionesEjercicio').show();
            $("#tiempoEjercicio").attr("placeholder", "Tiempo en segundos");

        }
        else
        {
            $('#repeticionesEjercicio').hide();
            $("#tiempoEjercicio").attr("placeholder", "Tiempo x Cubo segundos");
        }

     //  console.log($('#Opciones').val())
    });
   

    


   


function traervistaCubos(callback)
 {        
    $.ajax(
        {
            url         : "vista_cubos",
            type        : "GET",
            data        : "",
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        })
};


function traerPersonas (callback)
 {        

    //console.log("Entro a traer los pacientes");
        $.ajax(
        {
            url         : "traerPersonas",
            type        : "GET",
            data        : "",
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        { 
            todos = data;
            //console.log(todos);
            //imprimeUsuarios(data);
            muestraTodos(1, 0);
            
           
            $('#todos').addClass('todos');

  
        }).error(function(request, status, error)
        {
            sweetAlert("Oops...", request.responseText, "error");
            var delay = 2000;
            setTimeout(function(){ window.location = "/" }, delay);
        });

    }

 


    var contenidoTabla = function(data, type)
    {
        if(type === 1)
        {
            return "<tr>" +
                        "<td width='10%'><center>" +
                            "<input type = 'radio' name = 'radio' id = '"+(data.id)+"'/>" +
                        "</center></td>" +
                        "<td width='70%'><div>" + (data.nombre)+" "+ data.apellido + "</div>" +
                        "</tr>";
        }
        
        /*
        else
        {
            $("#" + data.id).click(function(event) 
            {
                console.log( $("#" + data.id).val());
                //accionTodo(ind, 1);
            });
        }*/

    };

    //Para listar los trabajos...
    var muestraTodos = function (tipo, index)
    {
        

        //Para mostrar todos los elementos...
        var $txt = "";
        if(tipo === 1)
        {
            $txt = "<table width='94%' border='0' cellspacing='0' cellpadding='0' id = 'tableTodo'>";
            for(var veces = 1; veces <= 2; veces++)
            {
                for(var i = todos.length - 1; i >= 0; i--)
                {
                    muestra = true;

                    for(var c in resultadoBusca)
                    {
                        if(resultadoBusca[c] === i)
                        {
                            muestra = false;
                        }
                    }
                    if(muestra)
                    {

                        if(veces === 1)
                        {
                            $txt += contenidoTabla(todos[i], 1);
                        }
                        else
                        {
                            contenidoTabla(todos[i], 2);
                        }
                    }
                }
                if(veces === 1)
                {
                    $txt += "</table>";
                    $("#todos").html($txt);
                }
            }
        }
        else
        {
            $('#tableTodo').prepend(contenidoTabla(todos[index], 1));
            $("#" + todos[index].id).hide().fadeIn('fast');
            contenidoTabla(todos[index], 2);
        }
    };

 

    var buscarIndice = function(id)
    {
        var ind = -1;
        for(var i = 0; i < todos.length; i++)
        {
            if(todos[i].id === id)
            {
                ind = i;
                break;
            }
        }
        return ind;
    };



function seleccionoPaciente () 
{

    var status = false;
    for (var i = 0; i < todos.length; i++) 
    {
       // console.log(todos[i].id);
        
        if ($('#' + todos[i].id).is(':checked')) 
            {
               // console.log($('#' + todos[i].id).is(':checked'));
                status = true;
                var id = todos[i].id;
                var nombre = todos[i].nombre + " " + todos[i].apellido ;
                var correo = todos[i].correo;
                break;
            }
        
    };


    if (status) 
        {
            return ({
                        status  : true,
                        id      : id,
                        nombre  : nombre,
                        correo  : correo
                    });
        }
    else
        {
            return ({
                        status  : false,
                        id      : "",
                        nombre  : ""
                    });;
        }

}



function enviarEjercicio (coordenadas,tipo,id_paciente,callback) 
    {
        var data = {};
       $(".se-pre-con").fadeIn("slow");
        //Delay para cargar la imagen que tomamos en el iframe en la variable imagen
       var delay = 1000;
        setTimeout(function()
            {

                 var imagen = $("#cubos").contents().find("#imagen_final").val();
                
                 if (tipo === "ejercitar") 
        {
            data.id_paciente = id_paciente;
            data.nombre_ejercicio = $('#NombreEjercicio').val();
            data.tiempo = $('#tiempoEjercicio').val();
            data.tipo = "Ejercitar";
            data.repeticiones = $('#repeticionesEjercicio').val();
            data.coordenadas = coordenadas;
            data.imagen = imagen;
            
           
        }
        else
        {
            data.id_paciente = id_paciente;
            data.nombre_ejercicio = $('#NombreEjercicio').val();
            data.tiempo = $('#tiempoEjercicio').val();
            data.tipo = "Estiramiento";
            data.repeticiones = 0;
            data.coordenadas = coordenadas;
            data.imagen = imagen;
            

        }

        
        $.ajax(
        {
            url         : "insertarEjercicio",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            callback(data);
            //console.log(data.status)

        }).error(function(request, status, error)
        {
            

            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });
                 //window.open(imagen)
            }, delay);
      
       
   
      
        

    }

function enviarCorreo_newEjercicio (datos,callback) 
    {
        
        var data = {};
        data.correo = datos.correo;
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
            $(".se-pre-con").fadeOut("slow");
            callback(data);
            //console.log(data.status)

        }).error(function(request, status, error)
        {
            

            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }










    $('#guarda').click(function(event) 
    {

        var cubosAfuera=false;
        
        var coordenadas = $("#cubos").contents().find("#Array_Cubos").val();
        
        var x = $("#cubos").contents().find("#Array_Cubos").val();
        var coordenadas2 = JSON.parse(x);
       // console.log(coordenadas2);

        $("#cubos").contents().find("#imagen").val("Listo_para_guardar");

        var opcion = $('#Opciones').val();

        
        

        if (opcion !== null && opcion !=="")
            {
                if (opcion == "opcion1") 
                {
                    //console.log("ENTRO A EJERCICIO")
                    var enviaForm = true;       
                    var campos = ["NombreEjercicio", "tiempoEjercicio", "repeticionesEjercicio"];
               


                 
                    
                    for (var i = 0; i < coordenadas2.length; i++) 
                    {
                        

                            if (coordenadas2[i].y <= -150 || coordenadas2[i].y >= 1800 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };

                           

                            if ( coordenadas2[i].z <= -1000 || coordenadas2[i].z >= 1000 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };

                            if (coordenadas2[i].x <= -1000 || coordenadas2[i].x >= 1000 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };
                    };
                    
                  //  console.log(cubosAfuera)


                    if (cubosAfuera) 
                    {     
                         swal({
                                title: '!Oops!',
                                text: 'Uno o más cubos se encuentran afuera',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                         enviaForm = false;     
                    };





                    if($("#NombreEjercicio").val() === ""  )
                    {
                        swal({
                                title: '!Completar campos!',
                                text: 'Por favor completa el campo nombre del ejercicio.',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                        enviaForm = false;
                    };
                  
                    if($("#tiempoEjercicio").val() === "" || $("#tiempoEjercicio").val() < 60 )
                    {
                        swal({
                                title: '!Completar campos!',
                                text: 'Por favor completa el campo tiempo del ejercicio, mínimo 60 segundos.',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });
                        enviaForm = false;
                    };

                    if($("#repeticionesEjercicio").val() === "" || $("#repeticionesEjercicio").val() <1 )
                    {
                        swal({
                                title: '!Completar campos!',
                                text: 'Por favor completa el campo repeticiones, mínimo 1 repetición.',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });
                        enviaForm = false;
                    };


                                             
                    if (!patron.test($("#tiempoEjercicio").val())) 
                    {             
                        swal({
                                title: '!Oops!',
                                text: '!El tiempo no puede ser de tipo decimal, escriba un valor entero!',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                        enviaForm = false;   
                    };

                    if (!patron.test($("#repeticionesEjercicio").val())) 
                    {             
                          
                        swal({
                                title: '!Oops!',
                                text: '!Las repeticiones no pueden ser de tipo decimal, escriba un valor entero!',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                         enviaForm = false;   
                    };


                    if (isNaN($("#repeticionesEjercicio").val()) || isNaN($("#repeticionesEjercicio").val()) ) 
                    {     
                         swal({
                                title: '!Oops!',
                                text: 'Digite solo números',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                         enviaForm = false;     
                    };

                      







                    if (enviaForm) 
                        {

                            var id_Paciente = seleccionoPaciente();

                           // console.log("Ha seleccionado paciente" + id_Paciente.id);

                            if (id_Paciente.status) 
                                {

                                    // $("#cubos").contents().find("#imagen").val("Listo_para_guardar");

                                    enviarEjercicio(coordenadas,"ejercitar",id_Paciente.id, function(data)
                                    {

                                        if(data.status)
                                        {   
                                           

                                            enviarCorreo_newEjercicio({"nombre" : id_Paciente.nombre ,  "correo" : id_Paciente.correo, "tipo": "informar_paciente_new_ejercicio"}, function(data)
                                            {

                                                if(data.status)
                                                {
                                                    
                                                   

                                                    swal
                                                            ({   
                                                                title   : "!Bien! :)",   
                                                                text    : "Se ha asignado un nuevo ejercicio al paciente. " + data.nombre,   
                                                                timer   : 2000,
                                                                type    : "success",  
                                                                showConfirmButton: true,
                                                                confirmButtonColor: 'white' 
                                                            });
                                                            limpiaCampos(campos);
                                                            $('#edita_ejercicio').show();
                                                            $('#guarda').css('margin-left', '2%');       
                                                            
                                                      
                                                                   
                                                 }

                                                else
                                                {
                                                    swal("Error!", "No se ha podido enviar el email a: " + data.correo, "error");
                                                }
                                            }); 
                                        
                                        }

                                        else
                                        {
                                            swal
                                            ({   
                                                title   : "!Oops!",   
                                                text    : "No se ha podido guardar el ejercicio "+ data.nombre_ejercicio +"  del paciente " + id_Paciente.nombre +", por que este ya tiene asociado un ejercicio de tipo "+ data.tipo +" con el mismo nombre.",   
                                                type    : "error",  
                                                showConfirmButton: true,
                                                confirmButtonColor: '#1FCE6D',
                                            });


                                            $(".se-pre-con").fadeOut('slow');
                                            limpiaCampos(campos);
                                        }
                                    });
                                   
                                }
                            else
                                {
                                   

                                    swal({
                                            title: '!Oops!',
                                            text: 'Seleccione a un paciente',
                                            type: "error",
                                            confirmButtonColor: '#1FCE6D'
                                        });


                                    
                                }


                           
                        };
                };

        if (opcion === "opcion2") 
        {
            //console.log("ENTRO A ESTIRAR")
            var enviaForm = true;       
            var campos = ["NombreEjercicio", "tiempoEjercicio"];

          


         
            
            if($("#NombreEjercicio").val() === ""  )
                    {
                        
                        swal({
                                title: '!Completar campos',
                                text: 'Por favor completa el campo nombre del ejercicio.',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                             });



                        enviaForm = false;
                       
                    }
                  
                    if($("#tiempoEjercicio").val() === "" || $("#tiempoEjercicio").val() < 60 )
                        {
                            
                            swal({
                                    title: '!Completar campos',
                                    text: 'Por favor completa el campo tiempo del ejercicio, mínimo 60 segundos.',
                                    type: "error",
                                    confirmButtonColor: '#1FCE6D'
                                 });

                            enviaForm = false;
                         
                        }

                if (!patron.test($("#tiempoEjercicio").val())) 
                    {             
                         
                       
                        swal({
                                    title: '!Oops!',
                                    text: '!El tiempo no puede ser de tipo decimal, escriba un valor entero!',
                                    type: "error",
                                    confirmButtonColor: '#1FCE6D'
                                 });
                         


                         enviaForm = false;   
                    };

                    


                    if (isNaN($("#repeticionesEjercicio").val()) ) 
                    {     

                        swal({
                                    title: '!Oops!',
                                    text: 'Digite solo números.',
                                    type: "error",
                                    confirmButtonColor: '#1FCE6D'
                                 });
                        
                        enviaForm = false;     
                    };

                     for (var i = 0; i < coordenadas2.length; i++) 
                    {
                        

                            if (coordenadas2[i].y <= -150 || coordenadas2[i].y >= 1800 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };

                           

                            if ( coordenadas2[i].z <= -1000 || coordenadas2[i].z >= 1000 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };

                            if (coordenadas2[i].x <= -1000 || coordenadas2[i].x >= 1000 ) 
                            {   

                                cubosAfuera=true;
                                break;
                            };
                    };
                    
                  //  console.log(cubosAfuera)


                    if (cubosAfuera) 
                    {     
                         swal({
                                title: '!Oops!',
                                text: 'Uno o más cubos se encuentran afuera',
                                type: "error",
                                confirmButtonColor: '#1FCE6D'
                            });

                         enviaForm = false;     
                    };


                        
                    

            if (enviaForm) 
            {
               var id_Paciente = seleccionoPaciente();

              // console.log("Ha seleccionado paciente" + id_Paciente.id);
                    if (id_Paciente.status) 
                        {

                         //   
                           //$("#cubos").contents().find("#imagen").val("Listo_para_guardar");

                            enviarEjercicio(coordenadas,"estirar",id_Paciente.id, function(data)
                            {

                                if(data.status)
                                {
                                   
                                   enviarCorreo_newEjercicio({"nombre" : id_Paciente.nombre ,  "correo" : id_Paciente.correo, "tipo": "informar_paciente_new_ejercicio"}, function(data)
                                    {

                                        if(data.status)
                                        {
                                            swal
                                            ({   
                                                title   : "!Bien! :)",   
                                                text    : "Se ha asignado un nuevo estiramiento al paciente. " + data.nombre,   
                                                timer   : 2000,
                                                type    : "success",  
                                                showConfirmButton: true,
                                                confirmButtonColor: 'white'
                                            });
                                            
                                            limpiaCampos(campos);
                                            $("#repeticionesEjercicio").val("");
                                            $('#edita_ejercicio').show();
                                            $('#guarda').css('margin-left', '2%');          
                                        }

                                        else
                                        {
                                            swal("Error!", "No se ha podido enviar el email a: " + data.correo, "error");
                                            limpiaCampos(campos);    
                                        }
                                    });                               
                                }

                                else
                                {
                                     
                                      swal
                                            ({   
                                                title   : "!Oops! ",   
                                                text    : "No se ha podido guardar el ejercicio "+ data.nombre_ejercicio +"  del paciente " + id_Paciente.nombre +", por que este ya tiene asociado un ejercicio de tipo "+ data.tipo +" con el mismo nombre.",   
                                                type    : "error",  
                                                showConfirmButton: true,
                                                confirmButtonColor: '#1FCE6D',
                                            });

                                     $(".se-pre-con").fadeOut('slow');
                                     limpiaCampos(campos);    
                                }
                            });
                            
                        }
                    else
                        {
                            
                            swal({
                                    title: '!Oops!',
                                    text: 'Seleccione a un paciente.',
                                    type: "error",
                                    confirmButtonColor: '#1FCE6D'
                                 });
                            
                        }
                
            };

        }
    }
        else
        {
           
            
             swal({
                    title: '!Oops!',
                    text: 'Elija algún tipo de terapia',
                    type: "error",
                    confirmButtonColor: '#1FCE6D'
                 });

                    
        }

     
       



    });


    nom_div("buscar").addEventListener('keyup', function(event)
    {
        resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if(this.value !== "")
        {
            for(var i = 0; i < todos.length; i++)
            {

                
                busca = todos[i].nombre.search(this.value) < 0;
                busca = busca && todos[i].apellido.search(this.value) < 0;
                busca = busca && todos[i].cedula.search(this.value) < 0;
                busca = busca && todos[i].correo.search(this.value) < 0;
             


               
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        muestraTodos(1,todos[i]);
    });


    function limpiaCampos(campos)
    {
        for(var i = 0; i < campos.length; i++)
        {
            $("#" + campos[i]).val("");
        }

        $("#TipoEjercicio").val("");
        $("input:radio").attr("checked", false);
        $('#Opciones').prop('selectedIndex',0);

    }

    function nom_div(div)
    {
        return document.getElementById(div);
    }
  




   
});

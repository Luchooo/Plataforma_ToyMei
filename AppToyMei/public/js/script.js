jQuery(document).ready(function($) 
{
    var delay = 500;
   setTimeout(function(){  $(".loading").fadeOut('slow'); }, delay);
    var alto_iconos = screen.height*0.035;
    var contador_tiempo = 3;

  //  var ancho_iconos = screen.width*0.01;

 //   console.log("Alto: " + alto_iconos);

var eliminado = false;

$('#help').click(function(event) 
{
    swal
    ({
     
      text: "Elige un tipo de terapia",
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff7700',
      cancelButtonColor: '#1c2127',
      confirmButtonText: 'Ejercitar',
      cancelButtonText: 'Estiramiento',
    }).then(function () 
    {
        swal.setDefaults
        ({
          confirmButtonText: 'Siguiente &rarr;',
          showCancelButton: true,
          animation: false,
          confirmButtonColor: '#ff7700',
          cancelButtonColor: '#1c2127',
          cancelButtonText: 'Cancelar',
          progressSteps: ['1', '2', '3','4','5']
        })

        var steps = [
          {
            title: 'Objetivo de la terapia',
            text: 'Buscar y destruir las cajas en orden numérico antes de que el tiempo finalice.',
            imageUrl: "../img/ejercitar.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Objetivo a buscar',
            text: 'En la esquina superior izquierda encontrarás el objetivo actual a buscar.',
            imageUrl: "../img/objetivoABuscar.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Tiempo',
            text: 'En la zona superior central encontrarás el tiempo que quedará para finalizar la terapia.',
            imageUrl: "../img/tiempo.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Repeticiones',
            text: 'En la esquina superior derecha encontrarás las repeticiones que deberás realizar para finalizar la terapia con éxito.',
            imageUrl: "../img/repeticiones.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Sonido',
            text: 'Podrás quitar el sonido diciendo "sin sonido" o poner el sonido diciendo "con sonido", la AppToyMei te estará escuchando.',
            imageUrl: "../img/sonido_alerta.PNG",
            imageWidth: 200,
            imageHeight: 100
          },
        ]

        swal.queue(steps).then(function (result) {
          swal.resetDefaults()
          swal
          ({
            imageUrl: '../img/happy.png',
            imageWidth: 150,
            imageHeight: 100,
            animation: false,
            customClass: 'animated tada',
            text: '!! Espero haber sido de utilidad !!',
            showCancelButton: false,
            timer: 2600,
            showConfirmButton: false
            
          })
        })

    
    }, function (dismiss) {
  // dismiss can be 'cancel', 'overlay',
  // 'close', and 'timer'
  if (dismiss === 'cancel') 
  {
    swal.setDefaults
        ({
          confirmButtonText: 'Siguiente &rarr;',
          showCancelButton: true,
          animation: false,
          confirmButtonColor: '#ff7700',
          cancelButtonColor: '#1c2127',
          cancelButtonText: 'Cancelar',
          progressSteps: ['1', '2', '3','4']
        })

        var steps = [
          {
            title: 'Objetivo de la terapia',
            text: 'Mirar fijamente los cubos hasta que estos desaparezcan.',
            imageUrl: "../img/ocultar.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Contador de cubos ocultos',
            text: 'En la esquina superior izquierda encontrarás la cantidad de cubos que has ocultado.',
            imageUrl: "../img/cubos_ocultos.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Tiempo',
            text: 'En la zona superior central encontrarás el tiempo que quedará para finalizar la terapia.',
            imageUrl: "../img/tiempocubosOcultos.gif",
            imageWidth: 200,
            imageHeight: 200
          },
          {
            title: 'Sonido',
            text: 'Podrás quitar el sonido diciendo "sin sonido" o poner el sonido diciendo "con sonido", la AppToyMei te estará escuchando.',
            imageUrl: "../img/sonido_alerta.PNG",
            imageWidth: 200,
            imageHeight: 100
          }
        ]

        swal.queue(steps).then(function (result) {
          swal.resetDefaults()
          swal
          ({
            imageUrl: '../img/happy.png',
            imageWidth: 150,
            imageHeight: 100,
            animation: false,
            customClass: 'animated tada',
            text: '!! Espero haber sido de utilidad !!',
            showCancelButton: false,
            timer: 2600,
            showConfirmButton: false
            
          })
        })

   
  }
});
});





    $('#help').css
    ({
        "height"         : alto_iconos,
        "width"          : alto_iconos,
        "padding-top"    : '5px',
        "padding-bottom" : '5px',
        "border"         : '2px solid white',
        "border-radius"  : '50%',
        "margin-left"    : '5px'
    });




    $('#change_password').css
    ({
        "height"         : alto_iconos,
        "width"          : alto_iconos,
        "padding-top"    : '5px',
        "padding-bottom" : '5px',
        "border"         : '2px solid white',
        "border-radius"  : '50%',
        "margin-left"    : '5px'
    });


     $('#logout').css
    ({
        "height"         : alto_iconos,
        "width"          : alto_iconos,
        "padding-top"    : '5px',
        "padding-bottom" : '5px',
        "border"         : '2px solid white',
        "border-radius"  : '50%',
        "margin-left"    : '5px'
    });
   
   
    //Para los servicios que se consumirán...
    var nomServicios = [
							{
								servicio 	: 	"Trae todas las tareas",
								urlServicio	: 	"getAllTask",
								metodo		: 	"GET"
							}
						];

    var consumeServicios = function(tipo, val, callback)
	 {
		var servicio = {
							url 	: nomServicios[tipo - 1].urlServicio,
							metodo	: nomServicios[tipo - 1].metodo,
							datos 	: ""
						};
		
		
			servicio.datos = val !== "" ? JSON.stringify(val) : "";
		
		//Invocar el servicio...
		$.ajax(
		{
			url 		: servicio.url,
			type 		: servicio.metodo,
			data 		: servicio.datos,
			dataType 	: "json",
			contentType: "application/json; charset=utf-8"
		}).done(function(data)
		{
            callback(data);
		}).error(function(request, status, error)
        {
            alert(request.responseText);
            window.location = "/";
		});
	};


    //Para guardar el nombre del usuario...
    var $nomUsuario = $("#titulo").html();
    //Traer los TO-DO creados...
    var todos = [];
	   consumeServicios(1, "", function(data){
        todos = data;

        //console.log(todos.length);

        if (todos.length === 0) 
        {
           window.location = "/ceroEjercicios";
        }
        else
        {
          muestraTodos(1, 0);
        }



        
    });
    //Fin de los servicios consumidos...


//Poner la primera letra en mayuscula

function MaysPrimera(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}




function ejercicioEliminado (id_ejercicio,callback) 
    {
        var data = {};
        data.id_ejercicio = id_ejercicio;
       $.ajax(
        {
            url         : "ejercicioEliminado",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {

            console.log(data);
            callback(data);
          
          

        }).error(function(request, status, error)
        {
           sweetAlert("Oops...", request.responseText, "error");
           //alert(request.responseText);
           window.location = "/";
        });

    }








    var contenidoTabla = function(data, type)
    {
        if(type === 1)
        {



            return "<tr id = 'td_"+(data.id_ejercicio)+"'>" +
                        "<td width='80%'><div id = 'txt_"+(data.id_ejercicio)+"'>" + (data.nombre_ejercicio) + "</div>" +
                        "<span class = 'date'>"+(data.fecha_creacion)+ " - " + MaysPrimera(data.tipo.toLowerCase()) +"</span></td>" +
                       // "<td width='10%'><center><img src = 'img/trash.png' border = '0' id = 'del_"+(data.id)+"'/></center></td>" +
                        "<td width='10%'><center><img src = 'img/mail2.png' border = '0' id = '"+(data.id_ejercicio)+"'/></center></td>" +
                    "</tr>";
        }
        else
        {
            

            $("#" + data.id_ejercicio).click(function(event) {
                var ind = this.id;
                accionTodo(ind, 1);
            });
        }
    };

    //Para listar los trabajos...
    var muestraTodos = function (tipo, index)
    {
        $("#titulo").html($nomUsuario + " ("+(todos.length <= 9 ? "0" + todos.length : todos.length)+")");
        //Para mostrar todos los elementos...
        var $txt = "";
        if(tipo === 1)
        {
            $txt = "<table width='100%' border='0' cellspacing='0' cellpadding='0' id = 'tableTodo'>";
            for(var veces = 1; veces <= 2; veces++)
            {
                for(var i = todos.length - 1; i >= 0; i--)
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
            $("#td_" + todos[index].id).hide().fadeIn('fast');
            contenidoTabla(todos[index], 2);
        }
    };

    var accionTodo = function(ind, type)
    {

       // console.log(ind)

        var posInd = buscarIndice(ind);
        if(posInd >= 0)
        {
            if ( type === 1) 
            {

               swal({
                      title: "¿Quiere iniciar el juego?",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#2e3740",
                      confirmButtonText: "Si, iniciar",
                      cancelButtonText: "No, cancelar!",
                      cancelButtonColor: "#ff7803",
                      
                      closeOnConfirm: false,
                    }).then(function () 
                    {

                        //Saber si se elimino durante la sesion


                    ejercicioEliminado(ind, function(data)
                    {



                      if (data.eliminado) 
                      {

                          
                          console.log("Se va recargar la página");
                          swal
                              ({
                                
                                title: "Error :(",
                                text: '!! Este ejercicio a sido eliminado por tu médico !!',
                                showCancelButton: false,
                                timer: 2600,
                                type : "error",
                                showConfirmButton: false
                                
                              }) ;

                          var delay = 3000;
                          setTimeout(function()
                            { 
                             
                              window.location.reload();
                            }, delay);
                        }
                      else
                      {
                         window.location = "/enviarIdEjercicio/"+ind;
                        //console.log("Se va al juego")

                      } 
                     });








                        
                         setInterval(function()
                            { 
                           
                               swal({
                                  title: "El juego iniciará en "+ contador_tiempo+ " segundos",
                                  text: "Ubique su Smartphone en las cardboard.",
                                  showConfirmButton: false,
                                  imageUrl: "../img/clock.gif",
                                  imageWidth: 75,
                                  imageHeight: 75
                                    
                                });  
                    


                               if (contador_tiempo === 0) 
                                   {
                                       window.location = "/enviarIdEjercicio/"+ind;
                                   };
                               contador_tiempo--;    
                           }, 1000);


                      
                    });
        
     
   




            }
        }
    };

    var buscarIndice = function(id)
    {
        var ind = -1;
        for(var i = 0; i < todos.length; i++)
        {
            if(todos[i].id_ejercicio === id)
            {
                ind = i;
                break;
            }
        }
        return ind;
    };

   

    $("#todos").height($(window).height() - 125);
    $(window).resize(function(event) {
        $("#todos").height($(window).height() - 125);
    });
});

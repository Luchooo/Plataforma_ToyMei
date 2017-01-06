jQuery(document).ready(function($) 
{
    

    
    var resultadoBusca = []; //Guarda los usuarios que cumplen con el criterio de búsqueda...
    listadoEjercicios = [];
    var ind;
    traerEjercicios();

    $(".se-pre-con").fadeOut("slow");
 var patron = /^\d*$/; //Expresión regular para aceptar solo números enteros positivos



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
     // console.log(listadoEjercicios);

    if (listadoEjercicios.length === 0) 
    {
           //No hay ejercicios mostrarle vista
           setTimeout(function(){   window.location = "/ceroEjercicios"; }, 1700);
     

           
    }
    else
    {
        imprimeUsuarios(data);
    }


      

    }).error(function(request, status, error)
    {
        sweetAlert("Oops...", request.responseText, "error");
        window.location = "/";
    });
}



    //Para guardar el nombre del usuario...
    var $nomUsuario = $("#titulo").html();
    var todos = [];



    function updateEjercicio (ind,callback) 
    {
        var data = {};
        
        data.nombre_ejercicio = $("#nombre_ejercicio").val();
        data.tiempo = $("#tiempo").val();
        data.repeticiones = $("#repeticiones").val();
        data.tipo = $("#tipo_ejercicio").val();
        data.id_ejercicio = listadoEjercicios[ind].id_ejercicio;
        data.id_paciente = listadoEjercicios[ind].id_paciente;

        //console.log(listadoEjercicios[ind].id_ejercicio)
    
         
        $.ajax(
        {
            url         : "updateEjercicio",
            type        : "PUT",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
         //   console.log(data);
            callback(data);

        }).error(function(request, status, error)
        {            
            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });
    }



    

 

    

function enviarEmailEjercicioEliminado (datos,callback) 
    {

        

        var data = {};
        data.correo = datos.correo;
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
            $(".se-pre-con").fadeOut("slow");
            callback(data);
        }).error(function(request, status, error)
        {
            sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }







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

  

//Eliminado logico de ejercicio

   var eliminarEjercicio= function(ind,callback)
    {

        $(".se-pre-con").fadeIn("slow");
        var data = {};
        data.id_ejercicio= listadoEjercicios[ind].id_ejercicio;
       
        $.ajax(
        {
            url         : "eliminarEjercicio",
            type        : "PUT",
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














//Script para poner la primera en mayuscula
function MaysPrimera(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}




    var imprimeUsuarios = (function imprimeUsuarios()
    {
        var muestra = true;
        var txt = "<table class = 'table-fill'>" + 
                    "<thead><tr>" + 
                    "<th>Nombre Paciente</th>" + 
                    "<th>Tipo ejercicio</th>" + 
                    "<th>Nombre ejercicio</th>" + 
                    "<th>Fecha</th>" +
                    "<th>Tiempo</th>" +
                    "<th>Repeticiones</th>" +  
                    "<th>Editar</th>" + 
                    "<th>Eliminar</th></tr></thead>" + 
                    "<tbody class = 'table-hover'>";
        for(var i = 0; i < listadoEjercicios.length; i++)
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
                txt += "<tr>";
            var datosEjercicio = listadoEjercicios[i];

           // console.log(datosPersona)

           
                txt += "<td><center>" + MaysPrimera(datosEjercicio.nombre.toLowerCase()) + " " + MaysPrimera(datosEjercicio.apellido.toLowerCase()) + "</center></td>";
                txt += "<td><center>" + MaysPrimera(datosEjercicio.tipo.toLowerCase())  + "</center></td>";
                txt += "<td><center>" + datosEjercicio.nombre_ejercicio + "</center></td>";
                txt += "<td><center>" + datosEjercicio.fecha_creacion + "</center></td>";
                txt += "<td ><center>" + datosEjercicio.tiempo +"</center></td>";

                if (datosEjercicio.tipo.toLowerCase() === "ejercitar" ) 
                {
                    txt += "<td><center>" + datosEjercicio.repeticiones +"</center></td>";
                }
                else
                {
                    txt += "<td><center> - </center></td>";
                }

                

                //Editar...
                txt += "<td><center>";
                txt += "<img src = 'img/editar.png' border = '0' id = 'e_"+i+"'/>";
                txt += "</center</td>";
                //Eliminar...
                txt += "<td><center>";
                txt += "<img src = 'img/eliminar.png' border = '0' id = 'd_"+i+"'/>";
                txt += "</center</td>";
                txt += "</tr>";
            }
        }
        txt += "</tbody></table>";
        nom_div("imprime").innerHTML = txt;

        //Poner las acciones de editar y eliminar...
        for(var i = 0; i < listadoEjercicios.length; i++)
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
                //Editar...
                nom_div("e_" + i).addEventListener('click', function(event)
                {
                    ind = event.target.id.split("_")[1];
                    //console.log(ind);
                    if(ind >= 0)
                    {


                        if (listadoEjercicios[ind].tipo.toLowerCase() === "estiramiento")
                        {
                            nom_div("nombre_paciente").value = listadoEjercicios[ind].nombre + " " + listadoEjercicios[ind].apellido ;
                            //No lo va poder modificar
                            $('#nombre_paciente').prop('disabled', true);
                            nom_div("tipo_ejercicio").value = listadoEjercicios[ind].tipo;
                            //No lo va poder modificar
                            $('#tipo_ejercicio').prop('disabled', true);
                            nom_div("nombre_ejercicio").value = listadoEjercicios[ind].nombre_ejercicio;
                            nom_div("tiempo").value = listadoEjercicios[ind].tiempo;
                            nom_div("repeticiones").value = listadoEjercicios[ind].repeticiones;
                            $('#repeticiones').hide();
                        }
                        else
                        {
                            nom_div("nombre_paciente").value = listadoEjercicios[ind].nombre + " " + listadoEjercicios[ind].apellido ;
                            //No lo va poder modificar
                            $('#nombre_paciente').prop('disabled', true);
                            nom_div("tipo_ejercicio").value = listadoEjercicios[ind].tipo;
                            //No lo va poder modificar
                            $('#tipo_ejercicio').prop('disabled', true);
                            nom_div("nombre_ejercicio").value = listadoEjercicios[ind].nombre_ejercicio;
                            nom_div("tiempo").value = listadoEjercicios[ind].tiempo;
                            nom_div("repeticiones").value = listadoEjercicios[ind].repeticiones;
                            $('#repeticiones').show();

                        }

                        $('#guarda').show();




                    }
                    else
                    {
                       alert("No existe el ID");
                    }
                });

                //Eliminar...
                nom_div("d_" + i).addEventListener('click', function(event)
                {
                    var ind = event.target.id.split("_")[1];
                    var idEjercicio = listadoEjercicios[ind].id_ejercicio;
                  


                  //////*****/////////

                  swal({
                          title: "¿Estás segur@",
                          text: "Se eliminara el ejercicio " + listadoEjercicios[ind].nombre_ejercicio + " del paciente " + listadoEjercicios[ind].nombre + " " + listadoEjercicios[ind].apellido,
                          type: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#1c2127",
                          confirmButtonText: "Si, borrar ejercicio!",
                          cancelButtonText: "No, cancelar",
                          closeOnConfirm: false,
                          closeOnCancel: false
                        },
                        function(isConfirm)
                        {
                          if (isConfirm) 
                          {
                            
                            
                            eliminarEjercicio(ind,function(data)
                            {
                                if(data.status)
                                {
                                    sweetAlert("Oops", "No se pudo eliminar.", "error");
                                }
                                else
                                {
                                    ind = buscaIndice(idEjercicio);
                                    if(ind >= 0)
                                    {


                                        swal.close();
                                        enviarEmailEjercicioEliminado({"apellido" : listadoEjercicios[ind].apellido ,"nombre" : listadoEjercicios[ind].nombre ,  "correo" : listadoEjercicios[ind].correo, "tipo": "informar_pacienteEliminadoEjercicio"}, function(data)
                                        {

                                            if(data.status)
                                            {
                                                
                                                listadoEjercicios.splice(ind, 1);
                                                swal({   title: "Eliminado!",   text: "Se ha elimiando exitosamente",   timer: 1500,   showConfirmButton: false, type : "success"});
                                                traerEjercicios();
                                                $('#guarda').hide();
                                                $("#nombre_paciente").val("");
                                                $("#nombre_ejercicio").val("");
                                                $("#tiempo").val("");
                                                $("#repeticiones").val("");
                                                $("#tipo_ejercicio").val("");


                                            }

                                            else
                                            {
                                                swal("Error!", "No se ha podido enviar el email a: " + data.correo, "error");
                                            }
                                        });   

                                 }//                            
                                }
                            });
                          } 

                          else 
                          {
                           //swal("Cancelado", "El ejercicio no se ha eliminado :)", "error");
                            swal.close();
                          }
                        });


 
                });
            }
        }
    return imprimeUsuarios;
    })();

    function nom_div(div)
    {
        return document.getElementById(div);
    }
    
    var buscaIndice = function(id)
    {
        var indice = -1;
        for(var i in listadoEjercicios)
        {
            if(listadoEjercicios[i].id_ejercicio === id)
            {
                indice = i;
                break;
            }
        }
        return indice;
    }



$("#guarda").click(function(event) 
{
    
    var enviaForm = true;
    var campos = ["nombre_ejercicio", "tiempo", "repeticiones"];
    
     if($("#nombre_ejercicio").val() === ""  )
        {
            sweetAlert("Oops", "Por favor completa el campo nombre del ejercicio ", "error");
            enviaForm = false;
           
        }
                  
    if($("#tiempo").val() === "" || $("#tiempo").val() < 60 )
        {
            sweetAlert("Oops", "Por favor completa el campo tiempo del ejercicio, mínimo 60 segundos.", "error");
            enviaForm = false;
         
        }

     if ($("#tipo_ejercicio").val().toLowerCase() === "ejercitar") 
        {
            if($("#repeticiones").val() === "" || $("#repeticiones").val() <1 )
            {
                sweetAlert("Oops", "Por favor completa el campo repeticiones, mínimo 1 repetición. ", "error");
                enviaForm = false;
             
            };
            if (!patron.test($("#repeticiones").val())) 
            {             
                sweetAlert("Oops","!Las repeticiones no pueden ser de tipo decimal, escriba un valor entero!","error");     
                 enviaForm = false;   
            };
        };


        if (!patron.test($("#tiempo").val())) 
        {             
            sweetAlert("Oops","!El tiempo no puede ser de tipo decimal, escriba un valor entero!","error");     
             enviaForm = false;   
        };

        
    

    

    if(enviaForm)
    {
        updateEjercicio(ind,function(data)
        {
               
                if(!data.status)
                {                      
                    

                    swal
                    ({  
                        title   : "Oops",   
                        text    : "El nombre: " + $("#nombre_ejercicio").val() + " ya esta asociado a un ejercicio de tipo: " +  $("#tipo_ejercicio").val() ,   
                        timer   : 5000,
                        type    : "error",  
                        showConfirmButton: false 
                    });

                    $("#nombre_ejercicio").val("");
                    $("#tiempo").val("");
                    $("nombre_ejercicio").focus();
                    if ($("#tipo_ejercicio").val().toLowerCase() === "ejercitar") 
                    {
                        $("#repeticiones").val("");
                    };

                    traerEjercicios();                    
                

                }
                else
                {
                    
                    swal
                    ({   
                        title   : "Bien!",   
                        text    : "Se ha actualizado el paciente correctamente",   
                        timer   : 1000,
                        type    : "success",  
                        showConfirmButton: false 
                    });
                    traerEjercicios();
                    $('#guarda').hide();
                     $("#nombre_ejercicio").val("");
                    $("#tiempo").val("");
                    $("#repeticiones").val("");
                     $("#nombre_paciente").val("");
                    $("#tipo_ejercicio").val("");
                    
                }
        });
      
    }    
   
});


    nom_div("buscar").addEventListener('keyup', function(event)
    {
        resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if(this.value !== "")
        {
            for(var i = 0; i < listadoEjercicios.length; i++)
            {

                busca = listadoEjercicios[i].cedula.search(this.value) < 0;
                busca = busca && listadoEjercicios[i].nombre.search(this.value) < 0;
                busca = busca && listadoEjercicios[i].apellido.search(this.value) < 0;
                busca = busca && listadoEjercicios[i].correo.search(this.value) < 0;
                busca = busca && listadoEjercicios[i].fecha_creacion.search(this.value) < 0;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeUsuarios();
    });









   
    
    function limpiaCampos(campos)
    {
        for(var i = 0; i < campos.length; i++)
        {
            $("#" + campos[i]).val("");
        }
    }

    
});

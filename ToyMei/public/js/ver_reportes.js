jQuery(document).ready(function($)
{

//Para los servicios que se consumirán...
$(".se-pre-con").fadeOut('slow');
 listadoPersonas = [];
  var resultadoBusca = []; //Guarda los usuarios que cumplen con el criterio de búsqueda...
  traerPersonasxNoInformes();

  var datosEjerciciosPDF;

datosPorEjercicio=[];



 
//si si esta global wey no esta global :v


function traerPersonasxNoInformes (callback)
 {        
    $.ajax(
    {
        url         : "traerPersonasxNoInformes",
        type        : "GET",
        data        : "",
        dataType    : "json",
        contentType: "application/json; charset=utf-8"
    }).done(function(data)
    { 


      /* todos=data.data;
       console.log(todos);
       muestraTodos(1,0)
    */


    listadoPersonas=data.data;
    //console.log(listadoPersonas);

 if (listadoPersonas.length === 0) 
    {
      window.location ="/noHayReportes";


           
    }
    else
    {
         imprimeUsuarios(data)
    }






    }).error(function(request, status, error)
    {
        sweetAlert("Oops...", request.responseText, "error");
        window.location = "/";
    });
}





    //Para listar los pacientes...
    
    var imprimeUsuarios = (function imprimeUsuarios()
    {
        var muestra = true;
        var txt = "<table class = 'table-fill'>" + 
                    "<thead><tr>" +
                    "<th>Nombre</th>" + 
                    "<th>Enviar</th>" + 
                    "<th>Ver</th>" +
                    "<th>Guardar</th></tr></thead>" + 
                    "<tbody class = 'table-hover'>";
        for(var i = 0; i < listadoPersonas.length; i++)
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
                
                var datosPersona = listadoPersonas[i];
                txt += "<td><center>"+datosPersona.nombre +" "+ datosPersona.apellido+"</center></td>";
                

                //Enviar
                txt += "<td><center>";
                txt += "<img src = 'img/mail.png' border = '0' id = 'enviar_"+i+"'/>";
                txt += "</center</td>";

                //Ver
                txt += "<td><center>";
                txt += "<img src = 'img/eye.png' border = '0' id = 'ver_"+i+"'/>";
                txt += "</center</td>";

                //Save
                txt += "<td><center>";
                txt += "<img src = 'img/pdf.png' border = '0' id = 'save_"+i+"'/>";
                txt += "</center</td>";
                txt += "</tr>";

              
            }
        }
        txt += "</tbody></table>";
        nom_div("imprime").innerHTML = txt;

        //Poner las acciones de editar y eliminar...
        for(var i = 0; i < listadoPersonas.length; i++)
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
                //Ver...
                nom_div("ver_" + i).addEventListener('click', function(event)
                {

                    ind = event.target.id.split("_")[1];
                    var id_paciente = listadoPersonas[ind].id_paciente;
                    //console.log("El ID del paciente es: " + id_paciente);
            

                    traerDatosPaciente(id_paciente,function(data)
                    {
                        traerDatosInforme(id_paciente,function(data2)
                        {

                            for (var h = 0; h < data2.length; h++) 
                            {
                               // console.log(datosEjerciciosPDF[h].ID);
                                traerDatosPorEjercicio(data2[h].ID)
                                
                            };

                            traerDatos_Medico(function(data3)
                            {
                               generarPDF(data,data2,data3,"Ver")
                            });
                       });
                    });

                });



                 //Guardar...
                nom_div("save_" + i).addEventListener('click', function(event)
                {
                  

                    ind = event.target.id.split("_")[1];
                    var id_paciente = listadoPersonas[ind].id_paciente;
                    //console.log("El ID del paciente es: " + id_paciente);

                    traerDatosPaciente(id_paciente,function(data)
                    {
                        traerDatosInforme(id_paciente,function(data2)
                        {

                            for (var h = 0; h < data2.length; h++) 
                            {
                               // console.log(datosEjerciciosPDF[h].ID);
                                traerDatosPorEjercicio(data2[h].ID)
                                
                            };

                            traerDatos_Medico(function(data3)
                            {
                               generarPDF(data,data2,data3,"Save")
                            });
                       });
                    });
                    
                   
                     
                });


                //Enviar...
                nom_div("enviar_" + i).addEventListener('click', function(event)
                {
                  

                    ind = event.target.id.split("_")[1];
                    var id_paciente = listadoPersonas[ind].id_paciente;
                    //console.log("El ID del paciente es: " + id_paciente);

                    traerDatosPaciente(id_paciente,function(data)
                    {
                        traerDatosInforme(id_paciente,function(data2)
                        {

                            for (var h = 0; h < data2.length; h++) 
                            {
                               // console.log(datosEjerciciosPDF[h].ID);
                                traerDatosPorEjercicio(data2[h].ID)
                                
                            };

                            traerDatos_Medico(function(data3)
                            {
                               generarPDF(data,data2,data3,"Enviar")
                            });
                       });
                    });
                    
                   
                     
                });




           }
        }
    return imprimeUsuarios;
    })();




function traerDatosPaciente (id_paciente,callback) 
    {
        var data = {};
        data.id_paciente = id_paciente;
       $.ajax(
        {
            url         : "traerDatosPaciente",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            callback(data);
           //datosPacientePDF = data;
          

        }).error(function(request, status, error)
        {
           sweetAlert("Oops...", request.responseText, "error");
           //alert(request.responseText);
           window.location = "/";
        });

    }





function traerDatosPorEjercicio (id_ejercicio,callback) 
    {
        
        var data = {};
        data.id_ejercicio = id_ejercicio;

       $.ajax(
        {
            url         : "traerDatosPorEjercicio",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            datosPorEjercicio.push(data); 
            
          // generarPDF(); 
           
        }).error(function(request, status, error)
        {
           sweetAlert("Oops...", request.responseText, "error");
           //alert(request.responseText);
           window.location = "/";
        });

    }













function traerDatosInforme (id_paciente,callback) 
    {
        
        var data = {};
        data.id_paciente = id_paciente;
       $.ajax(
        {
            url         : "traerDatosInforme",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            datosEjerciciosPDF=data; 
         //   console.log("Cantidad de terapias")
         //   console.log(datosEjerciciosPDF.length);
            callback(data);
        
          // generarPDF(); 
           
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



function generarPDF (dataPaciente,dataEjercicios,dataMedico,type) 
{
 
//console.log(dataEjercicios);
//Normalizar datos
dataMedico.nombre = MaysPrimera(dataMedico.nombre.toLowerCase());
dataPaciente.nombre = MaysPrimera(dataPaciente.nombre.toLowerCase());
dataPaciente.apellido = MaysPrimera(dataPaciente.apellido.toLowerCase());
//***********************


//Saber cuales ejercicio tiene el paciente

//console.log(dataEjercicios);


//console.log(moment().format("DD-MM-YYYY, h:mm:ss a")); 

var date            =   new Date();
var fechaActual     =   date.getDate()  + '/' + (date.getMonth()+1)  + '/' +  date.getFullYear();


var logo2soft = "data:image/jpeg;base64,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";
var logo_ToyMei = "data:image/png;base64,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"
var user_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUNJREFUeNqk1M8rBGEYwPF3piUbWw6r5KbcFFe1KSkHPy4ix7k5oJxc3OSgKBcSrnMlSf4Cf4ILKRchOaHltju+r56pt+mdt3nNU5+2nZ357vtuOxMkSaL0xHGsLDOANUwgxA0O8Zw9MYqiv9eKyp8hnGPUODaGWSzi3nZRmBPrwm4mls4w9tHtExzEnGP107KDwsFedDqCAfp8gj9IHEH92YdP8A2PjuATXn2C77hyBK/lSwsH9ZZO8ZKz+iO0fYJ6HrCKL+PYN1Zwl3eRK6hk21vG+x1cui5wBfsxiXHjWAMzcktap2L5gnnZ6gh65K5JR8em8IlbHOPC/D3NFXbgQO5fvbJ6JmaeV5dzznBinmcG1+XJ4jvL2LAFl9T/Z8EWrJYIVm3BoEQwsAWbJYJN299mG5uooVUwFMqTaS898CvAAK+1NsWPOs6jAAAAAElFTkSuQmCC"
var email = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMDcxRkI1MDkxQzExRTQ5OERCODdBNUIzNUUwNjMwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGMDcxRkI2MDkxQzExRTQ5OERCODdBNUIzNUUwNjMwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEYwNzFGQjMwOTFDMTFFNDk4REI4N0E1QjM1RTA2MzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEYwNzFGQjQwOTFDMTFFNDk4REI4N0E1QjM1RTA2MzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7u1SxlAAABn0lEQVR42mL8//8/AxbABsQBUGwJxFJA/AuInwDxeSBeD8QboWKoAGQgGg4E4tv/CQOQmiB0/cgcZiDu/E866ITqxTCQHMOQDUUxMOQ/5QBkBgMjkABFwF0glnn+7DHD3p2bGUgBVnbODErK6iDmUyBWYgESoSDDQCJHD+1huHf3JgOpAGqgNBCHMUGTBrIESUBRWQ2ZGwAy0BTG09IxYHB28yXaMGs7FwZjUytkIROQgRIw3paNKxkEhUQYUrNKgLQwToM4OLkYYhKzwK4D6UECkkzIqf3H9+8Ma1bMZ7h25QJDTEI2gxGq7XBf5BXVMjx/+phhyfxpYD3IABQpz4GYF1kQFDnXrpxnCIlIBIcrzBUuwOCQlJZlWAw0CJQisIDnIAMvAbEausz7d28ZZk/rAYcpyEUgcPb0MbAYHnAGZOAGIA7BpWLvrs1gTCTYAArD1dBShFIAStirYZFSBBLBFgkkpMNCIP6JXDh0UZCPu3AVX5PJMGwKruILhoNJKGBD8BWwyJgNiKOBeA0Q3wfiX1B8HyoWDVWDoRcgwAB+e6Tb3tTXVQAAAABJRU5ErkJggg=="
var cedula = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACIUlEQVR42mNkoDFgHF4WqKlrUMXCWzdv/EexoLy6zt/V3WMmIyOjKIj///9/BiCbAZ2NzMelBsp+vX/v7vSWhrqNYNG9h4+/AEqIMUJVAdn/sbGR+bjUILFfOttaSjAqKikzzl6w+A/IN6oqigxcnJxYvf3t+3eGO3cfgF1IJPiflZrEwqigpMQ0Z8ESkAUMBnraYFecuXDt/4KVmxn/AQ2LD/P5b26kA3Ixw6Ur18EuPHzqOEjdf1gQ25pZYvgARGemJGJa8PzVG4a04tb/v//8AWtgZmb+P6e3hlFCTBhuAdRguAUgNlEW6OtqMcxbvolh1abdKH4N9XNhSI70h1nAAPQBznAB+gbOxuqDuq4ZDCfPXUFxkZmhNmNTWQZeH6D7BqcPLl69xVDeMhnFVd31BQy6GsrU8cHff/8Ycio7/99/9AzsIh0N5f/ddflgNswHxCRTnJEMcuH+o2f+d01dBNZQkhn738nGFKydYgsePHvNuHnXYYanz1/BwxSkEJiCGAM9HRkUZcQos6CifQbOjATS31GZQWwmwx4HfbNXMr568x4jVYDYokICDMXpESiphCgfyMjJM85dtPQPMxMTI65kB2NDCzmiLPjz9++/9OR4FrDgwnUbXkgIiYgBLSEpCHABUEp88e7Nq/igAAmwBdEpqf5Wjo4zgUxRqtjAwPD65OHD6YtmTN+IUsFIycpSpcJ59vgxaoVDSzD0LQAA5simjSDhYwsAAAAASUVORK5CYII="
var fecha_nace ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFxSURBVHjatJNBboJQEIYHBHHB0hNAXLHpCUhvUG/S7tx4hzZ4ABeEdV0R41LCLUyAjS6NIQgEkDKv5eVhMNhKv2TC/36GYR5vAGBYLBbvtm2X8/n8DW4wm82mmGMYxifrl2VJQmDN8Xj8pKoqnE6nl2r50VZQUZTXKlBO2+4L+Lb9fg+DwYC+qeJ5uVyWHMfVa8poNAL0EcwpigImkwkuiSmsVitSLAxDSJIEgiCA3W5HNEtdBH3f9+FwOMDxeARZlsF1XdB1/btDNNM0hcvlQpLX6zVIkgSiKALP88RnybIMNpsNaQK7xUYwl245juPGdliuiyH4MFsgz3MSFMuyykf5qUG+Nw8d4PfyPI9ovNaa9Run3FUwiiKqz+dzw7+egLsKaprWqVnolh3HIdGmt9ttq65zWjscDofwV93g307ZNE0S9+pbCOyp4Z+B4LDXQ33td9L3lgXsoDLoz/9bsAg7n1zbcD4CDz3Te8EvAQYAqk+1r1hdPOIAAAAASUVORK5CYII=";
var time="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAABJUlEQVQ4y53Tv04bQRDH8ZGIroJ3CKWLSPAGyAo9f/xpcIGUIkXKNH4CpDhCpqanwlZeByGEDKRxWqrg4iaFdfb5DlKwv2Z35yvNzsxvQyxV6Lky9eLZjSs9xSq6wg7cyYbuHK6DG4ZS+uPcvo6OfedmUhraWIFDqfTTphD27Alh00gp/ajAI6l0unzEvfvl/otSOhah8CRd1Ip69Fg7jaQnRTiRZrbeBLfMpH64ls5qgSYYzqRxeJC6/wW70kP4K23Xrj+bm/tusbrCtvQSnqWPNfBXo+m7FXjbSP1VKV0aGBj45kOVetwq5pOdVjGT0G+1Z13L9rQbvq6R9FsRQq8xwroWI+y9bopKlSmG77DZwkOvGfeo7fBQ6JuYmpubmujXv8I/W5gUrW8eHYwAAAAASUVORK5CYII=";
var letrero="data:image/png;base64,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"
var doc = new jsPDF()

doc.setFontSize(30);
//doc.addFont('ComicSansMS', 'Comic Sans', 'normal');
//doc.setFont('Comic Sans');
doc.text(70, 35, "Reporte - ToyMei");
doc.addImage(logo_ToyMei, 'PNG', 15, 20, 20, 20);
doc.addImage(letrero, 'PNG', 37, 23, 20, 15);
doc.setFontSize(10);
doc.text(160, 20, "Fecha reporte: " + fechaActual);

//Datos Medico
doc.setFontSize(15);
doc.setTextColor(0, 0, 255);
doc.text(20, 80, "Datos Fisioterapeuta");
doc.setTextColor(0);
doc.text(27, 90, "Nombre: " + dataMedico.nombre );
doc.text(27, 100, "Correo: " + dataMedico.email );
//doc.setTextColor(0);
//doc.text(27, 90, "Nombre: Luis Sanchez");
//doc.text(27, 100, "Correo: luis@mail.com ");
doc.addImage(user_icon, 'PNG', 20, 85, 5, 5);
doc.addImage(email, 'PNG', 20, 95, 5, 5);
doc.setLineWidth(0.5);
doc.line(15, 105, 200, 105);
doc.line(15, 107, 200, 107);




//Datos Paciente

doc.setFontSize(15);
doc.setTextColor(0, 0, 255);
doc.text(20, 117, "Datos Paciente");
doc.setTextColor(0);
doc.text(27, 127, "Nombre: " + dataPaciente.nombre + " " + dataPaciente.apellido );
doc.text(27, 137, "Correo: " + dataPaciente.correo);
doc.text(27, 147, "Cédula: " + dataPaciente.cedula);
doc.text(27, 157, "Fecha nacimiento: " + dataPaciente.nacimiento);
doc.text(103, 157, "- Edad: " + calculaEdad(dataPaciente.nacimiento));
doc.text(27, 167, "Fecha ingreso a ToyMei: " + dataPaciente.date);

//doc.setTextColor(0);
//doc.text(27, 127, "Nombre: Daniel Paramo");
//doc.text(27, 137, "Correo: daparamo@hotmail.com ");
//doc.text(27, 147, "Cedula: 1077086466 ")
//doc.text(27, 157, "Fecha nacimiento: 04-04-1993 ")
//doc.text(103, 157, "- Edad: 23")
//doc.text(27, 167, "Fecha ingreso a ToyMei: 02-11-2016 ")

doc.addImage(user_icon, 'PNG', 20, 123, 5, 5);
doc.addImage(email, 'PNG', 20, 132, 5, 5);
doc.addImage(cedula, 'PNG', 20, 143, 5, 5);
doc.addImage(fecha_nace, 'PNG', 20, 153, 5, 5);
doc.addImage(time, 'PNG', 20, 163, 4,4);
doc.setLineWidth(0.5);
doc.line(15, 173, 200, 173);
doc.line(15, 175, 200, 175);

//doc.text(15, 185, "El médico Luis Sanchez, propuso al paciente Daniel Paramo los siguientes") 
//doc.text(15, 192, "ejercicios:") 

doc.text(15, 185, "El médico " +dataMedico.nombre+ ", propuso al paciente " + dataPaciente.nombre + " " + dataPaciente.apellido +" los siguientes") 
doc.text(15, 192, "ejercicios:") 


//for (var i = 0; i < dataEjercicios.length; i++) 
for (var i = 0; i < dataEjercicios.length ; i++) 
 
{
    doc.addPage();
    var y=-15;
    var yAux=-15;
    //doc.setFontSize(10);
   // doc.text(160, 20, "ID - " + dataEjercicios[i].id_informe + " - " +fechaActual);
    doc.addImage(letrero, 'PNG', 190, 5, 15, 7);



    //Datos Ejercicio
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 255);
    doc.text(20, 40+y, "Ejercicio Propuesto");
    doc.setTextColor(0);
    doc.text(20, 50+y, "Nombre: " + MaysPrimera(dataEjercicios[i].nombre_ejercicio.toLowerCase()));  
    doc.text(20, 60+y, "Tipo: " +  MaysPrimera(dataEjercicios[i].tipo.toLowerCase())); 
    doc.text(20, 70+y, "Fecha creación: " + dataEjercicios[i].fecha_creacion );
    doc.text(20, 80+y, "Tiempo: " + dataEjercicios[i].tiempo + " segundos");
    if (dataEjercicios[i].repeticiones === 0) 
    {
         y=-25 
    }
    else
    {
        doc.text(20, 90+y, "Repeticiones: " + dataEjercicios[i].repeticiones + " veces");

    }
   
    doc.setLineWidth(0.5);
    doc.line(15, 97+y, 200, 97+y);
    doc.line(15, 99+y, 200, 99+y);


    doc.setTextColor(0, 0, 255);
    doc.text(20, 110+y, "Posiciones de Cubos")
    doc.addImage(dataEjercicios[i].imagen_ejercicio, 'JPEG', 25, 110,160, 120);
    doc.setLineWidth(0.5);
    doc.line(25, 110, 185, 110);
    doc.line(25, 230, 185, 230);

    doc.line(185, 110, 185, 230);

    doc.line(25, 110, 25, 230);
 
    
    //Cuadro observaciones
    doc.setLineWidth(0.5);
    doc.line(15, 270+y, 200, 270+y);
    doc.line(15, 295+y, 200, 295+y);
    doc.line(15, 295+y, 15, 270+y);
    doc.line(200, 295+y, 200, 270+y);

    //Observaciones
    doc.setFontSize(12);
    doc.setTextColor(0);
    if(dataEjercicios[i].eliminado === 1)
    {
        doc.setTextColor(0);
        doc.text(18, 276+y, "Observaciones: ");
        doc.setTextColor(255, 0, 0);
        doc.text(49, 276+y, "Ejercicio eliminado por el médico.");
    }
    else
    {    
        
        if (dataEjercicios[i].termino === 1) 
        {         doc.setTextColor(0, 255, 0);
                doc.text(48, 276+y, "Ejercicio finalizado después de "+datosPorEjercicio[i].length+" intentos.");
                doc.setTextColor(0);
                doc.text(18, 276+y, "Observaciones:");
        
        }
        else
        {
             doc.text(18, 276+y, "Observaciones: El paciente a realizado " + datosPorEjercicio[i].length + " intentos y no a finalizado la terapia.");
        }

        doc.setTextColor(0);
    }
    
  
  

  doc.addPage();
  doc.addImage(letrero, 'PNG', 190, 5, 15, 7);
   for (var g = 0, cont=0; g < datosPorEjercicio[i].length; g++, cont++) 
    {


      if (g===0 || g === 5) 
        {
            doc.setFontSize(15);
            doc.setTextColor(0, 0, 255);
            doc.text(20, 40+y, "Resultados " + MaysPrimera(dataEjercicios[i].nombre_ejercicio.toLowerCase()));
        };
        
        
      
       
   
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 255);
        doc.text(20, 50+yAux, "• Intento " + (g+1));
        doc.setTextColor(0);
        doc.text(20, 60+yAux, "Fecha Comienzo: " + datosPorEjercicio[i][g].fecha_inicio);
        doc.text(20, 70+yAux, "Fecha Terminado: " + datosPorEjercicio[i][g].fecha_finalizacion);
        
        if(datosPorEjercicio[i][g].termino_correctamente)
        {
         doc.setTextColor(0, 255, 0);
         doc.text(20, 80+yAux, "El paciente termino correctamente la terapia.");
        }
        else
        {    
            doc.setTextColor(255, 0, 0);
            doc.text(20, 80+yAux, "El paciente no termino correctamente la terapia.");
        }
        doc.setTextColor(0);
        doc.text(20, 90+yAux, "Observaciones: " + datosPorEjercicio[i][g].observaciones);
        
        
        yAux+=50;

        if (cont === 4) 
            {
                cont=-1;
                yAux=-15;
               doc.addPage(); 
            };


         // console.log(i,g);
    }; 

};





    if (type === "Ver") 
        {

           datosPorEjercicio=[];
            doc.output('dataurlnewwindow');
               
        };

    if (type === "Save") 
        {
          doc.output('save', 'Reporte '+ dataPaciente.nombre + " " + dataPaciente.apellido +".pdf")
          //doc.save('a4.pdf')  
        };

     if (type === "Enviar") 
        {
          var stringPDF = doc.output('datauristring')
          //console.log(stringPDF);







          swal({
                  title: "Enviar Informe",
                  imageUrl: "img/enviar_pdf.png",
                  text: "Selecciona la persona a la que deseeas enviar el informe",
                  showCancelButton: true,
                  confirmButtonColor: "#1c2127",
                  confirmButtonText: "Enviar a " + dataPaciente.nombre + " " + dataPaciente.apellido,
                  cancelButtonText: "Persona diferente",
                  closeOnConfirm: false,
                  closeOnCancel: false
                },
                function(isConfirm)
                {
                  if (isConfirm) 
                  {
                   
                   swal.close();
                    
                    //"pdf" : stringPDF, 
                    enviarPDF({"pdf" : stringPDF, opcion:"paciente" ,"correo": dataPaciente.correo  ,"nombreMedico" : dataMedico.nombre ,"nombrePaciente" : dataPaciente.nombre + " " + dataPaciente.apellido ,  "tipo": "enviarPDF"}, function(respuesta)
                                {
                                     if(respuesta.status)
                                    {
                                        swal
                                        ({   
                                            title   : "!Bien! :)",   
                                            text    : "Informe enviado con exito.",   
                                            timer   : 2000,
                                            type    : "success",  
                                            showConfirmButton: false 
                                        });

                                    }
                                    else
                                    {
                                        swal("Error!", "No se ha podido enviar informe a " + dataPaciente.correo, "error");
                                        
                                    }
                                
                                });






                  } 
                  else
                  {
                        swal({
                                title: "Enviar informe",
                                imageUrl: "img/enviar_pdf.png",
                                text: "Escribe el correo de la persona con la cual deseas compartir el informe de "+ dataPaciente.nombre + " " + dataPaciente.apellido,
                                type: "input",
                                confirmButtonColor: "#1c2127",
                                showCancelButton: true,
                                closeOnConfirm: false,
                                animation: "slide-from-top",
                                inputPlaceholder: "Escribe E-mail",
                                cancelButtonText: 'Cancelar'
                            },
                            function(inputValue)
                            {
                                if (inputValue === false) return false;
                                if (inputValue === "" || !validaEmail(inputValue))
                                {
                                    swal.showInputError("El correo no es válido");
                                    return false;
                                }
                                //Para enviar el correo a través del servicio...

                                 swal.close();
                                //  
                                enviarPDF({"pdf" : stringPDF, opcion: "otra_persona" ,"correo": inputValue  ,"nombreMedico" : dataMedico.nombre ,"nombrePaciente" : dataPaciente.nombre + " " + dataPaciente.apellido , "tipo": "enviarPDF"}, function(respuesta)
                                {

                                     if(respuesta.status)
                                    {
                                        swal
                                        ({   
                                            title   : "!Bien! :)",   
                                            text    : "Informe enviado con exito.",   
                                            timer   : 2000,
                                            type    : "success",  
                                            showConfirmButton: false 
                                        });

                                    }
                                    else
                                    {
                                        swal("Error!", "No se ha podido enviar informe a " + inputValue, "error");
                                        
                                    }
                                });
                            });
                    }
             });



        };

    
 
       //Abrir el pdf en una nueva ventana
/*
doc.output('save', 'filename.pdf'); //Guarda PDF con el nombre respectivo - No funciona en versiones anteriores a Internet Explorer 10 ni en moviles
doc.output('datauristring');        //Retorna el PDF creado en Base64
doc.output('datauri');              //Abre el PDF en la misma ventana
doc.output('dataurlnewwindow');     //Abre el PDF en una nueva ventana
*/
};




 function traerDatos_Medico (callback)
    {        
        $.ajax(
        {
            url         : "traerDatos_Medico",
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
                { 
                 window.location = "/" 
                }, delay);
        });

    }





function enviarPDF (datos,callback) 
    {

        $(".se-pre-con").fadeIn('slow');
        var data = {};
        data.correo = datos.correo;
        data.pdf = datos.pdf;
        data.tipo = datos.tipo;
        data.nombreMedico = datos.nombreMedico;
        data.nombrePaciente = datos.nombrePaciente;
        data.opcion = datos.opcion;

        $.ajax(
        {
            url         : "mail",
            type        : "POST",
            data        : JSON.stringify(data),
            dataType    : "json",
            contentType: "application/json; charset=utf-8"
        }).done(function(data)
        {
            $(".se-pre-con").fadeOut('slow');
            callback(data);

            

        }).error(function(request, status, error)
        {
            

           sweetAlert("Oops...", request.responseText, "error");
            //alert(request.responseText);
            window.location = "/";
        });

    }












   nom_div("buscar").addEventListener('keyup', function(event)
    {
        resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if(this.value !== "")
        {
            for(var i = 0; i < listadoPersonas.length; i++)
            {

                busca = listadoPersonas[i].cedula.search(this.value) < 0;
                busca = busca && listadoPersonas[i].nombre.search(this.value) < 0;
                busca = busca && listadoPersonas[i].apellido.search(this.value) < 0;
                busca = busca && listadoPersonas[i].correo.search(this.value) < 0;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeUsuarios();
    });



     function nom_div(div)
    {
        return document.getElementById(div);
    }


    function calculaEdad (fechanacimiento) 
    {
        var fecha_actual = new Date();
        var parteFn = fechanacimiento.split("-");
        var fechaCompara = new Date(parteFn[0], parteFn[1], parteFn[2]); //año, mes día
        return Math.floor((fecha_actual - fechaCompara) / 1000 / 3600 / 24 / 365);
        //Milisegundos, segundos en una hora, horas en un día, días en un año...
    }


     var validaEmail = function(email)
    {
        var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        return emailReg.test(email);
    };

  
    $("#todos").height($(window).height() - 125);
    $(window).resize(function(event) {
        $("#todos").height($(window).height() - 125);
    });
});
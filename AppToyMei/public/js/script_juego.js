window.onload = function()
{


    var id_ejercicio = $('#id_ejercicio').val();
    //console.log(id_ejercicio);

    //Variable para traer la configuración del ejercicio
     repeticiones = 0;
     tiempo = 0;
     coordenadas = [];
     tipo_ejercicio = "";
     var iniciar=false;

     var primer_cubo = 1; //Poner el número en el cubo  
     var veces_ganadas = 0; //Saber cuantas veces a destruido los cubos. 
     var observaciones="";


    var fecha_inicio     =   moment().format("DD-MM-YYYY, h:mm:ss a")


     //Para los sonidos...
    createjs.Sound.registerSound("../sounds/collision8.mp3", "disparo"); //Cargar el sonido de disparo 
    createjs.Sound.registerSound("../sounds/explosion2.mp3", "explosion"); //Cargar el sonido de explosion 
    createjs.Sound.registerSound("../sounds/salirse.mp3", "salirse"); //Cargar el sonido de tiempo agotado
    createjs.Sound.registerSound("../sounds/exito.mp3", "exito"); //Cargar el sonido exito
    createjs.Sound.registerSound("../sounds/reloj.mp3", "reloj"); //Cargar el sonido reloj


  

  function updateEjercicioFinalizado (id,callback) 
    {
        var data = {};
        data.id_ejercicio = id;
    
       // console.log(data);    
        $.ajax(
        {
            url         : "/enviarIdEjercicio/updateEjercicioFinalizado",
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




function insertarInforme(datos,callback) 
    {
        var data = {};
        
        data.id_medico              = datos.id_medico;
        data.id_ejercicio           = datos.id_ejercicio;
        data.id_paciente            = datos.id_paciente;
        data.fecha_inicio           = datos.fecha_inicio;
        data.fecha_finalizacion     = datos.fecha_finalizacion;
        data.termino_correctamente  = datos.termino_correctamente;
        data.observaciones          = datos.observaciones;
        data.date                   = moment().format("YYYY-MM-DD h:mm:ss");



        $.ajax(
        {
            url         : "/enviarIdEjercicio/insertarInforme",
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
            //¿alert(request.responseText);
            //window.location = "/";
        });
                 
     }


function traerCoordenadas (id_ejercicio,callback) 
    {
        var data = {};
        data.id_ejercicio = id_ejercicio;
                
        $.ajax(
        {
            url         : "/enviarIdEjercicio/traerCoordenadas",
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
            window.location = "/";
        });
    };


traerCoordenadas(id_ejercicio, function(data)
{

    repeticiones = data.repeticiones; //Igualar la varible repeticiones con lo que llega del callback
    tiempo = data.tiempo;
    coordenadas = JSON.parse(data.coordenadas); //Igualar la varible coordenadas con lo que llega del callback y PArsearlo ya que llega como JSON
    tipo_ejercicio = data.tipo; //Igualar la varible tipo_ejercicio con lo que llega del callback
     
    for (var i = 0; i < coordenadas.length; i++) 
    {
        coordenadas[i].x = coordenadas[i].x/25; //Corregir la posición en x 
        coordenadas[i].y = (coordenadas[i].y/25)+8; //Corregir la posición en y
        coordenadas[i].z = coordenadas[i].z/25; //Corregir la posición en z
    };


  //tiempo = 2;


////////////**************************************EJERCITAR*****************************************///////////////////






   if (tipo_ejercicio === "Ejercitar")  
    {
        

     //   console.log("Entro a Ejercitar")


    camera = 0 //Dejar la camara para verla global     
    var renderer, scene;
    var effect, controls;
    var element, container;
    var clock = new THREE.Clock();

    //Esferas del cañón...
    var sphereShape = 0, sphereBody = 0, world = 0;
    balls = [], ballMeshes = [], cubes = [];
    
    //Para el disparo..
    //var dt = 1 / 60; //Velocidad de salida de la bola
    var dt = 1 / 60; //Velocidad de salida de la bola
    var cont = 0, tiempoDisparo = 50; // Tiempo que se demora en dispara cada bola
    //Para el cañón...
    var ballShape = new CANNON.Sphere(0.8); //Tamaño de la bola que dispara
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32); //Crear la geometria de la bola
    var shootDirection = new THREE.Vector3();
    var shootVelo = 50; //Velocidad de disparo
    var projector = new THREE.Projector();
    var material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

    var divPuntua = document.getElementsByClassName('txt'); //Manejar texto en pantalla número de vubos destruidos

    var time = document.getElementsByClassName('txt'); //Texto en pantalla tiempo
    var maxCubes = coordenadas.length; //Cubos en la escena
    var numChoca = 0; // Variable para conocer cuantos cubos a destruido


    initCannon();
    init();
    animate();
    camera.position.set(-0.040360565180688784,10.115226235290875,-0.008179841321561713); //Posicion inicial de la camara

   


      //Para el cañón...
    function initCannon()
    {
        world = new CANNON.World();
        world.gravity.set(0,0,0);
        var mass = 5, radius = 2;
        sphereShape = new CANNON.Sphere(radius);
        sphereBody = new CANNON.Body({ mass: mass });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0,10,0);
        sphereBody.linearDamping = 0.9;
    }

    function init()
    {
        

       //divPuntua[0].innerHTML = divPuntua[1].innerHTML = numChoca + " / " + maxCubes;
        divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Busca el cubo 1" ;
        divPuntua[4].innerHTML = divPuntua[5].innerHTML = "Repeticiones " +  "0 / " + repeticiones;

        setInterval(function()
            { 
               time[2].innerHTML = time[3].innerHTML = tiempo-=1; 
               if(tiempo === 0)
                    {
                      
                     
                      //Descomentar para poner sonido
                      createjs.Sound.play("reloj");
                      var a = function()
                      {
                        createjs.Sound.stop("reloj");
                      }
                     setTimeout(a, 2000);
                    

                     var fecha_finalizacion     =   moment().format("DD-MM-YYYY, h:mm:ss a");
                     $('#tiempoizq').hide();
                     $('#tiempoder').hide();

                    //Insertar informe sobre tiempo agotado

                    insertarInforme({"fecha_finalizacion" : fecha_finalizacion,"fecha_inicio" : fecha_inicio,"id_medico" : data.id_medico ,  "id_ejercicio" : data.id_ejercicio, "id_paciente": data.id_paciente, "termino_correctamente" : 0, "observaciones": "Tiempo agotado, el paciente ha realizado " +  veces_ganadas + " repeticiones de " + repeticiones +" configuradas." }, function(data)
                        {
                                                  
                            if(data.status)
                                {                      
                                  swal
                                  (
                                      {
                                          title              : "Oops Tiempo agotado",
                                          text               : "A finalizado la terapia incorrectamente vuelve a intentarlo",
                                          showCancelButton   : true,
                                          imageUrl           : "../img/clock.gif",
                                          confirmButtonColor : "#1c2127",
                                          confirmButtonText  : "Intentar de nuevo ",
                                          cancelButtonText   : "Ir al menú principal",
                                          closeOnConfirm     : false,
                                          closeOnCancel      : false
                                     },
                                     function(isConfirm)
                                     {
                                      if (isConfirm) 
                                      {
                                        window.location.reload();
                                      } 
                                      else
                                      {
                                        //Descomentar para poner sonidos  
                                        createjs.Sound.play("salirse");
                                        var salir = function()
                                        {
                                          window.location = "../";
                                        }
                                        setTimeout(salir, 2000);
                                      };
                                      }); 
                                };
                        }); 
                    };
            }, 1000);


 

        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('example');
        container.appendChild(element);
        
        //División de pantalla...
        //http://jaanga.github.io/cookbook/cardboard/readme-reader.html
        effect = new THREE.StereoEffect(renderer);
        effect.separation = 0.2;
        scene = new THREE.Scene();
        
        //Se agrega la camara...
        camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
        camera.position.set(0, 10, 0);
        scene.add(camera);
        
        //Manejo de controls, OrbitControls...
        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set(
            camera.position.x + 0.1,
            camera.position.y + 0.1,
            camera.position.z
        );
        controls.noZoom = false;
        controls.noPan = false;
        //controls.autoRotate = true;

        //Manejo de luces en la escena
        var ambient = new THREE.AmbientLight( "0x111111" );
        scene.add( ambient );
        light = new THREE.SpotLight( "red" );
        light.position.set( -300, 30, 200);
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;//camera.far;
        light.shadowCameraFov = 40;
        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadowMapWidth = 2 * 512;
        light.shadowMapHeight = 2 * 512;
        scene.add(light);

/*
    
    //GRILLA

    //GridHelper( tamaño, cuadros totales a lo largo y ancho, color de la cruz del plano, color de lineas);
    var helper = new THREE.GridHelper( 200, 20, 0x0000ff, 0x808080);
    helper.position.y = - 199; //--> Posicion en Y con respecto a los cubos mas lejos o mas cerca
    helper.material.opacity = 0.7; // --> Opacidad de las lineas de la grilla
    helper.material.transparent = true;
    scene.add( helper ); //--> Agregar a la scena la grillas

    var axis = new THREE.AxisHelper();
    axis.position.set( -500, -500, -500 );
    scene.add( axis );

*/

    function setOrientationControls(e)
    {
        if (e.alpha)
        {
            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
    }
    
    window.addEventListener('deviceorientation', setOrientationControls, true);
    crearCubos();


    //**Crear mira
    //Adicionar la mira y asociarla a la camara...
    var geometryTest = new THREE.BoxGeometry(1, 1, 0);
    var texture = THREE.ImageUtils.loadTexture('../img/miraWhite.png');
    texture.anisotropy = renderer.getMaxAnisotropy();
    var material = new THREE.MeshBasicMaterial({map: texture, transparent : true});
    personaje = new THREE.Mesh( geometryTest, material);
    camera.add(personaje);
    personaje.position.set(0, 0, -3);


    //Crear entorno con imagenes
    //http://stemkoski.github.io/Three.js/Skybox.html
    var imagePrefix = "../img/escenario_ejercitar/";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry( 800, 800, 800 ); //Posicion de la persona en la escena
    var materialArray = [];
    for (i = 0; i < 6; i++)
    {
        materialArray.push( new THREE.MeshBasicMaterial
        ({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    }
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add(skyBox);
    //Fin del cielo...
    window.addEventListener('resize', resize, false);
}


function crearCubos () 
{

    //https://github.com/jeromeetienne/threex.dynamictexture
    var geometry = new THREE.BoxGeometry(2,2,2);
    
    for(var i = 1; i <= maxCubes; i++)
    {
        var dynamicTexture  = new THREEx.DynamicTexture(512,512)
        dynamicTexture.context.font = "bolder 450px Verdana ";
        dynamicTexture.texture.anisotropy = renderer.getMaxAnisotropy()
        dynamicTexture.clear(randomColor());
        dynamicTexture.drawText(''+i, 90, 400, randomColor());  // dynamicTexture.drawText("nombre del texto",x,y,"color")
      
        var material  = new THREE.MeshBasicMaterial({ map : dynamicTexture.texture })
        cubes.push({
                        element : new THREE.Mesh(geometry, material),
                        lejania : Math.floor(Math.random() * (30 - 5 + 1)) + 5,
                        name    : "cube_" + i,
                        vel     : 0
                   });
            
            
            cubes[cubes.length - 1].element.position.set(coordenadas[i-1].x, coordenadas[i-1].y , coordenadas[i-1].z);
            cubes[cubes.length - 1].element.name = "cube_" + i;
            scene.add(cubes[cubes.length - 1].element);
    }
};


    function resize()
    {
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        effect.setSize(width, height);
    }

    function update(dt)
    {
         resize();
         camera.updateProjectionMatrix();
         controls.update(dt);
    }

    function render(dt)
    {

                  effect.render(scene, camera);
    }

    function animate(t)
    {

        requestAnimationFrame(animate);
        cont++;
        if(cont >= tiempoDisparo)
        {
            createjs.Sound.play("disparo");
            disparar();
            cont = 0;
        }
       

        var eliminar = [];
        world.step(dt);
        for(i = 0; i < balls.length; i++)
        {
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
            if(balls[i].position.x >= 40 || balls[i].position.x <= -40)
            {
                eliminar.push(i);
            }
            else if (balls[i].position.y >= 180 || balls[i].position.y <= -180)
            {
                eliminar.push(i);
            }
            else if (balls[i].position.z >= 40 || balls[i].position.z <= -40)
            {
                eliminar.push(i);
            }
        }

        for(i = 0; i < eliminar.length; i++)
        {
            var selectedObject = scene.getObjectByName(ballMeshes[eliminar[i]].name);
            scene.remove(selectedObject);
            balls.splice(eliminar[i], 1);
            ballMeshes.splice(eliminar[i], 1);
        }
        update(clock.getDelta());
        render(clock.getDelta());
        collision();
    }

    function getShootDir(targetVec)
    {
        var vector = targetVec;
        targetVec.set(0,0,1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
        targetVec.copy(ray.direction);
    }

    var disparar = function()
    {
        //https://github.com/schteppe/cannon.js
        var x = sphereBody.position.x;
        var y = sphereBody.position.y;
        var z = sphereBody.position.z;
        ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(ballShape);
        var ballMesh = new THREE.Mesh( ballGeometry, material );
        ballMesh.name = "bullet_" + ballMesh.id;
        world.addBody(ballBody);
        scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        getShootDir(shootDirection);
        ballBody.velocity.set(  shootDirection.x * shootVelo,
                                shootDirection.y * shootVelo,
                                shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
        y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
        z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
    }

    //Detectar colisión --> https://stemkoski.github.io/Three.js/Collision-Detection.html
    function collision()
    {
        var eliminar = [];
        for(var i = 0; i < cubes.length; i++)
        {
            var originPoint = cubes[i].element.position.clone();

            for (var vertexIndex = 0; vertexIndex < cubes[i].element.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = cubes[i].element.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( cubes[i].element.matrix );
                var directionVector = globalVertex.sub( cubes[i].element.position );
                var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                var collisionResults = ray.intersectObjects( ballMeshes );

                if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && cubes[i].name === "cube_"+primer_cubo)
                {
                    primer_cubo++;
                    var selectedObject = collisionResults[0].object.name;
                    createjs.Sound.play("explosion");
                    numChoca++;
                   // divPuntua[0].innerHTML = divPuntua[1].innerHTML = numChoca + " / " + maxCubes;
                   divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Busca el cubo "+ (numChoca+1);
                    
                    if(numChoca >= maxCubes)
                    {

                      veces_ganadas++;
                      if (veces_ganadas === repeticiones) 
                        {
                            //console.log("Gano");
                         
                          
                          //Descomentar para poner sonido
                          createjs.Sound.play("exito");
                          var sonidoExito = function()
                          {
                            createjs.Sound.stop("exito");
                          }
                         setTimeout(sonidoExito, 2000);
                      


                         var fecha_finalizacion     =   moment().format("DD-MM-YYYY, h:mm:ss a");
                         $('#tiempoizq').hide();
                         $('#tiempoder').hide();

                //Insertar informe sobre tiempo agotado
                 

                                                


                 insertarInforme({"fecha_finalizacion" : fecha_finalizacion,"fecha_inicio" : fecha_inicio,"id_medico" : data.id_medico ,  "id_ejercicio" : data.id_ejercicio, "id_paciente": data.id_paciente, "termino_correctamente" : 1 , "observaciones": "El paciente ha realizado " +  veces_ganadas + " repeticiones de " + repeticiones +" configuradas." }, function(data)
                                            {
                                                  
                                                if(data.status)
                                                {
                                                    updateEjercicioFinalizado(data.id_ejercicio,function(data)
                                                    {
                                                        if(data.status)
                                                        {                      
                                                              swal({
                                                          title: "Exito",
                                                          text: "Haz finalizado la terapia exitosamente :)",
                                                          showCancelButton: false,
                                                          imageUrl: "../img/like.jpg", 
                                                          showCancelButton : false,
                                                          showConfirmButton : false
                                                          
                                                          });   
                                                          
                                                          var irMenu = function()
                                                          {
                                                              window.location = "../";
                                                          }
                                                          setTimeout(irMenu, 4000); 
                                                         
                                                        };
                                                    });

                                                    
                                                }

                                            }); 











                        };

                        divPuntua[4].innerHTML = divPuntua[5].innerHTML = "Repeticiones " +  veces_ganadas + " / " + repeticiones;
                        //divPuntua[0].innerHTML = divPuntua[1].innerHTML = "0 / " + maxCubes;
                        divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Busca el cubo 1" ;
                        numChoca=0;
                        primer_cubo = 1; 
                        crearCubos();
                    }
                    eliminar.push(i);
                }
            }
        }

        var indElimina = 0;
        for(i = 0; i < eliminar.length; i++)
        {
            var selectedObject = scene.getObjectByName(cubes[eliminar[i]].name);
            scene.remove(selectedObject);
            cubes.splice(eliminar[i], 1);
        }
    }

    function fullscreen()
    {
        if (container.requestFullscreen)
        {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen)
        {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen)
        {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen)
        {
            document.documentElement.webkitRequestFullscreen();
        }
    }

    function randomColor () 
    {
        // from http://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
        (c && lol(m,s,c-1))})(Math,'0123456789ABCDEF',4);
    };



};


///////////////////******************************************************************************///////////////////////////////////////
//Juego estiramiento

    if (tipo_ejercicio === "Estiramiento") 
    {

    tiempo = tiempo*coordenadas.length; //Igualar la varible tiempo con lo que llega del callback


      
    
var h=13;

    colores = [];

    var r = new Array("00","33","66","99","CC","FF"); 
    var g = new Array("00","33","66","99","CC","FF"); 
    var b = new Array("00","33","66","99","CC","FF"); 

    for (i=0;i<r.length;i++)
    { 
          for (j=0;j<g.length;j++) 
          { 
             for (k=0;k<b.length;k++) 
             { 
                var nuevoc = "#" + r[i] + g[j] + b[k];
                 colores.push(nuevoc); 
             } 
          }
    } 



    //console.log("Entro a Estiramiento")
    
    

    camera = 0 //Dejar la camara para verla global     
    var renderer, scene;
    var effect, controls;
    var element, container;
    var clock = new THREE.Clock();

    //Esferas del cañón...
    var sphereShape = 0, sphereBody = 0, world = 0;
    balls = [], ballMeshes = [], cubes = [];
    
    //Para el disparo..
    var dt = 1 / 60; //Velocidad de salida de la bola
    var cont = 0, tiempoDisparo = 50; // Tiempo que se demora en dispara cada bola
    //Para el cañón...
    var ballShape = new CANNON.Sphere(1.7); //Tamaño de la bola que dispara
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32); //Crear la geometria de la bola
    var shootDirection = new THREE.Vector3();
    var shootVelo = 50; //Velocidad de disparo
    var projector = new THREE.Projector();
    var material = new THREE.MeshLambertMaterial(  {transparent: true, opacity: 0 } );

    var divPuntua = document.getElementsByClassName('txt'); //Manejar texto en pantalla número de vubos destruidos
    var time = document.getElementsByClassName('txt'); //Texto en pantalla tiempo
    var maxCubes = coordenadas.length; //Cubos en la escena
    var cubos_verde=0;
  

    initCannon();
    init();
    animate();
    camera.position.set(-0.040360565180688784,10.115226235290875,-0.008179841321561713); //Posicion inicial de la camara

    //Para los sonidos...
    //createjs.Sound.registerSound("../sounds/collision8.mp3", "disparo"); //Cargar el sonido de disparo 
   //createjs.Sound.registerSound("../sounds/explosion2.mp3", "explosion"); //Cargar el sonido de explosion 

      //Para el cañón...
    function initCannon()
    {
        world = new CANNON.World();
        world.gravity.set(0,0,0);
        var mass = 5, radius = 2;
        sphereShape = new CANNON.Sphere(radius);
        sphereBody = new CANNON.Body({ mass: mass });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0,10,0);
        sphereBody.linearDamping = 0.9;
    }

    function init()
    {
       
        divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Cubos ocultos " + cubos_verde + " / " + maxCubes;
        
        setInterval(function()
            { 
               time[2].innerHTML = time[3].innerHTML = tiempo-=1; 
               if(tiempo === 0)
                    {
                      
                     
                      //Descomentar para poner sonido
                      createjs.Sound.play("reloj");
                      var a = function()
                      {
                        createjs.Sound.stop("reloj");
                      }
                     setTimeout(a, 2000);
                    

                     var fecha_finalizacion     =   moment().format("DD-MM-YYYY, h:mm:ss a");
                     $('#tiempoizq').hide();
                     $('#tiempoder').hide();

                    //Insertar informe sobre tiempo agotado

                    insertarInforme({"fecha_finalizacion" : fecha_finalizacion,"fecha_inicio" : fecha_inicio,"id_medico" : data.id_medico ,  "id_ejercicio" : data.id_ejercicio, "id_paciente": data.id_paciente, "termino_correctamente" : 0, "observaciones": "Tiempo agotado, el paciente ha mirado "+ cubos_verde +" de " + maxCubes +"cubos fijamente." }, function(data)
                        {
                                                  
                            if(data.status)
                                {                      
                                  swal
                                  (
                                      {
                                          title              : "Oops Tiempo agotado",
                                          text               : "A finalizado la terapia incorrectamente vuelve a intentarlo",
                                          showCancelButton   : true,
                                          imageUrl           : "../img/clock.gif",
                                          confirmButtonColor : "#1c2127",
                                          confirmButtonText  : "Intentar de nuevo ",
                                          cancelButtonText   : "Ir al menú principal",
                                          closeOnConfirm     : false,
                                          closeOnCancel      : false
                                     },
                                     function(isConfirm)
                                     {
                                      if (isConfirm) 
                                      {
                                        window.location.reload();
                                      } 
                                      else
                                      {
                                        //Descomentar para poner sonidos  
                                        createjs.Sound.play("salirse");
                                        var salir = function()
                                        {
                                          window.location = "../";
                                        }
                                        setTimeout(salir, 2000);
                                      };
                                      }); 
                                };
                        }); 
                    };

            }, 1000);


        renderer = new THREE.WebGLRenderer();
        element = renderer.domElement;
        container = document.getElementById('example');
        container.appendChild(element);
        
        //División de pantalla...
        //http://jaanga.github.io/cookbook/cardboard/readme-reader.html
        effect = new THREE.StereoEffect(renderer);
        effect.separation = 0.2;
        scene = new THREE.Scene();
        
        //Se agrega la camara...
        camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
        camera.position.set(0, 10, 0);
        scene.add(camera);
        
        //Manejo de controls, OrbitControls...
        controls = new THREE.OrbitControls(camera, element);
        controls.rotateUp(Math.PI / 4);
        controls.target.set(
            camera.position.x + 0.1,
            camera.position.y + 0.1,
            camera.position.z
        );
        controls.noZoom = false;
        controls.noPan = false;
        //controls.autoRotate = true;

        //Manejo de luces en la escena
       var ambient = new THREE.AmbientLight( "0x111111" );
        scene.add( ambient );
        light = new THREE.SpotLight( "red" );
        light.position.set( -300, 30, 200);
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        light.shadowCameraNear = 20;
        light.shadowCameraFar = 50;//camera.far;
        light.shadowCameraFov = 40;
        light.shadowMapBias = 0.1;
        light.shadowMapDarkness = 0.7;
        light.shadowMapWidth = 2 * 512;
        light.shadowMapHeight = 2 * 512;
        scene.add(light);




    function setOrientationControls(e)
    {
        if (e.alpha)
        {
            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
            element.addEventListener('click', fullscreen, false);
            window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
    }
    
    window.addEventListener('deviceorientation', setOrientationControls, true);
    crearCubos();


    //**Crear mira
    //Adicionar la mira y asociarla a la camara...
    var geometryTest = new THREE.BoxGeometry(1, 1, 0);
    var texture = THREE.ImageUtils.loadTexture('../img/mira_estiramiento.png');
    texture.anisotropy = renderer.getMaxAnisotropy();
    var material = new THREE.MeshBasicMaterial({map: texture, transparent : true});
    personaje = new THREE.Mesh( geometryTest, material);
    camera.add(personaje);
    personaje.position.set(0, 0, -3);


    //Crear entorno con imagenes
    //http://stemkoski.github.io/Three.js/Skybox.html
    var imagePrefix = "../img/escenario_estiramiento/";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry( 800, 800, 800 ); //Posicion de la persona en la escena
    var materialArray = [];
    for (i = 0; i < 6; i++)
    {
        materialArray.push( new THREE.MeshBasicMaterial
        ({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    }
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add(skyBox);
    //Fin del cielo...
    window.addEventListener('resize', resize, false);
}


function crearCubos () 
{

    //https://github.com/jeromeetienne/threex.dynamictexture
  var geometry = new THREE.BoxGeometry(2,2,2);
    
    for(var i = 1; i <= maxCubes; i++)
    {
        var texture = THREE.ImageUtils.loadTexture("../img/box_"+(Math.floor(Math.random() * 8) + 1)+".jpg");
            texture.anisotropy = renderer.getMaxAnisotropy();
            var material = new THREE.MeshBasicMaterial({map: texture});
         cubes.push({
                        element : new THREE.Mesh(geometry, material),
                        lejania : Math.floor(Math.random() * (30 - 5 + 1)) + 5,
                        name    : "cube_" + i,
                        vel     : 0
                    
                   });
            
            
            cubes[cubes.length - 1].element.position.set(coordenadas[i-1].x, coordenadas[i-1].y , coordenadas[i-1].z);
            cubes[cubes.length - 1].element.name = "cube_" + i;
            scene.add(cubes[cubes.length - 1].element);
    }


    
 

};


    function resize()
    {
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        effect.setSize(width, height);
    }

    function update(dt)
    {
        resize();
        camera.updateProjectionMatrix();
        controls.update(dt);

    }

    function render(dt)
    {

        effect.render(scene, camera);

    }

    function animate(t)
    {

        requestAnimationFrame(animate);
        cont++;
        if(cont >= tiempoDisparo)
        {
        //    createjs.Sound.play("disparo");
            disparar();
            cont = 0;
        }
       

        var eliminar = [];
        world.step(dt);
        for(i = 0; i < balls.length; i++)
        {
            ballMeshes[i].position.copy(balls[i].position);
            ballMeshes[i].quaternion.copy(balls[i].quaternion);
            if(balls[i].position.x >= 180 || balls[i].position.x <= -180)
            {
                eliminar.push(i);
            }
            else if (balls[i].position.y >= 180 || balls[i].position.y <= -180)
            {
                eliminar.push(i);
            }
            else if (balls[i].position.z >= 180 || balls[i].position.z <= -180)
            {
                eliminar.push(i);
            }
        }

        for(i = 0; i < eliminar.length; i++)
        {
            var selectedObject = scene.getObjectByName(ballMeshes[eliminar[i]].name);
            scene.remove(selectedObject);
            balls.splice(eliminar[i], 1);
            ballMeshes.splice(eliminar[i], 1);
        }
        update(clock.getDelta());
        render(clock.getDelta());
        collision();
    }

    function getShootDir(targetVec)
    {
        var vector = targetVec;
        targetVec.set(0,0,1);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
        targetVec.copy(ray.direction);
    }

    var disparar = function()
    {
        //https://github.com/schteppe/cannon.js
        var x = sphereBody.position.x;
        var y = sphereBody.position.y;
        var z = sphereBody.position.z;
        ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(ballShape);
        var ballMesh = new THREE.Mesh( ballGeometry, material );
        ballMesh.name = "bullet_" + ballMesh.id;
        world.addBody(ballBody);
        scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        getShootDir(shootDirection);
        ballBody.velocity.set(  shootDirection.x * shootVelo,
                                shootDirection.y * shootVelo,
                                shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
        y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
        z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
    }

    //Detectar colisión --> https://stemkoski.github.io/Three.js/Collision-Detection.html
    function collision()
    {
        var eliminar = [];
        for(var i = 0; i < cubes.length; i++)
        {
            var originPoint = cubes[i].element.position.clone();

            for (var vertexIndex = 0; vertexIndex < cubes[i].element.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = cubes[i].element.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( cubes[i].element.matrix );
                var directionVector = globalVertex.sub( cubes[i].element.position );
                var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
                var collisionResults = ray.intersectObjects( ballMeshes );

                if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
                {
                   
                    var selectedObject = collisionResults[0].object.name;
                 //   createjs.Sound.play("explosion");
                    
                
                //divPuntua[4].innerHTML = divPuntua[5].innerHTML = "Repeticiones " +  veces_ganadas + " / " + repeticiones;
              //  divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Cubos / " + maxCubes;
                      

                    
               // console.log(cubes[i].element.scale.x);
                    
                    //  eliminar.push(i);
                   //cubes[i].element.scale.x -= 0.001;
                     
                     cubes[i].element.scale.x -= 1/(tiempo+(tiempo*0.25));
                     cubes[i].element.scale.y -= 1/(tiempo+(tiempo*0.25));
                     cubes[i].element.scale.z -= 1/(tiempo+(tiempo*0.25));


                     //0.98
                     //0.16999999999999926


                     //Estaba en 0.5

                     if ((cubes[i].element.scale.x || cubes[i].element.scale.y || cubes[i].element.scale.z) <= 0.5 ) 
                        {
                            //Pone verde el cubo
                           // cubes[i].element.material.color.b = 0 ;
                           // cubes[i].element.material.color.r = 0 ;
                           // cubes[i].element.material.color.g = 204 ;
                            eliminar.push(i);
                            cubes[i].element.scale.x = 1;
                            cubes[i].element.scale.y = 1;
                            cubes[i].element.scale.z = 1;

                            cubos_verde++;
                        };

                     divPuntua[0].innerHTML = divPuntua[1].innerHTML = "Cubos ocultos " + cubos_verde + " / " + maxCubes;
                       console.log(cubos_verde,maxCubes)  



                       if(cubos_verde === maxCubes)
                    {
                      
                        console.log("Gano");
                         
                          
                          //Descomentar para poner sonido
                          createjs.Sound.play("exito");
                          var sonidoExito = function()
                          {
                            createjs.Sound.stop("exito");
                          }
                         setTimeout(sonidoExito, 2000);
                        


                         var fecha_finalizacion     =   moment().format("DD-MM-YYYY, h:mm:ss a");
                         $('#tiempoizq').hide();
                         $('#tiempoder').hide();

                //Insertar informe sobre tiempo agotado
                 

                                                


                 insertarInforme({"fecha_finalizacion" : fecha_finalizacion,"fecha_inicio" : fecha_inicio,"id_medico" : data.id_medico ,  "id_ejercicio" : data.id_ejercicio, "id_paciente": data.id_paciente, "termino_correctamente" : 1 , "observaciones": "El paciente ha cumplido el objetivo de mirar fijamente " + cubos_verde + " cubos." }, function(data)
                                            {
                                                  
                                                if(data.status)
                                                {
                                                    updateEjercicioFinalizado(data.id_ejercicio,function(data)
                                                    {
                                                        if(data.status)
                                                        {                      
                                                              swal({
                                                          title: "Exito",
                                                          text: "Haz finalizado la terapia exitosamente :)",
                                                          showCancelButton: false,
                                                          imageUrl: "../img/like.jpg", 
                                                          showCancelButton : false,
                                                          showConfirmButton : false
                                                          
                                                          });   
                                                          
                                                          var irMenu = function()
                                                          {
                                                              window.location = "../";
                                                          }
                                                          setTimeout(irMenu, 4000); 
                                                         
                                                        };
                                                    });

                                                    
                                                }

                                            }); 


                        };



              

                }
            }
        }

        var indElimina = 0;
        for(i = 0; i < eliminar.length; i++)
        {
            var selectedObject = scene.getObjectByName(cubes[eliminar[i]].name);
            scene.remove(selectedObject);
            cubes.splice(eliminar[i], 1);
        }
    }


    function fullscreen()
    {
        if (container.requestFullscreen)
        {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen)
        {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen)
        {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen)
        {
            document.documentElement.webkitRequestFullscreen();
        }
    }


    function randomColor () 
    {
        // from http://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
        (c && lol(m,s,c-1))})(Math,'0123456789ABCDEF',4);
    };

 

}












});   















   
};



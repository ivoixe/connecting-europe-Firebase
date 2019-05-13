
var app = {

    // Application Constructor

    initialize: function() {

        this.bindEvents();

    },

    // Bind Event Listeners

    //

    // Bind any events that are required on startup. Common events are:

    // 'load', 'deviceready', 'offline', and 'online'.

    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);

    },

    // deviceready Event Handler

    //

    // The scope of 'this' is the event. In order to call the 'receivedEvent'

    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function() {

        app.receivedEvent('deviceready');





    },

    // Update DOM on a Received Event

    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);

        var listeningElement = parentElement.querySelector('.listening');

        var receivedElement = parentElement.querySelector('.received');



        listeningElement.setAttribute('style', 'display:none;');

        receivedElement.setAttribute('style', 'display:block;');



        console.log('Received Event: ' + id);



        function editSelects(event) {

            document.getElementById('choose-sel').removeAttribute('modifier');

            if (event.target.value == 'material' || event.target.value == 'underbar') {

                document.getElementById('choose-sel').setAttribute('modifier', event.target.value);

            }

        }

        function addOption(event) {

            const option = document.createElement('option');

            var text = document.getElementById('optionLabel').value;

            option.innerText = text;

            text = '';

            document.getElementById('dynamic-sel').appendChild(option);

        }







    }

};

var lat_actual = 0;

var log_actual = 0;

var distancia1 = 0;

var map;

var ultimo_resultado = {};

var directionsDisplay = new google.maps.DirectionsRenderer;

var directionsService = new google.maps.DirectionsService;

var circulo =  new google.maps.Circle();



var marker_nearest =new google.maps.Marker();

var marker =new google.maps.Marker();





//Cuando conseguimos localizarnos ...
function carga_fichado() {
    directionsDisplay.setDirections({routes: []});
    /*var watchID = navigator.geolocation.getCurrentPosition(onSuccess,*/
        cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status) {
            //alert(status);
            /*if(status == "GRANTED"){
                alert("Request Location");
                requestLocation();

            }else{
                cordova.plugins.diagnostic.requestLocationAuthorization(function(status){

                    if(status == "GRANTED"){
                        alert("ha entrado en Granted");
                        requestLocation();
                    }else{
                        alert(status);
                        // Handle other cases
                    }

                }, function(error){

                    alert("ERROR");

                });

            }*/
            cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                if (status == "GRANTED") {
                    //alert("ha entrado en Granted");
                    requestLocation();

                } else {
                    //alert(status);
                    // Handle other cases
                }
            }, function (error) {
                //alert("ERROR");
            });

        }, onErrorGranted);
            /*}, onErrorGranted), {maximumAge: Infinity, timeout: 30000, enableHighAccuracy: true });*/
        /*navigator.geolocation.clearWatch(watchID);*/
}
function setLugar(){
    directionsDisplay.setDirections({routes: []});

}

function onSuccess(position) {
        var element = document.getElementById('geolocation');
        //alert('posicion'+position);
        //datos_portada();
        mostrarMapa(position.coords.latitude,position.coords.longitude);
        guardarPosicion(position.coords.latitude,position.coords.longitude);
        return position;

}

function onErrorGranted(){
    alert("errorGranted");
}

//Si algo fallase al localizarnos...

function onError(error) {

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

//Posiciona el marcador en el MAPA basandose en nuestra geolocalización (vía clearWatch() o getCurrentPosition() al iniciar la app)

//function initialize(lat,log) {
function mostrarMapa(lat,log) {
    /*
        Basado en un código en
        https://developers.google.com/maps/documentation/javascript/geocoding?hl=es#GeocodingResponses
    */

    //alert(lat+log);

    //alert("Enter Initialize");
    //alert("lat" + lat);
    //alert("log" + log);

    var geocoder;

    var infowindow = new google.maps.InfoWindow();
    //alert("infowindow" + infowindow);

    var latlng = new google.maps.LatLng(lat,log);
    //alert("latlng" + latlng);

    var mapOptions = {

        zoom:12,

        center: latlng,

        mapTypeId: 'roadmap'

    }

    var mapaEnDocumento = $(document).find('#map-canvas');
    mapaEnDocumento.css( 'height','500px');

    //alert(mapOptions['zoom']);
    //alert(mapOptions['center']);
    //alert(mapOptions['mapTypeId']);
    //alert(mapaEnDocumento.html());

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions );

    //alert(map);

    //$('#map-canvas').css( 'height','500px');

    marker = new google.maps.Marker({

        position: latlng,

        icon: 'img/man.png',

        map: map,

        title: 'Estas aquí!'

    });

    /*Con esto marcamos la ruta en el mapa*/

    directionsDisplay.setMap(map);



    var dir="";

    var element = document.getElementById('resultado');

    geocoder = new google.maps.Geocoder();

    geocoder.geocode({"latLng": latlng}, function(results, status){

        if (status == google.maps.GeocoderStatus.OK)

        {

            if (results[0]) //Salen 8 resultados; uno nuestra posición, la posición de nuestra provincia, país, ....

            {
                //	alert(latlng);
                ultimo_resultado = results[0];
                dir = "<p><strong>localización actual: </strong>" + results[0].formatted_address + "</p>";
                lat_actual = lat;
                log_actual = log;
                //navigator.splashscreen.hide();

            }else{
                alert('esta llendo por un lado que no es');
                dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
            }

        }else{

            alert( "error status: " + status);

            dir = "<p>El Servicio de Codificación Geográfica ha fallado con el siguiente error: " + status + ".</p>";

        }



        //element.innerHTML = dir;

    });


}







//CALCULA LA RUTA EN BASE AL MODO DE TRANSPORTE



function calculateAndDisplayRoute(directionsService, directionsDisplay,destino,modo) {



    /*Con selectesMode cogemos la variable que nos indica el medio de transporte*/

    var selectedMode = modo;

    var destiny = destino;

    var result=destiny.split(',');

    /*multiplicar por uno para que lo tome como un número porque si se la pasaba sin multiplicar no lo reconocia como numero*/

    var lat_find= result[0]*1;

    var lan_find= result[1]*1;



    distancia1=0;

    /*direccionsservice api de google*/

    directionsService.route(

        {

            origin: {lat: lat_actual, lng: log_actual},  //

            destination: {lat: lat_find,lng:lan_find},  //

            // Note that Javascript allows us to access the constant

            // using square brackets and a string value as its

            // "property."



            travelMode: google.maps.TravelMode[selectedMode]

        },

        function(response, status) {

            if (status == google.maps.DirectionsStatus.OK) {

                var route = response.routes[0];//no hay routes[1]..

                var summaryPanel = document.getElementById('directions-panel');

                summaryPanel.innerHTML = '';

                // For each route, display summary information.

                for (var i = 0; i < route.legs.length; i++) {

                    var routeSegment = i + 1;

                    summaryPanel.innerHTML += '<b>origen:</b><br>';

                    summaryPanel.innerHTML += route.legs[i].start_address + ' to <br/> ';

                    summaryPanel.innerHTML += '<b>destino:</b><br>';

                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';

                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';

                    /*DISTANCIA NUMERICA PARA PODER HACER OPERACIONES */

                    distancia1= route.legs[i].distance.value;

                }



            } else {

                console.log('Ha fallado el sistema debido a ' + status);

            }

            directionsDisplay.setDirections(response);



        }

    );

}//fin de la funcion calculateAndDisplayRoute



function cargar_circulos(distancia){



    /*Marcamos un circulo cada vez que seleccionan el radio */

    var punto_actual = new google.maps.LatLng(lat_actual,log_actual);

    var r= distancia * 1000;//por mil porque tuve que cambiar los datos y para por



    var circulo_options = {

        strokeColor: "#c4c4c4",

        strokeOpacity: 0.20,

        strokeWeight: 0,

        fillOpacity: 0.20,

        map: map,

        radius: r,    // 10 miles in metres

        fillColor: '#00c4c4',

        center:punto_actual

    };



    circulo = new google.maps.Circle(circulo_options);





}

function put_markers(inicio,icon,total,datos){

    var infowindow = new google.maps.InfoWindow();

    var n_marker, i;

    /****

     Asignamos cada marker y sus windows correspondientes

     */

    for(i = inicio;i < total;i++){

        n_marker  = new google.maps.Marker({

            position: new google.maps.LatLng(datos[i].latitud,datos[i].longitud),

            icon: icon,

            map: map,

            title: datos[i].nombre

        });



        google.maps.event.addListener(n_marker, 'click', (function(n_marker, i) {

            return function() {

                infowindow.setContent(

                    datos[i].nombre +'<br/><button type="button"   id="DefinirNuevoSitio_'+datos[i].id+'" >Ver</button>'

                );

                infowindow.open(map, n_marker);



                $('#DefinirNuevoSitio_'+datos[i].id).click(function(){

                    CambiaSitioCalcula(datos[i].id);

                });



            }

        })(n_marker, i)); // <- No se muy bien como funciona esta parte

    }

}



function CambiaSitioCalcula(nueva_id){

    $('#sitio option').removeAttr('selected');

    $('#sitio option[id=sitio_'+nueva_id+']').attr('selected','selected');



    $("#ruta").click();

}



/*BUSCA LOS LUGARES MAS CERCANOS a una distancia seleccionada*/

function cargar_mas_cercanos(distancia){

    /*********Reseteamos valores********************************/

    circulo.setMap(null);

    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/

    initialize(lat_actual,log_actual);

    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.



    $("#sitio").find('option').remove();

    /*********************************************/

    cargar_circulos(distancia);

    $.ajax({

        method: "POST",

        url:'https://ce.prismacm.com/scripts/conexionesApp/index.php',

        data: ({lat:lat_actual,log:log_actual,distancia:distancia}),

        dataType: "json",

        success: function(resp){

            var latlng = new google.maps.LatLng(lat_actual,log_actual);

            var infowindow = new google.maps.InfoWindow({

                content:'El más cercano'+ resp['cercano'].nombre +'<br/><button type="button" onClick=CambiaSitioCalcula('+resp['cercano'].id+') >Ver</button>'

            });



            /*he mandado el número de elementos del array porque por jquery no los cogía*/

            var numero = resp['numero'];

            /*Marco la distancia más cercana al punto donde estoy*/

            var latlng_nearest = new google.maps.LatLng(resp['cercano'].latitud,resp['cercano'].longitud);marker_nearest = new google.maps.Marker({

                position: latlng_nearest,

                map: map,

                title: 'la más cercana '+ resp['cercano'].nombre

            });

            marker_nearest.setIcon('http://maps.google.com/mapfiles/marker_yellow.png');

            marker_nearest.setAnimation(google.maps.Animation.BOUNCE);

            google.maps.event.addListener(marker_nearest, 'click', function() {

                infowindow.open(map,marker_nearest);



            });







            /*Marcamos en el mapa el array de sitios cercanos*/

            put_markers(1,'img/map-localization.png',numero,resp['sitios']);

            /*Rellenamos el select de acuerdo a la distancia*/

            var sel="";

            for(var i = 0;i < numero;i++){

                if(i == 0 ){ sel= 'selected = "selected"' }

                $("#sitio").append('<option '+sel+' id="sitio_'+resp['sitios'][i].id+'" value="' + resp['sitios'][i].latitud +',' + resp['sitios'][i].longitud +'">' + resp['sitios'][i].nombre+ resp['sitios'][i].id+'</option>');

            }





        },

        error: function(){

            // ocultamos el select.

            $('#sitios_cercanos').addClass('hidden');

            console.log('no hay lugares dentro del radio elegido.');

        }

    });

}//fin de la funcion cargar_mas_cercanos



/*************FUNCION QUE GUARDA POSICIONES *********************************************/



function guardarPosicion(lat_actual,log_actual){

    /*********Reseteamos valores********************************/

    //circulo.setMap(null);

    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/

    //initialize(lat_actual,log_actual);

    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.



    //	var dateCET = getDate(1); // Central European Time is GMT +1

    $(".entrar").unbind('click').bind('click', function () { });

    var currentdate = new Date();

    var datetime = currentdate.getDate() + "/"

        + (currentdate.getMonth()+1)  + "/"

        + currentdate.getFullYear() + "  "

        + currentdate.getHours() + ":"

        + currentdate.getMinutes() + ":"

        + currentdate.getSeconds();



    var username = localStorage.getItem('username') || '<empty>';

    var password = localStorage.getItem('password') || '<empty>';



    var date_s=new Date();

    //  data: ({lat:lat_actual,log:log_actual,hora:datetime,usuario:username,password:password,token_fmc:token_fmc}),


    $.ajax({

        method: "POST",

        url:'https://extranet.connectingeurope.es/scripts/conexionesApp/save_data.php',

        data: ({lat:lat_actual,log:log_actual,hora:datetime,usuario:username,password:password}),

        dataType: "json",

        success: function(resp){

            if(resp.error){

               // alert('res'+resp.error);

            }else{

                var datos =[];

                var last="";

                var alojamientos= [];

                var destino;

                $.each(resp.alojamientos, function(i, item){

                    alojamientos.push(item);
                    //localStorage.setItem('alojamiento'+i,item);

                });

                $.each(resp.datas, function(i, item){

                    datos.push(item);

                    localStorage.setItem('horario_'+item,item.horario_entrada);

                });

                localStorage.removeItem('horarios');

                localStorage.removeItem('alojamientos');

                localStorage.setItem('horarios',JSON.stringify(datos));

                localStorage.setItem('alojamientos',JSON.stringify(alojamientos));

                localStorage.setItem('destino',JSON.stringify(resp.destino));

                localStorage.setItem('datos',JSON.stringify(resp.datos));

                localStorage.setItem('empresa',JSON.stringify(resp.empresa));

                localStorage.setItem('fichado','OK');

                // recargarHorarios();

                ons.notification.alert({
                    message: resp.mensaje,
                    title: "Fichado"
                });

            }

        },

        error: function(e){

            // ocultamos el select.

            ons.notification.alert({
                message: "No hay conexión a Internet",
                title: "Error de conexión",
                maskColor:'rgba(255, 0, 0, 0.3)'
            });

            console.log('no nos conectamos con la nube.');

        }

    });

}

function guardarPosicionAtTime(lat_actual,log_actual,direccion){

    /*********Reseteamos valores********************************/

    //circulo.setMap(null);

    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/

    //initialize(lat_actual,log_actual);

    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.



    var dateCET = getDate(1); // Central European Time is GMT +1



    /*if (dateCET.getHours() < 12) {



    } else {

        alert ("Good afternoon.");

    }*/





    //$("#sitio").find('option').remove();

    /*********************************************/

    //cargar_circulos(distancia);

    $.ajax({

        method: "POST",

        url:'http://app-connecting.prismacm.com/get_position_at_time.php',

        data: ({lat:lat_actual,log:log_actual,hora:dateCET,direccion:direccion}),

        dataType: "json",

        success: function(resp){

        },

        error: function(e){

            // ocultamos el select.

            $('#sitios_cercanos').addClass('hidden');

            //	alert('los datos no han sido guardados'+e);

            //	console.log('no nos conectamos con la nube.');

        }

    });

}

function getDate(offset){

    var now = new Date();

    var hour = 60*60*1000;

    var min = 60*1000;

    return new Date(now.getTime() + (now.getTimezoneOffset() * min) + (offset * hour));

}

function recarga_horarios(){
    recargarHorarios();
}

function recargarHorarios(){

    $.ajax({

        url:location.href,

        dataType: "html",

        type:'GET',

        success: function(resp){

            var horario_descargado = JSON.parse(localStorage.getItem("horarios"));
            if(horario_descargado){

                var onsList = $(document).find("#lista_horarios");

                var content = $(document).find("#horas");

                var hora_fichada="";

                onsList.html('');

                $.each(horario_descargado, function(i, item) {

                    /******************************************************/

                    var elem = $('<ons-list-item modifier="tappable"><p><strong>Horario:</strong> '+item.horario_entrada+'</p><br/><p><strong>Hora fichada: </strong>'+item.horario_fichado+'</p></ons-list-item>');

                    onsList.append(elem);

                });

            }

        },

        error: function(e){

            alert('error'+e.status);

        }

    });

}



function ver_datos(){

    var username = localStorage.getItem('username') || '';

    var password = localStorage.getItem('password') || '';
    var token = localStorage.getItem('token') || '';

    $('#username').val(username);
    $('#token').val(token);

}



function save_data_first(){

    var username_f = $(document).find('#username_f').val();

    var pass_f = $(document).find('#password_f').val();

    var errores= '';

    if(!username_f){

        errores += "<p>Debes introducir el Username</p>";
    }

    if(!pass_f){

        errores += "<p>Debes introducir el pass</p>";
    }

    if(errores != ""){
        ons.notification.alert({
            message:errores,
            title:'',
            maskColor:'rgba(255, 0, 0, 0.3)'
        });
    }else {



        var token_fmc = localStorage.getItem('token') || '';

        $('#username_f').val('');

        $('#pass_f').val('');

        $.ajax({

            method: "POST",

            url: 'https://extranet.connectingeurope.es/scripts/conexionesApp/solo_configuracion.php',

            data: ({usuario: username_f, password: pass_f}),

            dataType: "json",

            success: function (resp) {



                if (resp.error) {

                    ons.notification.alert({
                        message:resp.error,
                        title:'',
                        maskColor:'rgba(255, 0, 0, 0.3)'
                    });

                    // window.fn.load('login.html');

                } else {

                    var datos = [];

                    var last = "";

                    $.each(resp.datas, function (i, item) {

                        datos.push(item);

                        localStorage.setItem('horario_' + item, item.horario_entrada);

                    });



                    localStorage.setItem("username", username_f);

                    localStorage.setItem("password", pass_f);

                    localStorage.removeItem('horarios');

                    localStorage.setItem('horarios', JSON.stringify(datos));

                    localStorage.setItem('destino', JSON.stringify(resp.destino));

                    localStorage.setItem('empresa', JSON.stringify(resp.empresa));

                    localStorage.setItem('alojamientos', JSON.stringify(resp.alojamientos));

                    localStorage.setItem('datos', JSON.stringify(resp.datos));

                    localStorage.setItem("valido", 'valido');

                    // ons.notification.alert(resp.mensaje); //mensaje de horarios decargador
                    ons.notification.alert({
                        message:resp.mensaje,
                        title:''
                    });
                    /* document.addEventListener('deviceready', function () {

                         cordova.plugins.notification.local.schedule({

                             title: 'Welcome to our office',

                             trigger: {

                                 type: 'location',

                                 center: [resp.empresa.lat, resp.empresa.lon],

                                 radius: 15,

                                 notifyOnEntry: true

                             }

                         });

                     });*/



                    setTimeout(function(){

                        $(document).find('template.hidden').removeClass('hidden');

                        window.fn.load('home.html');

                    }, 1000);



                }



            },

            error: function (e) {

                // ocultamos el select.

                ons.notification.alert({
                    message: 'No hay conexión a Internet',
                    title:'Error en la conexión',
                    maskColor:'rgba(255, 0, 0, 0.3)'
                });

                $('#sitios_cercanos').addClass('hidden');

                console.log('No nos conectamos con la nube.');

            }

        });

    }

}



function save(){

    var username = $('#username').val();

    var pass = $('#password').val();

    localStorage.setItem("username", username);

    localStorage.setItem("password", pass);

    var token_fmc = localStorage.getItem('token') || '';

    $('#username').val('');

    $('#password').val('');

    $.ajax({

        method: "POST",

        url:'https://extranet.connectingeurope.es/scripts/conexionesApp/solo_configuracion.php',

        data: ({usuario:username,password:pass,token_fmc:token_fmc}),

        dataType: "json",

        success: function(resp){



            if(resp.error){

                ons.notification.alert({
                    message:resp.error,
                    title:'',
                    maskColor:'rgba(255, 0, 0, 0.3)'
                });



            }else{

                var datos =[];

                var last="";

                $.each(resp.datas, function(i, item) {

                    datos.push(item);

                    localStorage.setItem('horario_'+item,item.horario_entrada);

                });

                localStorage.removeItem('horarios');

                localStorage.setItem('horarios',JSON.stringify(datos));

                localStorage.setItem('destino',JSON.stringify(resp.destino));

                localStorage.setItem('empresa',JSON.stringify(resp.empresa));

                localStorage.setItem('alojamientos',JSON.stringify(resp.alojamientos));

                localStorage.setItem('datos',JSON.stringify(resp.datos));

                //localStorage.setItem("alertaMostrada", "ok");



                ons.notification.alert({
                    message: resp.mensaje,
                    title: "Fichado",
                    class: 'OK'
                });

            }



        },

        error: function(e){

            // ocultamos el select.

            ons.notification.alert({
                message: 'No hay conexión a Internet',
                title:'Error en la conexión',
                maskColor:'rgba(255, 0, 0, 0.3)'
            });

            $('#sitios_cercanos').addClass('hidden');

            console.log('No nos conectamos con la nube.');

        }

    });

}

function  travel_mode(id) {

    var html='<div id="floating-panel_'+id+'"> <b>Modo de viaje:</b> ' +
        '<ons-select class="select">' +
        '<select id="mode'+id+'"> ' +
        '<option value="default">-- Selecciona un modo de viaje --</option> ' +
        '<option value="DRIVING">Coche</option> ' +
        '<option value="WALKING">Caminando</option>' +
        '<option value="BICYCLING">Bicicleta</option>' +
        '<option value="TRANSIT">Transporte Público</option>' +
        '</select></ons-select> </div>'

    return html;

}

function showPosition(position) {

    var element = document.getElementById('geolocation');

    //alert('posicion'+position);



    return position;

}

function calcula_ruta(directionsService, directionsDisplay,destino,modo,lat_actual,log_actual) {



    var selectedMode = modo;

    var destiny = destino;

    var result=destiny.split(',');

    /*multiplicar por uno para que lo tome como un número porque si se la pasaba sin multiplicar no lo reconocia como numero*/

    var lat_find= result[0]*1;

    var lan_find= result[1]*1;



    distancia1=0;

    /*direccionsservice api de google*/



    directionsService.route(

        {

            origin: {lat: lat_actual, lng: log_actual},  //

            destination: {lat: lat_find,lng:lan_find},  //

            // Note that Javascript allows us to access the constant

            // using square brackets and a string value as its

            // "property."

            travelMode: google.maps.TravelMode[selectedMode]

        },



        function(response, status) {

            if (status == google.maps.DirectionsStatus.OK) {

                var route = response.routes[0];//no hay routes[1]..



            } else {

                console.log('Ha fallado el sistema debido a ' + status);

            }

            directionsDisplay.setDirections(response);



        }

    );

}//fin de la funcion calculateAndDisplayRoute



function requestLocation(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: Infinity, timeout: 30000, enableHighAccuracy: true });
}



function datos_portada(){

    var infowindow = new google.maps.InfoWindow();

    var permissions = cordova.plugins.permissions;

    var d= new Date();

    var day = d.getDate();

    var month = d.getMonth() + 1;

    var year = d.getFullYear();

    if (day < 10) {

        day = "0" + day;

    }

    if (month < 10) {

        month = "0" + month;

    }

    var fecha_hoy = day + "/" + month + "/" + year;

    var hora = d.getHours() +':'+d.getMinutes();



    $(document).find('span.fecha_portada').text(fecha_hoy);

    $(document).find('div.horario strong').text(hora);

    var user =  localStorage.getItem("username");

    var pass_user =  localStorage.getItem("password");

        if (localStorage.getItem("fichado") == null){
            $(document).find('#iconoHorarioRegistrado').removeClass();
            $(document).find('#iconoHorarioRegistrado').addClass('fas fa-times red');
            $(document).find('#iconoHorarioRegistrado').css('display','block');
        } else {
            $(document).find('#iconoHorarioRegistrado').removeClass();
            $(document).find('#iconoHorarioRegistrado').addClass('fas fa-check');
            $(document).find('#iconoHorarioRegistrado').css('display','block');
        }


    if(!user && !pass_user){

        $('#home').hide();

    }else{
        ver_notificacion();


            /*FCMPlugin.onTokenRefresh(function(token){
                  localStorage.setItem("token", token);
              });
              if (typeof FCMPlugin != 'undefined') {
                  FCMPlugin.getToken(function (token) {
                      localStorage.setItem("token", token);
                  });
              }*/


        $('#login').remove();
    }
}

function cargar_info_destino(){

    $.ajax({
        url:location.href,
        dataType: "html",
        type:'GET',
        success: function(resp){
            var al = JSON.parse(localStorage.getItem("alojamientos"));
            var destino = JSON.parse(localStorage.getItem("destino"));
            var contenido="";
            $('#destino .descripcion ').html(destino.ciudades_cercanas);
            $('#destino .tituloViaje ').text(destino.nombre);
            $('#destino .estacion_bus a').attr('href',destino.bus_web);
            $('#destino .estacion_bus a').text(destino.bus_web);
            $('#destino .estacion_tren a').attr('href',destino.tren_web);
            $('#destino .estacion_tren a').text(destino.tren_web);
            $('#destino .telefonos').html(destino.telefonos);
        },

        error: function(e){
            //  alert(window.location.pathname);

            alert('error'+e.status);



        }

    });

}

function cargar_info_estancia(){

    $.ajax({

        url:location.href,

        dataType: "html",

        type:'GET',

        success: function(resp){

            var al = JSON.parse(localStorage.getItem("alojamientos"));

            var destino = JSON.parse(localStorage.getItem("destino"));

            var empresa = JSON.parse(localStorage.getItem("empresa"));

            var datos = JSON.parse(localStorage.getItem("datos"));

            var contenido="";

            $('#info-destino .tituloViaje span').text(destino.nombre);

            $('#info-destino .destino_llegada').text(datos.llegada_a_ida);

            $('#info-destino .fechas_llegada').text(datos.fecha_ida+' a las'+datos.hora_ida);

            $('#info-destino .fechas_llegada').text(datos.fecha_ida+' a las'+datos.hora_ida);

            $('#info-destino .colaborador_nombre').text(datos.colaborador_nombre);

            $('#info-destino .colaborador_email a').attr('href','mailto:'+datos.colaborador_email);

            $('#info-destino .colaborador_email a').text(datos.colaborador_email);

            $('#info-destino .colaborador_tel').text(datos.colaborador_telefono);

            $('#info-destino .empresa_nombre').text(empresa.nombre);

            $('#info-destino .empresa_direccion').text(empresa.direccion);

            $('#info-destino .empresa_responsable').text(empresa.responsable);

            $('#info-destino .responsable_mentor_mail a').attr('href','mailto:'+empresa.responsable_mentor_mail);

            $('#info-destino .responsable_mentor_mail a').text(empresa.responsable_mentor_mail);

            $('#info-destino .responsable_mentor_mail span').text(empresa.telefono);

            $('#info-destino .periodo').text(datos.practicas_inicio+' - '+datos.practicas_fin);

            $('#info-destino .vuelta_fecha span.fecha_vuelta').text(datos.fecha_vuelta);

            $('#info-destino .vuelta_fecha span.hora_vuelta').text(',a las '+datos.hora_vuelta);

            $('#info-destino .vuelta_desde').text(datos.llegada_a_vuelta);



            $.each(al, function(i, item) {



                contenido +='<ons-list>';

                $.each(item.alojamiento, function(p, dataAlojamiento) {



                    /******************************************************/

                    contenido += '<ons-list-item expandable ><p>'+dataAlojamiento.nombre+'</p><p><strong>Fecha entrada: </strong>'+dataAlojamiento.fecha_in+' </p><p><strong>Fecha salida:</strong> '+dataAlojamiento.fecha_out+'</p><div class="expandable-content"><div >'+dataAlojamiento.direccion+'</div></div></ons-list-item>';



                });

                contenido +='</ons-list>';

            });



            if(contenido){

                $(document).find('#info-destino #estancias').append(contenido);

            }



        },

        error: function(e){

            //  alert(window.location.pathname);

            alert('error'+e.status);



        }

    });

}

function cargar_info_empresa(){

    directionsDisplay.setDirections({routes: []});

    /*******************************/

    $(document).find('#empresa').html('');

    $.ajax({

        url:location.href,

        dataType: "html",

        type:'GET',

        success: function(resp){

            var contenido="";

            var url = "";

            var emp= JSON.parse( localStorage.getItem("empresa"));

            var geocoder;

            var infowindow = new google.maps.InfoWindow();

            contenido +='<h2>'+emp.nombre+'</h2>';

            contenido += travel_mode(emp.id);

            contenido +='<div class="mapas" id=mapa_'+emp.id+' ></div>';

            navigator.geolocation.getCurrentPosition(function(position) {
                url ='https://www.google.com/maps/dir/?api=1&origin='+position.coords.latitude+','+position.coords.longitude+'&destination='+emp.lat+','+emp.lon;
            }, function(e) {
                alert("ERROR: " + e);
            });

            if(contenido){

                $(document).find('#empresa').append(contenido);

                var mapOptions=[];

                var latlng = new google.maps.LatLng(emp.lat,emp.lon);

                mapOptions = {
                    center: latlng,
                    zoom: 12,
                    mapTypeId: 'roadmap'
                }

                mapa_emp = new google.maps.Map(document.getElementById('mapa_'+emp.id),mapOptions );

                directionsDisplay.setMap(mapa_emp);

                $('#mode'+emp.id).on('change', function() {

                    var selectedMode = $(this).val();

                    infoWindow = new google.maps.InfoWindow;

                    navigator.geolocation.getCurrentPosition(function(position) {
                        //var url ='https://www.google.com/maps/dir/?api=1&origin='+position.coords.latitude+','+position.coords.longitude+'&destination='+emp.lat+','+emp.lon;
                        calcula_ruta(directionsService, directionsDisplay,emp.gmaps_pos,selectedMode,position.coords.latitude,position.coords.longitude);
                    }, function() {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });

                });

                $( "#ver_en_maps" ).click(function() {
                    cordova.InAppBrowser.open(url, '_system','location=yes');
                    // win.document.write('<iframe width="560" height="315" src="'+url+'" frameborder="0" allowfullscreen></iframe>')

                });

            }else{

            }

        },

        error: function(e){



            //  alert(window.location.pathname);

            alert('error'+e.status);



        }

    });

}

function cargar_info_alojamiento(){

    /*******************************/

    directionsDisplay.setDirections({routes: []});

    $(document).find('#alojamiento').html('');

    $.ajax({

        url:location.href,

        dataType: "html",

        type:'GET',

        success: function(resp){

            var contenido="";

            var al= JSON.parse( localStorage.getItem("alojamientos"));

            var geocoder;

            var infowindow = new google.maps.InfoWindow();



            $.each(al, function(i, item) {



                contenido +='<ons-list>';

                $.each(item.alojamiento, function(p, dataAlojamiento) {

                    var fechaActual = new Date();
                    var fechaInicio = new Date(dataAlojamiento.fecha_in.replace(/-/g,"/"));
                    var fechaSalida = new Date(dataAlojamiento.fecha_out.replace(/-/g,"/"));

                    if (fechaActual == fechaInicio  || (fechaActual > fechaInicio &&  fechaActual < fechaSalida)){
                        contenido += travel_mode(dataAlojamiento.id);
                        contenido += '<b>'+dataAlojamiento.nombre+'</b><div class="mapas" id="mapa_'+dataAlojamiento.id+'"></div>';
                    }
                    
                });

                contenido +='</ons-list>';

            });

            if(contenido){

                $(document).find('#alojamiento').append(contenido);

                var mapOptions=[];

                $.each(al, function(i, item) {

                    $.each(item.alojamiento, function(p, dataAlojamiento) {

                        //console.log(dataAlojamiento.lat);

                        //  console.log(dataAlojamiento.lon);

                        var latlng = new google.maps.LatLng(dataAlojamiento.lat,dataAlojamiento.lon);

                        mapOptions = {

                            center: latlng,

                            zoom: 12,

                            mapTypeId: 'roadmap'

                        }

                        mapa_a = new google.maps.Map(document.getElementById('mapa_'+dataAlojamiento.id),mapOptions );



                        /*$('#mapa_'+dataAlojamiento.id).css( 'height','500px');*/

                        directionsDisplay.setMap(mapa_a);
                        $('#mode'+dataAlojamiento.id).on('change', function() {

                            var selectedMode = $(this).val();
                            infoWindow = new google.maps.InfoWindow;



                            navigator.geolocation.getCurrentPosition(function(position) {

                                calcula_ruta(directionsService, directionsDisplay,dataAlojamiento.gmaps_pos,selectedMode,position.coords.latitude,position.coords.longitude);

                            }, function() {

                                //alert(dataAlojamiento.gmaps_pos);

                                handleLocationError(true, infoWindow, map.getCenter());

                            });

                        });
                    });
                });

            }else{

            }

        },

        error: function(e){

            //  alert(window.location.pathname);

            alert('error'+e.status);

        }

    });

}

function ver_notificacion(){

    var horario_descargado = JSON.parse(localStorage.getItem("horarios"));
    var   dtTodap = new Date();
    var localNotificationsArray =[];
    if(horario_descargado) {
        $.each(horario_descargado, function (i, item) {
            dtTodap = new Date(item.horario_entrada);
            /******************************************************/
            //alert(item.horario_entrada);
            localNotificationsArray.push({
                id: i,
               // at: dtTodap,
                title: "   ",
                trigger:{
                    at: dtTodap
                },
                text: "Hora de fichar:          " + item.horario_entrada,
                priority:1,
                foreground: true,
                badge:1,
                every: "minute",
                wakeup: true,
                vibrate: true,
                /*icon: "res://ic_popup_reminder",//default Bell
                smallIcon:"res://ic_popup_reminder"*///default Bell
                icon: "file://doorOpen.png",
                smallIcon:"res://ic_stat_onesignal_default"
				});
        });
    }

    cordova.plugins.notification.local.hasPermission(function (granted){
        //obtenemos los horarios
        if( granted == false ) {

            alert("No permission");
// If app doesnt have permission request it
            cordova.plugin.notification.local.registerPermission(function (granted) {
                alert("Ask for permission");
                if( granted == true ) {
                    alert("Permission accepted");

                } else {
                    alert("We need permission to show you notifications");
                }
            });
        } else {

            var pathArray = window.location.pathname.split( "/www/" ),

                secondLevelLocation = window.location.protocol +"//"+ pathArray[0],
                momentOfTime = new Date(); // just for example, can be any other time
            myTimeSpan = 3*60*1000; // 5 minutes in milliseconds
            momentOfTime.setTime(momentOfTime.getTime() + myTimeSpan);
            var   dtToday = new Date();
            mas = 5*60*1000;
            dtToday.setTime(dtToday.getTime() + mas);
            //alert("sending notification");
            var isAndroid = false;

            if ( device.platform === "Android" ) {
                isAndroid = true;
            }
            try{
               if(localNotificationsArray) cordova.plugins.notification.local.schedule(localNotificationsArray);
            } catch (e) {

                console.log(e);

                alert(e);
            }
        }
    });

    if(localNotificationsArray) cordova.plugins.notification.local.update(localNotificationsArray);




}
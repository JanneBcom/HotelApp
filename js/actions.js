//Funcionalidades principales
var fn = {
    init: function(){
        if(!fn.estaRegistrado())
            window.location.href = "#reg";
        
        $('#reg ul[data-role = listview] a').tap(mc.start);
        $("#reg div[data-role = footer] a").tap(fn.registrarClick);
		$('#nr1 ul[data-role = listview] a').tap(fn.seleccionarHab); // pruebas en navegador tap sirve para hacer click que enrealidad es un touch en elmovil, ya que el click normal tiene un retardo 
		$('#nr1 div[data-role = navbar] li').tap(fn.nr1Siguiente); //para probar el boton siguiente
		$('#resSend').tap(fn.nr2Send);
		document.addEventListener("online", almacen.leerReservas, false);
    },
    deviceready: function(){
        document.addEventListener("deviceready", fn.init, false);
		
    },
    estaRegistrado: function(){
		if(window.localStorage.getItem('uuid') != undefined)
			return true;
		else
			return false;
    },
    registrarClick: function(){
        $.mobile.loading( "show" );
        var nom = $('#regNom').val();
        var mai = $('#regMail').val();
        var tel = $('#regTel').val();
        var foto = $('#fotoTomada').attr("rel");
        
        if(nom != '' && mai != '' && tel != '' && foto != undefined && foto != '')
            fn.enviarRegistro(nom,mai,tel,foto);
        else{
            navigator.notification.alert("Todos los campos son requeridos", null, "Registro", "Aceptar");
            $.mobile.loading( "hide" );
        }
    },
    enviarRegistro: function(nom,mai,tel,foto){
        $.ajax({
            method: "POST",
            url: "http://carlos.igitsoft.com/apps/test.php",
            data: { nom: nom, mail: mai, tel: tel },
            error: function(){
                alert("ajax connection error");
            }
        }).done(function( msg ) {
            if(msg == 1){
                ft.start(foto);//Enviar Foto
            }else{
                navigator.notification.alert("Error al enviar los datos", null, "Enviar Datos", "Aceptar");
            }   
        });
    },
	seleccionarHab: function(){
		$(this).parents('ul').find('a').css("background-color",""); //obtiene todos los ul y todas las a, se les quita el backgroundcolor
		$('#nr1').attr("th",$(this).text());
		$(this).css("background-color","#009900");//le pone el color a la seleccionada
	},
	nr1Siguiente: function(){
		if($(this).index() == 1 && $('#nr1').attr('th') != undefined){ //si se preciono siguiente y se selecciono habitacion se pasa a la sig pagina
			window.location.href='#nr2';
		}else{
			if($(this).index() != 0)
				alert("Es necesario seleccionar una habitación");			
		}
	},
	nr2Send: function(){
		var th=$('#nr1').attr("th");
		var pr=$('#resPer').val();
		var ha=$('#resHab').val();
		var di=$('#resDia').val();
	
		if(conex.isConnected())//Detectar si está conectado a internet
			alert("tengo internet");
		almacen.enviaReserva(th,pr,ha,di);
		else//sino
			almacen.guardarReserva(th,pr,ha,di);
	}
};

$(fn.deviceready);
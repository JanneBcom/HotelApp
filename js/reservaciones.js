//guardar reservaciones en el dispositivo
var almacen = {
	db: null,
	th: null,
	pr: null,
	ha: null,
	di: null,
	guardarReserva: function(th, pr, ha, di)	{
		almacen.db = window.openDatabase("hotelApp", "1.0","Hotel App",200000);
		almacen.th = th;
		almacen.pr = pr;
		almacen.ha = ha;
		almacen.di = di;		
		almacen.db.transaction(almacen.tablaReserva,almacen.error,almacen.confirmarReserva);
	},
	error: function(err){
		alert(err.code);
	},
	tablaReserva: function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas ( th, pr, ha, di)');
		tx.executeSql('INSERT INTO reservas (th, pr, ha, di) VALUES ("'+almacen.th+'","'+almacen.pr+'","'+almacen.ha+'","'+almacen.di+'")');
	},
	confirmarReserva: function(){
		alert("Guardado en dispositivo, en espera de sincronizar con el server");
	},
	borrarReservas: function(){
		almacen.db = window.openDatabase("hotelApp","1.0","Hotel App",200000);
		almacen.db.transaction(almacen.deleteReservas,almacen.error,almacen.confirmarEliminada);
	},
	deleteReservas: function(tx){
		tx.executeSql("DELETE FROM reservas");
	},
	confirmarEliminada: function(){
		navigator.notification.alert("Reservas eliminadas", null, "Felicidades","Aceptar");
	},
	leerReservas: function(){
		almacen.db = window.openDatabase("hotelApp","1.0","Hotel App",200000);
		almacen.db.transaction(almacen.readReservas, almacen.error, almacen.confirmarLeidas);
	},
	readReservas: function(tx){
		tx.executeSql("SELECT * FROM reservas",[],function(tx2, r){
			for(i=0;i<r.rows.length; i++){
				var th = r.rows.item(i).th;
				var pr = r.rows.item(i).pr;
				var ha = r.rows.item(i).ha;
				var di = r.rows.item(i).di;
				
				almacen.enviaReserva(th,pr,ha,di);
				
				//Enviar reserva al servidor
			}
		},almacen.error);
	},
	confirmarLeidas: function(){
		almacen.borrarReservas();
	},
	enviaReserva: function (th, pr, ha, di){
					$.ajax({
						method: "POST",
						url: "http://192.168.0.2/prueba/validaDatos.php",
						data: { tip: th, per: pr, nhab: ha, dia:di },
						error: function(){
							alert("ajax connection error");
						}
					}).done(function( respuestaServer ) {
							alert(respuestaServer.msg);
							if(respuestaServer.valor==1){ 
								almacen.crearHistorial(th,ha,pr,di);
                				window.location.href = '#home';
							}
							
        				});
	},
	crearHistorial: function(th,ha,pr,di){
		almacen.db = window.openDatabase("Hitorial", "1.0","Historial",200000);
		almacen.th2 = th;
		almacen.pr2 = pr;
		almacen.ha2 = ha;
		almacen.di2 = di;		
		almacen.db.transaction(almacen.tablaHistorial,almacen.errorH,almacen.exitoH);
	},
	tablaHistorial: function(tx3){
		tx3.executeSql('CREATE TABLE IF NOT EXISTS historial ( th, pr, ha, di, fecha)');
		var d = new Date();
		var fecha = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
		tx3.executeSql('INSERT INTO historial (th, pr, ha, di, fecha) VALUES	("'+th+'","'+pr+'","'+ha+'","'+di+'","'+fecha+'")');
	},
	errorH: function(err){
		alert(err.code);
	},
	exitoH:	function(){
		navigator.notification.alert('Su Historial se ha actualizado',null,'Historial','Aceptar');
		almacen.borrarReservas();
	},
    leerHistorial: function(){
		almacen.db = window.openDatabase("hotelApp","1.0","Hotel App",200000);
		almacen.db.transaction(almacen.readHistorial, almacen.errorH, almacen.confirmarHistorial);
	},
	readHistorial: function(tx){
		tx.executeSql("SELECT * FROM historial",[],function(tx2, r){
		var l = r.rows.length;
		var hist = $('#historial .ui-content').html('');
		for(i=0;i<l;i++){
		hist.append('<details><summary>'+r.rows.item(i).fecha+'</summary><strong>Tipo Habitación:</strong> '+r.rows.item(i).th+'<br><strong>Habitaciones:</strong> '+r.rows.item(i).ha+'<br><strong>Personas:</strong> '+r.rows.item(i).pr+'<br><strong>Días:</strong> '+r.rows.item(i).di+'<br></details>');
			}
		},almacen.errorH);
	},
	confirmarHistorial: function(){
		navigator.notification.alert("Historial Actualizado", null, "Historial","Aceptar");
	}
};
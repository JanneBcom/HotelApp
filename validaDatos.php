<?php

//Conexión a base de datos
$server = "localhost";
$username = "root";
$password = "";
$database = "prueba";
$con = mysql_connect($server, $username, $password) or die ("Error al conectar: " . mysql_error());
mysql_select_db($database, $con);

//Obtenemos por Post los valores enviados desde el móvil

$tipo = $_POST["tip"];
$nper = $_POST["per"];
$nhab = $_POST["nhab"];
$dias = $_POST["dia"];
$respuesta= array();

//Insertamos en la base de datos

$sql = "INSERT INTO reserva (tipoHabitacion, noPersona, noHabitacion, noDias ) ";
$sql .= "VALUES ('$tipo', '$nper', '$nhab', '$dias')";
if (!mysql_query($sql, $con)) {
	die('Error: ' . mysql_error());
	$respuesta["valor"]=0;
	$respuesta["msg"]="Error al conectar";
} else {
	$respuesta["valor"]=1;
	$respuesta["msg"]="Datos guardados en Servidor";
}
echo json_encode($respuesta);
mysql_close($con);
?>
//connection.js
var conex = {
	isConnected: function(){
		if(navigator.connection.type != Connection.NONE)
			return true;
		else
			return false;
	}
};
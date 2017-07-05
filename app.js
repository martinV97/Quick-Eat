
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var pg  = require('pg');
var conString   = process.env.DATABASE_URL;
console.log(conString);
//var conString = 'postgres://martin:123@localhost:5432/Quick-Eat';
var client = new pg.Client(conString);
client.connect();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/tablaComidas', function(req, res, next) {
	var results = {};
	results.Comidas = [];
	var data = [];
		var query = client.query('SELECT * FROM COMIDAS');
	    query.on('row', function (row){
	      results.Comidas.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});

app.get('/tablaCategorias', function(req, res, next) {
	var results = {};
	results.Categorias = [];
		var query = client.query('SELECT * FROM CATEGORIAS');
	    query.on('row', function (row){
	      results.Categorias.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});

app.get('/tablaComidasCantidad', function(req, res, next) {
	var results = {};
	results.ComidasCantidad = [];
		var query = client.query('SELECT * FROM COMIDA_CANTIDAD');
	    query.on('row', function (row){
	      results.ComidasCantidad.push(row);
	    });
	    query.on('end', function (){
	    	return res.json(results);
	    });
});

app.get('/tablaPedidos', function(req, res, next) {
	var results = {};
	results.Pedidos = [];
		var query = client.query('SELECT * FROM PEDIDO');
	    query.on('row', function (row){
	      results.Pedidos.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});

app.get('/crearPedido', function(req, res, next) {
	//var id = req.param('id');
	var results = {};
	results.IdPedido = [];
		var queryId = client.query('SELECT last_value from pedido_id_seq');
	    query.on('row', function (row){
	      results.IdPedido.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
	var entregado = req.param('entregado');
	var nombre = req.param('nombre');
	var cobrado = req.param('cobrado');
	var numeroMesa = req.param('numeroMesa');
	var query = client.	query(
			'INSERT INTO public."pedido"(entregado, nombre_cliente, cobrado, numeroMesa) VALUES ('
			+ entregado + ',' + nombre + ','+ cobrado + ',' + numeroMesa +')'
			).catch(function (err) {
	    	client.done();
	      return next(err);
	    });
});
//http://localhost:3000/crearPedido/?id=6&entregado=false&nombre=%27Test2%27&cobrado=false
app.get('/borraPedido', function(req, res, next) {
			var id = req.param('id');
			var query = client.	query( 
					'DELETE FROM public."pedido" where id =' + id).then(function () {res.status(200)
		        .json({
			          status: 'success',
			        });
			    })
			    .catch(function (err) {
			    	client.done();
			      return next(err);
			    });
			   
});

app.get('/crearCategoria', function(req, res, next) {
		//var id = req.param('id');
		var nombre = req.param('nombre');
		var query = client.	query('INSERT INTO public."categorias" (nombre) VALUES ('
				+ ',' + String.fromCharCode(39)
				+ nombre + String.fromCharCode(39)
				+ ')').then(function () {res.status(200)
		        .json({
		          status: 'success',
		        });
		    })
		    .catch(function (err) {
		    	client.done();
		      return next(err);
		    });
});

app.get('/getPedidosCocina' , function(re, res, next) {
	var results = {};
	results.Pedidos = [];
		var query = client.query('SELECT * FROM VISTA_COCINA');
	    query.on('row', function (row){
	      results.Pedidos.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});


app.get('/getCobros' , function(re, res, next) {
	var results = {};
	results.Cobros= [];
		var query = client.query('SELECT * FROM COBRO_PEDIDO_COMIDA');
	    query.on('row', function (row){
	      results.Cobros.push(row);
	    });
	    query.on('end', function (){
	      return res.json(results);
	    });
});
//-*----INICIALIZACION D MODULOS---
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;
var mysql = require('mysql');//para la comunicacion con la bdd 
//https://github.com/expressjs/cors
var cors = require('cors');//EL NOS FACILITA LA COMUNICACION A ESAS URLS  ACCESO A ESA URL
app.use(cors());
app.get('/', function (req, res) {
    //request : son cabeceras y datos que nos envia el navegador.
    //response : son todo lo que enviamos desde el servidor.
    res.sendFile(__dirname + '/index.html');
});
//----WEB SERVICES--
//---CONFIGURACIUON DE ACCESO--
var whitelist = ['http://example1.com', 'http://example2.com', "http://192.168.0.69"];
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {origin: true}; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = {origin: false}; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};

app.get('/products/:id', cors(corsOptionsDelegate), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for a whitelisted domain.'});
});
app.get('/user/:id', function (req, res) {
    console.log('and this matches too');
    res.json({msg: 'This is CORS-enabled for a whitelisted domain.'});

});

io.on('connection', function (socket) {
//-----------chat---
    console.log("usuario id : %s", socket.id);
    var channel = 'channel-a';
    socket.broadcast.emit('message', 'El usuario ' + socket.id + ' se ha conectado!', 'System');

    socket.join(channel);

    socket.on('message', function (msj) {
        //io.emit('message',msj,socket.id);
        io.sockets.in(channel).emit('message', msj, socket.id); //enviar a todos del canal
        //socket.broadcast.to(channel).emit('message',msj,socket.id); //enviar a todos del canal menos a mi
    });

    socket.on('disconnect', function () {
        console.log("Desconectado : %s", socket.id);
    });
    socket.on('change channel', function (newChannel) {
        socket.leave(channel);
        socket.join(newChannel);
        channel = newChannel;
        socket.emit('change channel', newChannel);
    });

});

http.listen(PORT, function () {
    console.log('el servidor esta escuchando el puerto %s', PORT);
});
function getDataModel($params, callback) {
    var result;
    var query_string = $params.query_string;
    var objec_conection_bdd = $params.objec_conection_bdd;
    objec_conection_bdd.query(query_string, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        // Pass the message list to the view
        else {
            console.log("primero informacion");
            result = rows;
            callback(result);
        }
    });
    return result;
}
function initBdd() {

//--------CONECCCION DE LA BDD--------
    var connection = mysql.createConnection(params_bdd);
    connection.connect(function (err) {
        if (err) {
            console.log('Error connecting to Db:');
            console.log(err);
            return;
        } else {

            console.log('Connection established');
        }

    });
}
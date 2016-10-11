//INICIALIZACION D VARIABLES GLOBALES
//PUERTO DONDE VA A CORRER EL SERVIDOR 
//****************CORS **************
//https://github.com/expressjs/cors
// ES UN MODULO PARA PODER DAR PERMISOS
//DE ACCESO AL SERVIDOR
//Y PODER 
//***********************EXPRESS*****************
//En esta introducciï¿½n a la programaciï¿½n asï¿½ncrona con Node.js 
//vamos a introducirnos en el desarrollo web con express.js. 
//  Express estï¿½ construido sobre Connect un framework extensible de 
//  manejo de servidores HTTP que provee de
//plugins de alto rendimiento conocidos como middleware.
//---------VARIABLES GLOBALES----------
//----------ASIGNAR LA CONFIGURACION DE LA BDD(NOMBRE Y PUERTO Y PASS)---------
var port_listen = 6969;
var port_mysql = 3306;
var puerto_io = 3000;
//---BDD SERVER---
//LOCALMENTE
//var params_bdd = {user: "root", password: "", host: "localhost", port: port_mysql, database: "xywer"};
//LOCALMENTE-PUBLICA
var params_bdd = {user: "meetxywer2", password: "meetxywer2123456", host: "186.101.18.195", port: port_mysql, database: "xywer"};
//BDD CREATIVEWEB
//var params_bdd = {user: "pekesc5_meetclic", password: "meetclic@", host: "creativeweb.com.ec", port: port_mysql, database: "pekesc5_xywer"};
//*********************MYSQL*****************
//-*----INICIALIZACION D MODULOS---
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || port_listen;
var mysql = require('mysql');//para la comunicacion con la bdd 
var cors = require('cors');//EL NOS FACILITA LA COMUNICACION A ESAS URLS  ACCESO A ESA URL
app.use(cors());
app.get('/', function (req, res) {
    //request : son cabeceras y datos que nos envia el navegador.
    //response : son todo lo que enviamos desde el servidor.
    res.sendFile(__dirname + '/index.html');
});
var result = initBdd();
console.log(result);
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
//---GESTION D INFORMACION--
app.get('/registrePersonaInformacion', function (req, res, next) {
    connection = mysql.createConnection(params_bdd);
    connection.connect(function (err) {
        if (err) {
            console.log('Error connecting to Db:');
            console.log(err);
            return;
        } else {

            console.log('Connection established');
        }

    });
    var result = [];
    var post = req.query;

    if (!post.id) {//crear nuevo
        var phone_number = post.phone_number;
        var query_string = "SELECT * FROM  " + cuenta_persona + " t  where  t.phone_number='" + phone_number + "'";
        var objec_conection_bdd = connection;
        var params_data = {query_string: query_string, objec_conection_bdd: objec_conection_bdd};
        getDataModel(params_data, function (data) {
            if (data.length == 0) {//validacion d informacion si no existe datos se puede registrar al sistema de qullqi cash
                var data_save = {nombres: post.nombres, apellidos: post.apellidos, persona_genero_id: post.persona_genero_id};
                var query = connection.query('INSERT INTO ' + persona + ' SET ?', data_save, function (err, result) {
                    var persona_id = result.insertId;
                    var data_save = {phone_number: post.phone_number, documento: post.documento, entidad_data_id: entidad_data_id, persona_id: persona_id, pass_user: post.pass_user};
                    var query2 = connection.query('INSERT INTO ' + cuenta_persona + ' SET ?', data_save, function (err, result2) {
                        var children_id = result2.insertId;
                        var data_result = {id: children_id};
                        res.json({success: true, data: data_result, msj: 'Se registro correctamente!!'});
                    });
                });

            } else {
                result = {
                    success: false,
                    msj: "El # Tlfn ya fue tomado" + phone_number
                };
                res.json(result);

            }

        });

    } else {
        var queryString = 'UPDATE  persona_informacion SET nombres="' + post.nombres + '",' + 'apellidos="' + post.apellidos + '",' + 'documento="' + post.documento + '" WHERE persona_informacion.id=' + post.id;

        connection.query(queryString, function (err, result) {

            var data = {id: post.id, nombres: post.nombres, apellidos: post.apellidos, documento: post.documento}
            res.json({success: true, data: data, update: true});
        });
    }


});

app.get('/getPersonaInformacion', function (req, res, next) {
    var result = [];
    var post = req.query;
    var errors = [];
    var msj = "";
    var init_bdd;
    connection = mysql.createConnection(params_bdd);
    connection.connect(function (err) {
        if (err) {
            errors = err;
            init_bdd = false;
            console.log("--------------------erro---------------------");

            res.json({success: false, data: post, init_bdd: init_bdd, "msj-error-bdd": errors});

        } else {
//            var query_string = "SELECT t.id key_id,t.persona_id, pg.valor genero,p.nombres,p.apellidos ,t.compania_taxis,t.ciudad FROM persona_informacion  t ";
//            query_string += "inner join persona p on t.persona_id=p.id ";
//            query_string += "inner join persona_genero pg on p.persona_genero_id=pg.id  ";
//            var objec_conection_bdd = connection;
//            var params_data = {query_string: query_string, objec_conection_bdd: objec_conection_bdd};
//            getDataModel(params_data, function (data) {
//                res.json(data);
//
//            });
            res.json({success: false,"listo":"ñladekmadmadm"});

        }

    });





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

    var init_bdd = false;
    var result = [];
    try {
        //--------CONECCCION DE LA BDD--------
        connection = mysql.createConnection(params_bdd);
        connection.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db:');
                result.push({"success": false, errors: err});
            } else {
                init_bdd = true;
                result.push({"success": true, errors: []});
            }
            return result;

        });

    } catch (err) {
        // Handle the error here.
        result.push({"success": true, errors: err});

        return result;
    }

}
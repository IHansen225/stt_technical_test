const express = require('express')
const cors = require('cors')
const app = express()
const { Server: HttpServer } = require('http');
const httpServer = new HttpServer(app);
const { Router } = express;
const router = Router();
const port = 3100;
var compression = require('compression');
var mysql = require('mysql2');
// Parametros de conexion a la base de datos
var con = mysql.createConnection({
    host: 'localhost',
    user: 'STT_test_user',
    password: 'STT_pass',
    database: 'stt_db'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', router);
app.use(cors());
app.use(compression());

// Funcion de inicializacion de dbStorage
function init() {
    con.connect(function(err) {
        if (err) {
            throw err;
        } else {
            console.log('Database connection OK');
        }
    });
};

// Funcion que recibe los datos brindados por la request para detectar patrones establecidos
function checkAnomalies(data) {

    // Guarda los datos en funcion del resultado de la busqueda de anonalias
    function save(data, anom) {
        con.query(`INSERT INTO dna_analyses (timestamp, obj, anomaly) VALUES ('${new Date().toISOString()}', '${JSON.stringify(data["dna"])}', ${anom === true ? 1 : 0})`)
        return anom;
    }

    // Evita ejecucion si los datos de entrada son invalidos
    if (!("dna" in data) || Object.keys(data).length != 1 || data["dna"].length < 3 || data["dna"].length > 2000 || data["dna"].some(val => val.length < 3)) {
        return undefined;
    }
    
    // Recorre la matriz en busqueda del patron establecido (3 o mas elementos adyacentes iguales)
    var mat = data["dna"]
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            if ((j + 3 <= mat[i].length) && (mat[i][j] === mat[i][j + 1]) && (mat[i][j] === mat[i][j + 2])) {
                return save(data, true); // Deteccion del patron horizontal en la matriz
            } else if ((i + 3 <= mat.length) && (mat[i][j] === mat[i + 1][j]) && (mat[i][j] === mat[i + 2][j])) {
                return save(data, true); // Deteccion del patron vertical en la matriz
            } else if ((i + 3 <= mat.length) && (j + 3 < mat[i].length) && (mat[i][j] === mat[i + 1][j + 1] && mat[i][j] === mat[i + 2][j + 2])) {
                return save(data, true); // Deteccion del patron diagonal en la matriz
            } else if ((i + 3 <= mat.length) && (j - 2 >= 0) && (mat[i][j] === mat[i + 1][j - 1] && mat[i][j] === mat[i + 2][j - 2])) {
                return save(data, true); // Deteccion del patron diagonal inverso en la matriz
            }
        }
    }

    // En caso de no encontrarse el patron, se retorna el valor booleano -false-
    return save(data, false);
}

// Inicializacion del servidor
httpServer.listen(port, () => {
    init();
    console.log(`Server active on port ${port}`);
})

// GET method - Devuelve las estadisticas de uso de la API
router.get('/stats', function (req, res) {
    con.query(`SELECT SUM(anomaly) AS count_anomalies, (COUNT(anomaly) - SUM(anomaly)) AS count_no_anomalies, (SUM(anomaly) / COUNT(anomaly)) as ratio FROM dna_analyses`, async function(err, result) {
        res.send(result[0]);
    });
});

// POST method - Recibe un JSON y devuelve un status code dependiendo del resultado de checkAnomalies()
router.post('/validate-anomaly', function (req, res) {
    var result = checkAnomalies(req.body)
    if (result === undefined) {
        res.status(400).send("Bad request.");
    } else if (result === false) {
        res.status(403).send("No anomalies detected.");
    } else if (result === true) {
        res.status(200).send("Anomaly detected.");
    }
});
const express = require('express')
const cors = require('cors')
const app = express()
const { Server: HttpServer } = require('http');
const httpServer = new HttpServer(app);
const { Router } = express;
const fs = require('fs');
const router = Router();
const port = 5000;
var compression = require('compression');
let statsFile = undefined;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', router);
app.use(cors());
app.use(compression());

// Funcion de inicializacion de localStorage
function init() {
    try {
        fs.readFileSync(`${__dirname}/public/analyses.json`, { encoding: 'utf8', flag: 'r' });
        JSON.parse(fs.readFileSync(`${__dirname}/public/analyses.json`, { encoding: 'utf8' }));
        console.log("Analyses loaded successfully");
    } catch (err) {
        console.log("Error reading analyses from fileStorage, creating new file...")
        fs.writeFileSync(`${__dirname}/public/analyses.json`, `{
        "stats": {
                "count_anomalies": 0,
                "count_no_anomalies": 0,
                "ratio": 0
            },
            "hist": {}
        }`);
    }
    statsFile = JSON.parse(fs.readFileSync(`${__dirname}/public/analyses.json`, { encoding: 'utf8' }))
}

// Funcion que recibe los datos brindados por la request para detectar patrones establecidos
function checkAnomalies(data) {

    // Guarda los datos en funcion del resultado de la busqueda de anonalias
    function save(data, anom) {
        if (anom) {
            statsFile.stats["count_anomalies"]++;
        } else {
            statsFile.stats["count_no_anomalies"]++;
        }
        statsFile.hist[new Date().toISOString()] = data;
        fs.writeFileSync(`${__dirname}/public/analyses.json`, JSON.stringify(statsFile));
        return anom;
    }

    // Evita ejecucion si los datos de entrada son invalidos
    if (!("dna" in data)) {
        return undefined;
    }
    
    // Recorre la matriz en busqueda del patron establecido (3 o mas elementos adyacentes iguales)
    var mat = data["dna"]
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            if ((j + 3 < mat[i].length) && (mat[i][j] === mat[i][j + 1]) && (mat[i][j] === mat[i][j + 2])) {
                return save(data, true);
            } else if ((i + 3 < mat.length) && (mat[i][j] === mat[i + 1][j]) && (mat[i][j] === mat[i + 2][j])) {
                return save(data, true);
            } else if ((i + 3 < mat.length) && (j + 3 < mat[i].length) && (mat[i][j] === mat[i + 1][j + 1] && mat[i][j] === mat[i + 2][j + 2])) {
                return save(data, true);
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
    res.send(statsFile);
});

// POST method - Recibe un JSON y devuelve un status code dependiendo del resultado de checkAnomalies()
router.post('/validate-anomaly', function (req, res) {
    var result = checkAnomalies(req.body)
    if (result === undefined) {
        res.status(400).send("Error 400: Bad request, possibly invalid JSON or required key not in request body.");
    } else if (result === false) {
        res.status(403).send("No anomalies detected.");
    } else if (result === true) {
        res.status(200).send("Anomaly detected.");
    }
});
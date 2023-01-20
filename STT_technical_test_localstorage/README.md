
### Prueba técnica
## Grupo STT
### Documentación de API

### Herramientas utilizadas:
- [Node.js](https://nodejs.org/en/) v12.22.9
- [MySQL](https://www.mysql.com/) 8.0.31-0ubuntu0.22.04.1 for Linux
- [AWS](https://aws.amazon.com/)
- [PM2](https://pm2.keymetrics.io/) 5.2.2

### Introducción:
El proyecto consiste en una API simple basada en Node.js, la cual recibe datos en formato JSON, para su posterior análisis, devolviendo resultados en forma de códigos HTTP. La misma cuenta con persistencia de datos y estadísticas de uso accesibles al usuario mediante su correspondiente endpoint.

### Links de acceso:
[Version con persistencia de datos MYSQL](ec2-3-87-206-7.compute-1.amazonaws.com:3100/api/)
[Version con persistencia de datos local](ec2-3-87-206-7.compute-1.amazonaws.com:3300/api/)

### Complejidad algoritmica:
Analisis de datos de entrada:

	Best: O(n)
	Average: O(n.log(n))
	Worst: O(n^2)

Solicitud de estadisticas:

	O(1)
	
### Endpoints:

**GET: /api/stats** - Devuelve las estadísticas de uso de la API en el siguiente formato JSON:
	
	{
		count_anomalies: INT, cantidad de análisis con anomalías detectados.
		count_no_anomalies: INT, cantidad de análisis sin anomalías detectadas.
		ratio: FLOAT, proporción de casos con anomalías sobre casos totales.
	}

  

**POST: /validate-anomaly** - Recibe como dato de entrada un JSON en el siguiente formato:
	
	{
		dna: [[...]. [...], [...]] - siendo el valor de la key “dna” una matriz cuadrada de datos.
	}

  

Condiciones de datos de entrada:

-   Formato: JSON
-   Contenido:
--   Keys: “dna”
--  Values: array con n elementos, siendo cada elemento un array de n valores, conformando una matriz cuadrada
*En caso de no cumplirse dichas condiciones, el endpoint rechaza el dato de entrada, devolviendo un código de error.*

Luego de recibido el dato, es analizado en busca del patrón establecido como anomalía (3 o más elementos en línea), devuelve un código HTTP de acuerdo al resultado del análisis.

### Autenticación:
En este caso, la API no necesita de autenticación para su uso.
### Códigos de error:
**GET: /api/stats -> 200:** Request OK, el JSON de estadísticas fue recibido correctamente.
**POST: /validate-anomaly -> 200:** El JSON enviado para análisis contiene una anomalía.
**POST: /validate-anomaly -> 400:** El JSON enviado no es válido o no cumple con las condiciones de entrada.
**POST: /validate-anomaly -> 403:** El JSON enviado no contiene anomalías.
*Cualquier otro endpoint no mapeado previamente en este documento genera un código 404.*



## STT Technical test repository

### Este repositorio contiene los archivos necesarios para la ejecución, prueba y análisis del ejercicio solicitado por la empresa STT.

### Links de acceso:
- [Version con persistencia de datos MYSQL](ec2-3-87-206-7.compute-1.amazonaws.com:3100/api/)
- [Version con persistencia de datos local](ec2-3-87-206-7.compute-1.amazonaws.com:3300/api/)

### Herramientas utilizadas:
- [Node.js](https://nodejs.org/en/) v12.22.9
- [MySQL](https://www.mysql.com/) 8.0.31-0ubuntu0.22.04.1 for Linux
- [AWS](https://aws.amazon.com/)
- [PM2](https://pm2.keymetrics.io/) 5.2.2

### Introducción:
El proyecto consiste en una API simple basada en Node.js, la cual recibe datos en formato JSON, para su posterior análisis, devolviendo resultados en forma de códigos HTTP. La misma cuenta con persistencia de datos y estadísticas de uso accesibles al usuario mediante su correspondiente endpoint.

### Índice:

| Nombre | Descripción |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [STT_technical_test_dbstorage](https://github.com/IHansen225/stt_technical_test/tree/main/STT_technical_test_dbstorage) | API con persistencia en base de datos MYSQL |
| [STT_technical_test_localstorage](https://github.com/IHansen225/stt_technical_test/tree/main/STT_technical_test_localstorage) | API con persistencia local |
| [.gitignore](https://github.com/IHansen225/stt_technical_test/blob/main/.gitignore) | \- |
| [README.md](https://github.com/IHansen225/stt_technical_test/blob/main/README.md) | \- |
| [premise.pdf](https://github.com/IHansen225/stt_technical_test/blob/main/premise.pdf) | Premisa de la prueba |

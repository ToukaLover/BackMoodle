Para poder ejecutar este proyecto en local:
    - Haces pull del repositorio
    - En la raiz del proyecto haces "npm install" en una consola
    - Haz un "docker compose down -v" para borrar los volumes de docker que tengas referente a este proyecto
    - Despues tiene que iniciar el docker con "docker compose up --build" 
    - Creas un ".env" donde harás las siguientes variables de entorno:
        * MONGODB=(url de tu MongoDB, si usas: 
            el de docker: mongodb://mongoUri:27017/Moodle
            localhost: mongodb://localhost:27018/Moodle)
        * CORS=(url de tu front, si es local seria http://localhost:5173/)
        * PORT=(Tu puerto de preferencia en nest, suele ser el 3000)
        * MINIO_HOST=(url de tu Mnio, si usas: 
            local:localhost
            docker:minio)
        * MINIO_PORT=9000    
    - Ejecutas el proyecto bien con "nest start --watch" para que escuche los cambios
        (tambien puedes usar el del propio docker, que se iniciar al hacer el build)

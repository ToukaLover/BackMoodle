const db = db.getSiblingDB("Moodle");

// Insertar usuarios
db.usuarios.insertMany([
  {
    _id: ObjectId("6809e7bb6ddecd50c1301d03"),
    username: "superadmin",
    password: "$2b$10$mQjtOBRbTgud/wCzcL716uUZfHSF1ymjsvaNX/glxZcdla2oV6vwy",
    role: "superadmin",
    proyectos: [],
    __v: 0
  },
  {
    _id: ObjectId("6809e7c86ddecd50c1301d07"),
    username: "admin",
    password: "$2b$10$uz2FodWtQpjAmfsdAeVjV.lpVKQf2LDubPH6cKpub3nnixilIP2Ue",
    role: "admin",
    proyectos: [
      "682c2dcdcc45e55430bae4f0",
      "682c2f3ecc45e55430bae551"
    ],
    __v: 0
  },
  {
    _id: ObjectId("680b41d7301c68eb09aca04b"),
    username: "user",
    password: "$2b$10$89oLizvVJS5STKRSYnVrnu52zaHKJPo3M9MSaPFs9V61DGwsRlQNO",
    role: "user",
    proyectos: ["682c2dcdcc45e55430bae4f0"],
    __v: 0
  },
  {
    _id: ObjectId("682c2eabcc45e55430bae526"),
    username: "admin2",
    password: "$2b$10$qB/4PVdvHAM.dYVIO3.v5.2HWSB3BUKyWr2C7LYLEbJvH0HYKM3kC",
    role: "admin",
    proyectos: [],
    __v: 0
  },
  {
    _id: ObjectId("682c2eb2cc45e55430bae529"),
    username: "user2",
    password: "$2b$10$AbSg/T22M1aE2CFRd6IY6elVk6uFN1h/w9.20XBHIx051JYG5F2n6",
    role: "user",
    proyectos: ["682c2f3ecc45e55430bae551"],
    __v: 0
  }
]);

// Insertar foros
db.foros.insertMany([
  {
    _id: ObjectId("6825dba70331b6c38250154b"),
    title: "PublicaciónForo",
    body: "PublicaciónForo",
    date: "15/5/2025, 14:18:47",
    user: "superadmin",
    __v: 0
  },
  {
    _id: ObjectId("6826d430e99c21c5f36eb7d2"),
    prevPublId: "6825dba70331b6c38250154b",
    title: "RespuestaForo",
    body: "RespuestaForo",
    date: "16/5/2025, 7:59:12",
    user: "admin",
    __v: 0
  },
  {
    _id: ObjectId("682c3216cc45e55430bae6be"),
    prevPublId: "6826d430e99c21c5f36eb7d2",
    title: "Respuesta a una Respuesta",
    body: "Respuesta a una Respuesta",
    date: "20/5/2025, 9:41:10",
    user: "user",
    __v: 0
  },
  {
    _id: ObjectId("682c3249cc45e55430bae6d1"),
    title: "Otra publicacion del foro",
    body: "Otra publicación del foro",
    date: "20/5/2025, 9:42:01",
    user: "user2",
    __v: 0
  }
]);

// Insertar proyectos
db.proyectos.insertMany([
  {
    _id: ObjectId("682c2dcdcc45e55430bae4f0"),
    title: "PrimerProyecto",
    description: "Este es el primer proyecto creado en esta app",
    admin_id: "6809e7c86ddecd50c1301d07",
    usuarios: [
      "6809e7c86ddecd50c1301d07",
      "680b41d7301c68eb09aca04b"
    ],
    __v: 0
  },
  {
    _id: ObjectId("682c2f3ecc45e55430bae551"),
    title: "ProyectoParaUser2",
    description: "Este proyecto es para que solo lo vea el admin y el user2",
    admin_id: "6809e7c86ddecd50c1301d07",
    usuarios: [
      "6809e7c86ddecd50c1301d07",
      "682c2eb2cc45e55430bae529"
    ],
    __v: 0
  }
]);

// Insertar tareas
db.tareas.insertMany([
  {
    _id: ObjectId("682c2e01cc45e55430bae500"),
    projectId: "682c2dcdcc45e55430bae4f0",
    title: "Primera Tarea",
    description: "En esta tarea se subirá cualquier cosa, solo es para pruebas",
    visible: true,
    __v: 0
  },
  {
    _id: ObjectId("682c2e67cc45e55430bae505"),
    projectId: "682c2dcdcc45e55430bae4f0",
    title: "Tarea NO Visible",
    description: "Esta es una tarea NO visible, para que se vea que no se muestra a los usuarios",
    visible: false,
    __v: 0
  }
]);

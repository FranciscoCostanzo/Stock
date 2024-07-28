import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

// Evento connect para imprimir un mensaje en la consola una vez que se establezca la conexión
poolConnection.getConnection()
  .then(() => {
    console.log('Conexión a la base de datos establecida.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

export default poolConnection;

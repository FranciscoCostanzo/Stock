const poolConnection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
    const { nombre_local, password } = req.body;
    const consult = 'SELECT * FROM locales WHERE nombreLocal = ?';

    try {
        const connection = await poolConnection.getConnection();

        // Verificar si el nombre_local ya existe en la base de datos
        const [existingRows, fields] = await connection.query(consult, [nombre_local]);
        
        if (existingRows.length > 0) {
            console.log('El local ya existe');
            return res.status(400).send({ message: 'El local ya existe' });
        }

        // Hashear la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10); // Se utiliza 10 como número de rondas de hashing
        
        // Si no hay similitud, procede con la inserción en la base de datos
        const insertQuery = 'INSERT INTO locales (nombreLocal, password) VALUES (?, ?)';
        const [insertRow] = await connection.query(insertQuery, [nombre_local, hashedPassword]);
        
        connection.release();

        // Generar el token de autenticación
        const token = jwt.sign({ nombre_local }, "Stack", { expiresIn: "1h" });
        
        // Configuración de la cookie
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60, // 1 hora
            sameSite: 'strict'
        };

        // Establecer la cookie en la respuesta y enviar la respuesta al cliente
        res.cookie('token', token, cookieOptions).send({ message: 'Local registrado exitosamente', nombre_local, token });
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

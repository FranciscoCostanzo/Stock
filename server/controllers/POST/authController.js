const poolConnection = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res) => {
    const { nombre_local, password } = req.body;
    const consult = 'SELECT * FROM locales WHERE nombreLocal = ?';
    
    try {
        const connection = await poolConnection.getConnection();
        const [rows, fields] = await connection.query(consult, [nombre_local]);
        
        if (rows.length > 0) {
            const local = rows[0];
            
            // Comparar la contraseña hasheada con la proporcionada por el usuario
            const match = await bcrypt.compare(password, local.password);
            
            if (match) {
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
                res.cookie('token', token, cookieOptions).send({ message: 'Local autenticado', local, token });
            } else {
                console.log('Credenciales incorrectas');
                res.status(401).send({ message: 'Credenciales incorrectas' });
            }
        } else {
            console.log('Local no encontrado');
            res.status(404).send({ message: 'Local no encontrado' });
        }

        connection.release();
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

# Migración de Base de Datos a MySQL

Tenía una base de datos en Microsoft Access y decidí exportarla a Excel para luego utilizar Python junto con pandas para enviar los datos a mi base de datos MySQL remota.

## Creación de la Base de Datos

### Paso 1: Crear la base de datos

```sql

CREATE DATABASE TUBASE;

CREATE TABLE Caja (
  id CHAR(36) NOT NULL,  -- UUID en formato de texto
  fecha DATE NOT NULL,  -- Fecha en formato ISO 8601
  motivo INT NOT NULL,  -- Foreign Key a la tabla Motivos_Caja
  monto DECIMAL(10, 2) NOT NULL,  -- Valor con dos decimales
  sobrante DECIMAL(10, 2) NOT NULL,  -- Valor con dos decimales
  id_usuario INT NOT NULL,  -- Foreign Key a la tabla Usuarios
  id_sucursal INT NOT NULL,  -- Foreign Key a la tabla Sucursal,

  -- Definición de las Foreign Keys
  CONSTRAINT fk_motivo FOREIGN KEY (motivo) REFERENCES Motivos_Caja(id),
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
  CONSTRAINT fk_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id),

  -- Clave primaria compuesta por id y motivo
  PRIMARY KEY (id, motivo)
);



CREATE TABLE Fallas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    id_usuario INT,
    id_mercaderia INT,
    id_sucursal INT,
    cantidad INT,
    CONSTRAINT fk_fallas_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_fallas_mercaderia FOREIGN KEY (id_mercaderia) REFERENCES Mercaderia(id),
    CONSTRAINT fk_fallas_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id)
);

CREATE TABLE Mercaderia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    costo DECIMAL(10, 2),
    publico DECIMAL(10, 2)
);

CREATE TABLE Stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mercaderia INT,
    id_sucursal INT,
    cantidad INT,
    CONSTRAINT fk_stock_mercaderia FOREIGN KEY (id_mercaderia) REFERENCES Mercaderia(id),
    CONSTRAINT fk_stock_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id)
);

CREATE TABLE Sucursal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255)
);

CREATE TABLE Usuario_Sucursal (
    id_usuario INT NOT NULL,
    id_sucursal INT NOT NULL,
    PRIMARY KEY (id_usuario, id_sucursal),
    CONSTRAINT fk_usuario_sucursal_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    CONSTRAINT fk_usuario_sucursal_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id)
);

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') NOT NULL
);

CREATE TABLE Ventas (
    id_venta VARCHAR(36) NOT NULL,               -- Usamos UUID en vez de INT
    fecha_venta DATE NOT NULL,
    hora_venta TIME NOT NULL,
    id_usuario INT,
    id_sucursal INT,
    id_mercaderia INT,
    cantidad INT NOT NULL,
    metodo_de_pago ENUM('efectivo', 'tarjeta') NOT NULL,
    nombre_cliente VARCHAR(100) DEFAULT NULL,    -- Permitir NULL en ventas en efectivo
    apellido_cliente VARCHAR(100) DEFAULT NULL,  -- Permitir NULL en ventas en efectivo
    dni_cliente VARCHAR(20) DEFAULT NULL,        -- Permitir NULL en ventas en efectivo
    cuotas INT DEFAULT NULL,                     -- Permitir NULL en ventas en efectivo
    adelanto DECIMAL(10, 2) DEFAULT NULL,        -- Permitir NULL en ventas en efectivo
    total_venta DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_venta, id_mercaderia, id_sucursal),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id),
    FOREIGN KEY (id_mercaderia) REFERENCES Mercaderia(id)
);

CREATE TABLE Motivos_Caja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  motivo VARCHAR(255) NOT NULL
);



```

## import pandas as pd

## import mysql.connector

### Función para cargar datos desde Excel y cargar en MySQL

        def cargar_datos_desde_excel_a_mysql(excel_file, server, database,       username, password):
        conn = None
        try:
        # Leer el archivo Excel
        df = pd.read_excel(excel_file, usecols=['Descripcion', 'Costo', 'Publico'])

        # Filtrar datos para solo incluir productos con costo mayor a 2000
        df = df[df['Costo'] > 2000]

        # Conectar a MySQL
        conn = mysql.connector.connect(
            host=server,
            user=username,
            password=password,
            database=database
        )

        if conn.is_connected():
            cursor = conn.cursor()

            # Iterar sobre las filas del DataFrame y insertar en MySQL
            for index, row in df.iterrows():
                descripcion = row['Descripcion']
                costo = row['Costo']
                publico = row['Publico']

                # Ejecutar la consulta SQL de inserción
                sql = "INSERT INTO Mercaderia (descripcion, costo, publico) VALUES (%s, %s, %s)"
                cursor.execute(sql, (descripcion, costo, publico))
                conn.commit()

            print("Datos insertados correctamente en MySQL.")

    except mysql.connector.Error as error:
        print(f"Error al conectar o insertar datos en MySQL: {error}")

    except Exception as e:
        print(f"Error inesperado: {e}")

    finally:
        if conn is not None and conn.is_connected():
            cursor.close()
            conn.close()
            print("Conexión a MySQL cerrada.")

            # Configuración de parámetros
    excel_file = 'TUEXCEL.xlsx'
    server = 'TUSERVER'
    database = 'TUBASE'
    username = 'TUUSER'
    password = 'TUPASS'

    cargar_datos_desde_excel_a_mysql(excel_file, server, database, username, password)

### Función para cargar datos desde Excel y actualizar en MySQL

        def actualizar_stock_desde_excel(excel_file, server, database, username, password):
        conn = None
         try:
        # Leer el archivo Excel
        df = pd.read_excel(excel_file, usecols=['Articulo', 'Stock'])

        # Conectar a MySQL
        conn = mysql.connector.connect(
            host=server,
            user=username,
            password=password,
            database=database
        )

        if conn.is_connected():
            cursor = conn.cursor()

            # Obtener todos los IDs y descripciones de Mercaderia
            cursor.execute("SELECT id, descripcion FROM Mercaderia")
            mercaderia_data = cursor.fetchall()
            mercaderia_dict = {row[1]: row[0] for row in mercaderia_data}

            # Iterar sobre las filas del DataFrame y actualizar la tabla Stock en MySQL
            for index, row in df.iterrows():
                descripcion = row['Articulo']
                cantidad = row['Stock']

                if descripcion in mercaderia_dict:
                    id_mercaderia = mercaderia_dict[descripcion]
                    id_sucursal = 5  # ID de sucursal fijo

                    # Ejecutar la consulta SQL de inserción
                    sql = "INSERT INTO Stock (id_mercaderia, id_sucursal, cantidad) VALUES (%s, %s, %s)"
                    cursor.execute(sql, (id_mercaderia, id_sucursal, cantidad))
                    conn.commit()

            print("Stock actualizado correctamente en MySQL.")

    except mysql.connector.Error as error:
        print(f"Error al conectar o actualizar datos en MySQL: {error}")

    except Exception as e:
        print(f"Error inesperado: {e}")

    finally:
        if conn is not None and conn.is_connected():
            cursor.close()
            conn.close()
            print("Conexión a MySQL cerrada.")

            # Configuración de parámetros
        excel_file = 'TUEXCEL.xlsx'
        server = 'TUSERVER'
        database = 'TUBASE'
        username = 'TUUSER'
        password = 'TUPASS'

        actualizar_stock_desde_excel(excel_file, server, database, username, password)

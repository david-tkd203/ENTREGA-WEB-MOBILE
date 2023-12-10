from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde cualquier origen

# Configuración de conexión a la base de datos
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "123456789",
    "database": "WebMobile",
}

# Ruta para obtener datos
@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        with get_database_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM personas")
                results = cursor.fetchall()

                data = [
                    {
                        "id": row["id"],
                        "nombre": row["nombre"],
                        "edad": row["edad"],
                        "fechaNacimiento": row["fechaNacimiento"].strftime("%Y-%m-%d"),
                    }
                    for row in results
                ]

                return jsonify(data)

    except mysql.connector.Error as err:
        print(f"Error de MySQL: {err}")
        return jsonify({"error": "Error al obtener datos"}), 500

# Ruta para agregar datos
@app.route('/api/addData', methods=['POST'])
@app.route('/api/addData', methods=['POST'])
def add_data():
    try:
        connection = get_database_connection()
        cursor = connection.cursor()

        data = request.get_json()
        nombre, edad, fechaNacimiento = data.get("nombre"), data.get("edad"), data.get("fechaNacimiento")

        if not all((nombre, edad, fechaNacimiento)):
            return jsonify({"error": "Todos los campos son requeridos"}), 400

        query = 'INSERT INTO personas (nombre, edad, fechaNacimiento) VALUES (%s, %s, %s)'
        cursor.execute(query, (nombre, edad, fechaNacimiento))
        connection.commit()

        return jsonify({"success": True})

    except mysql.connector.Error as err:
        print(f"Error de MySQL: {err}")
        return jsonify({"error": "Error al agregar datos"}), 500

    finally:
        cursor.close()
        connection.close()

# Usar context manager para manejar la conexión a la base de datos
def get_database_connection():
    return mysql.connector.connect(**db_config)
app.debug = True
if __name__ == '__main__':
    app.run(port=5174)






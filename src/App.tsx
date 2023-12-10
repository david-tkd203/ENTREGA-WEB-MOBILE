import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from './components/config/config';
import './App.css';


const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    fechaNacimiento: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error('Error al obtener datos del servidor');
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/addData`, formData);
      if (response.status === 200) {
        console.log('Datos enviados correctamente');
        setFormData({
          nombre: '',
          edad: '',
          fechaNacimiento: '',
        });
        fetchData();
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.error('Error al enviar datos al servidor');
      }
    } catch (error) {
      console.error('Error al enviar datos al servidor:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Ingreso y Visualización de Datos</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Edad:
          <input
            type="text"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Fecha de Nacimiento:
          <input
            type="text"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Enviar Datos</button>
      </form>
      {showAlert && (
        <div className="alert-container">
          <p>Datos enviados correctamente. ¡Alerta visible durante 3 segundos!</p>
        </div>
      )}
      <ul className="data-list">
        {data.map((item) => (
          <li key={item.id}>
            {item.nombre} - {item.edad} años - {item.fechaNacimiento}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

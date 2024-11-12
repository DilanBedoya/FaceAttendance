import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/login.css';
import { Button } from 'react-bootstrap';
import imagenes from '../components/images'


export default function Confirmar(){
    const { token } = useParams();
    // const [mensaje, setMensaje] = useState({});
    const verifyToken = async () => {
        try {
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/confirmar/${token}`;
            const response = await axios.get(url);
            // Mostrar alerta de confirmación
            Swal.fire({
                icon: 'success',
                title: '¡Confirmación Exitosa!',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });

            console.log("esta es tu respuesta",response)

        } catch (error) {
            console.error("Error en la peticion ",error);

            // Mostrar alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || 'Hubo un problema con la confirmación',
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    };


    const navigate = useNavigate();
    const handleLogin = () =>{
        navigate("/login")
    }

    useEffect(() => {
        verifyToken()
    }, []);

    return (
        <div className="login-page" style={{
            // backgroundImage: `url(alo)`,
            backgroundImage: `url('${imagenes.fondoRecoverPassword}')`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
        }}>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="login-box p-4 text-center">
                    <img src={`${imagenes.logo}`} alt="Logo" style={{ height: '200px', borderRadius: '40px' }} />
                    <h2 className="text-3xl font-semibold mb-2 text-gray-500">Muchas Gracias</h2>
                    <p className="text-gray-600 mt-4">Ya puedes iniciar sesión</p>

                    <Button variant="outline-dark" className="w-100" onClick={handleLogin}>
                            Login
                    </Button>
                
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import imagenes from '../components/images';
import '../styles/login.css'; 


export default function Restablecer() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [tokenback, setTokenBack] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    
    // Verificación del token
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const url = `${import.meta.env.VITE_URL_BACKEND}/docente/recuperar-password/${token}`;
                const respuesta = await axios.get(url);
                setTokenBack(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Token Verificado',
                    text: respuesta.data.msg,
                    confirmButtonColor: 'black'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.msg || 'Token inválido',
                    confirmButtonColor: 'black'
                });
            }
        };
        verifyToken();
    }, [token]);

    // Envío del formulario para restablecer la contraseña
    const onSubmit = async (data) => {
        try {
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/nueva-password/${token}`;
            const respuesta = await axios.post(url, data);
            
            Swal.fire({
                icon: 'success',
                title: 'Contraseña Restablecida',
                text: respuesta.data.msg,
                confirmButtonColor: 'black'
            });

            reset();
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || 'No se pudo restablecer la contraseña',
                confirmButtonColor: 'black'
            });
        }
    };

    return (
        <div className="login-page" style={{
            backgroundImage: `url('${imagenes.fondoRecoverPassword}')`, // Reemplaza con la ruta de la imagen de fondo
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
        }}>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="login-box p-4">
                    <h3 className="text-center mb-3">Restablece tu Contraseña</h3>
                    {tokenback ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <input 
                                    type="password" 
                                    placeholder="Nueva Contraseña"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'La contraseña es obligatoria' })}
                                />
                                {errors.password && <span className="text-danger">{errors.password.message}</span>}
                            </div>
                            <div className="mb-3">
                                <input 
                                    type="password" 
                                    placeholder="Confirma tu Contraseña"
                                    className={`form-control ${errors.confirmpassword ? 'is-invalid' : ''}`}
                                    {...register('confirmarPassword', { required: 'La confirmación es obligatoria' })}
                                />
                                {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword.message}</span>}
                            </div>
                            <button type="submit" className="btn btn-dark w-100 mt-2">Restablecer Contraseña</button>
                        </form>
                    ) : (
                        <p className="text-center">Verificando token...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

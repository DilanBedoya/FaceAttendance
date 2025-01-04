import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import imagenes from '../components/images'
import { Form, Button, Container, Row } from 'react-bootstrap';
import '../styles/login.css'
import { GrSecure } from "react-icons/gr";
import Swal from 'sweetalert2';

import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function RecoverPassword() {

    //Hook para recuperar contraseña
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    //funcion que se ejecutará en el envío del correo
    const onSubmit = async (data) => {
        try {
            //url del endpoint
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/recuperar-password`

            // Hacer la petición POST al backend
            const response = await axios.post(url, data);

            //mostrar alerta correcta
            Swal.fire({
                imageUrl: imagenes.alertEmail,
                title: 'Correo Enviado',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
            // Manejar la respuesta
            //limpiar form
            reset();

        } catch (error) {
            // Manejar errores
            console.error('Error en la petición:', error);
            //mostrar alerta incorrecta
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    }

    //funcion para navegar al login
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="login-page" style={{
                backgroundImage: `url('${imagenes.fondoRecoverPassword}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
            }}>
                <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>

                    <div className="login-box p-4">
                        <div className="text-center mb-7">

                            <GrSecure style={{ fontSize: '6rem' }}></GrSecure>
                            <h6>¿Tienes problemas para ingresar?</h6>
                            <p>Introduce tu correo electrónico y te enviaremos un enlace para que vuelvas a entrar en tu cuenta.</p>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>

                                <Form.Group controlId="formBasicEmail">

                                    <Form.Control type="email" placeholder="Correo Electrónico" className={errors.email ? 'is-invalid mb-1' : 'mb-1'}
                                        {...register('email', {
                                            required: {
                                                value: true,
                                            },
                                            //Validar luego para el correo

                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@epn\.edu\.ec$/,
                                                message: "El correo debe ser institucional - @epn.edu.ec"
                                            }

                                        })}
                                    />

                                </Form.Group>
                                {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email.message}</span>}
                            </Row>
                            <br />
                            <Row>

                                <Button variant="dark" type="submit" className="w-100">
                                    Envíar enlace de acceso
                                </Button>
                            </Row>

                        </Form>
                        <br />
                        <p>¿No tienes una cuenta? <Link to="/register" style={{ color: 'black' }}>Registrate Aquí</Link></p>
                        <Button variant="outline-dark" className="w-100" onClick={handleLogin}>
                            Volver al inicio de sesión
                        </Button>
                    </div>
                </Container>
            </div>
        </>
    );
}

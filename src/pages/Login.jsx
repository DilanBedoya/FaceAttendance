import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

//Interfaces
import imagenes from '../components/images'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/login.css'
import { LiaChalkboardTeacherSolid, } from "react-icons/lia";
import Swal from 'sweetalert2';

//logica
import { useForm } from 'react-hook-form'
import axios from 'axios';
import userAuth from '../context/AuthProvider';
import NavBarComponent from '../components/Navbar';


export default function Login() {

    //manejar el inicio de sesión
    const navigate = useNavigate();
    const login = userAuth((state) => state.login)


    // Verificar si el token está presente, si no, redirigir al login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    //Hook para el login
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    //funcion que se ejecutará en el envío del formulario
    const onSubmit = async (data) => {
        try {
            //url del endpoint
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/login`

            // Hacer la petición POST al backend
            const response = await axios.post(url, data);

            //almacenar el token en la localStorage y el usuario
            localStorage.setItem('token', response.data.token);

            //manejar el estado del usuario
            login(response.data)


            //mostrar alerta correcta
            Swal.fire({
                icon: 'success',
                title: 'Inicio de Sesión Correcto',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
            // Manejar la respuesta
            console.log('Respuesta exitosa:', response.data);

            //limpiar form
            reset();

            //navegar al dashboard
            navigate("/dashboard");

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

    //Función para mostrar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {/* Barra de navegación */}
            <NavBarComponent />

            <div
                className="login-page"
                style={{
                    backgroundImage: `url('${imagenes.fondoLogin}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="login-box p-5">
                        <div className="text-center mb-7">
                            <h1>
                                Bienvenido
                            </h1>
                            <LiaChalkboardTeacherSolid style={{ fontSize: '6rem' }}></LiaChalkboardTeacherSolid>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control type="email" placeholder="example@epn.edu.ec" className={errors.email ? 'is-invalid mb-1' : 'mb-1'}
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: "Email es requerido"

                                        },
                                        //Validar luego para el correo

                                        // pattern: {
                                        //     value: /^[a-z0-9._%+-]+@epn\.edu\.ec$/,
                                        //     message: "El correo debe ser institucional - @epn.edu.ec"
                                        // }

                                    })}
                                />

                            </Form.Group>
                            {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email.message}</span>}

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type={showPassword ? 'text' : 'password'} placeholder="*****" className={errors.password ? 'is-invalid mb-1' : 'mb-1'}
                                    {...register('password', {
                                        required: {
                                            value: true,
                                            message: "Contraseña es requerido"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "Debe tener más de tres dígitos"
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Debe tener menos de 20 dígitos"
                                        }

                                    })}
                                />

                            </Form.Group>
                            {errors.password && <span style={{ color: 'red', fontSize: '0.8rem', }}>{errors.password.message}</span>}

                            <Row className="mb-3">
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Mostrar contraseña"
                                        checked={showPassword}
                                        onChange={handleTogglePassword}
                                    />
                                </Col>
                                <Col className='text-end'>
                                    <Link to="/recover-password" style={{ color: 'black' }}>Recuperar contraseña</Link>
                                </Col>
                            </Row>

                            <Button variant="dark" type="submit" className="w-100">
                                Iniciar Sesión
                            </Button>

                        </Form>
                        <br />

                        <p>¿No tienes una cuenta? <Link to="/register" style={{ color: 'black' }}>Registrate Aquí</Link></p>

                    </div>
                </Container>
            </div>
        </>
    );
}

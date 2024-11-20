import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import imagenes from '../components/images'
import NavBarComponent from '../components/Navbar';


function LandingPage() {
    const navigate = useNavigate();

    // Verificar si el token está presente, si no, redirigir a landing page
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return (
        <>
            {/* Barra de navegación */}
            <NavBarComponent />

            {/* Sección principal */}
            <Container fluid className="bg-primary text-white text-center py-5" id="home">
                <Container>
                    <h1 className="display-4">Bienvenido a FaceAttendance</h1>
                    <p className="lead">El sistema de toma de asistencia mediante reconocimiento facial</p>
                    <img src={`${imagenes.logo}`} alt="Logo" style={{ height: '200px', borderRadius: '40px' }} />
                    <br />
                    <Button variant="light" size="lg" className="mt-3" onClick={() => { navigate("/login") }}>Comenzar Ahora</Button>
                </Container>
            </Container>

            {/* Sección de características */}
            <Container className="py-5" id="features">
                <Row className="text-center mb-5">
                    <Col>
                        <h2>Características del Sistema</h2>
                        <p>Descubre los beneficios de utilizar FaceAttendance</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} className="text-center">
                        <i className="bi bi-person-check-fill display-4 text-primary"></i>
                        <h4 className="mt-3">Registro Automático</h4>
                        <p>Detecta automáticamente a los estudiantes presentes sin intervención manual.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <i className="bi bi-shield-lock-fill display-4 text-primary"></i>
                        <h4 className="mt-3">Seguridad Avanzada</h4>
                        <p>Almacena datos de forma segura y protege la privacidad de cada usuario.</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <i className="bi bi-speedometer2 display-4 text-primary"></i>
                        <h4 className="mt-3">Rápido y Eficiente</h4>
                        <p>Optimizado para procesar las asistencias de manera ágil y precisa.</p>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <Container fluid className="footer bg-dark text-white text-center py-5" id="cta">
                <Container>
                    <h2>¡Empieza hoy mismo!</h2>
                    <p>Únete al sistema de reconocimiento facial más avanzado y seguro para la toma de asistencias.</p>
                    <Button variant="primary" size="lg" className="mx-2">Registrarse</Button>
                    <Button variant="outline-light" size="lg">Iniciar Sesión</Button>
                </Container>
            </Container>

        </>
    );
}

export default LandingPage;

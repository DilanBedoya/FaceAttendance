import React, { useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';

//manejar estado del usuario
import userAuth from '../context/AuthProvider';


export default function Dashboard() {


    const navigate = useNavigate()
    const user = userAuth((state) => state.user);
    const logout = userAuth((state) => state.logout);


    return (
        <Container fluid className="p-0">
            <Row className="min-vh-100 g-0">
                <Col xs={3} className="bg-dark text-white p-4 " >
                    <h2 className="text-center">FaceAttendance</h2>
                    <img

                        src="https://cdn-icons-png.flaticon.com/128/9686/9686232.png"
                        alt="img-client"
                        className="m-auto mt-3 p-1 border border-light rounded-circle d-flex flex-column align-items-center"
                        width={120}
                        height={120}

                    />
                    <div className="text-center mt-3">
                        Menú de Opciones
                    </div>

                    <hr className="border-light" />
                    <Nav className="flex-column" style={{ textAlign: 'center' }}>
                        <Nav.Link as={Link} to="/dashboard" className="text-white">
                            Perfil

                        </Nav.Link>
                        <Nav.Link as={Link} to="cursos" className="text-white">
                            Cursos
                        </Nav.Link>
                        <Nav.Link as={Link} to="estudiantes" className="text-white">
                            Estudiantes
                        </Nav.Link>
                        <Nav.Link as={Link} to="asistencias" className="text-white">
                            Asistencias
                        </Nav.Link>
                        <Nav.Link as={Link} to="actuaciones" className="text-white">
                            Actuaciones
                        </Nav.Link>
                        <Nav.Link as={Link} to="reportes" className="text-white">
                            Reportes
                        </Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content */}
                <Col xs={9} className="d-flex flex-column">
                    {/* Header */}
                    <Navbar bg="dark" variant="dark" sticky="top">

                        <Navbar.Text className="ms-auto me-2">
                            <span className="bg-success rounded-circle" style={{ width: '10px', height: '10px', display: 'inline-block' }}></span>

                            Docente - {user?.nombre + " " + user?.apellido}

                        </Navbar.Text>
                        <Navbar.Brand>
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/8640/8640277.png"
                                alt="img-client"
                                className="border border-success rounded-circle"
                                width={50}
                                height={50}
                            />
                        </Navbar.Brand>
                        <Button variant="outline-danger" className="me-3" onClick={() => {
                            //Eliminar el token y el manejo del usuario de la localStorage
                            logout()
                            localStorage.removeItem('token');
                            navigate("/login")

                        }}>
                            Salir
                        </Button>
                    </Navbar>

                    {/* Content Area */}
                    <div className="flex-grow-1 overflow-auto p-4 bg-light">
                        <Outlet />
                    </div>


                </Col>
            </Row>
        </Container>
    );
};


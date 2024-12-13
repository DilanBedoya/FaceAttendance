import React, { useState } from "react";
import { Container, Row, Col, Nav, Navbar, Button, Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import imagenes from "../components/images";
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiUserAddLine } from "react-icons/ri";
import { FaRegHandPointUp } from "react-icons/fa6";
import userAuth from "../context/AuthProvider";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = userAuth((state) => state.user);
    const logout = userAuth((state) => state.logout);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Container fluid className="p-0">
                <Row className="min-vh-100 g-0">
                    {/* Sidebar para pantallas grandes */}
                    <Col
                        xs={3}
                        className="bg-dark text-white p-4 d-none d-lg-block"
                        style={{ position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}
                    >
                        <h2 className="text-center">FaceAttendance</h2>
                        <img
                            src={`${imagenes.logo}`}
                            alt="img-client"
                            className="m-auto mt-3 p-1 border border-light rounded-circle d-flex flex-column align-items-center"
                            width={120}
                            height={120}
                        />
                        <div className="text-center mt-3">
                            <h6>Menú de Opciones</h6>
                        </div>
                        <hr className="border-light" />
                        <Nav className="flex-column" style={{ textAlign: "left" }}>
                            <Nav.Link as={Link} to="/dashboard" className="text-white">
                                <CgProfile /> Perfil
                            </Nav.Link>
                            <Nav.Link as={Link} to="cursos" className="text-white">
                                <SiGoogleclassroom /> Cursos
                            </Nav.Link>
                            <Nav.Link as={Link} to="estudiantes" className="text-white">
                                <PiStudent /> Estudiantes
                            </Nav.Link>
                            <Nav.Link as={Link} to="asistencias" className="text-white">
                                <MdOutlinePlaylistAddCheck /> Asistencias
                            </Nav.Link>
                            <Nav.Link as={Link} to="actuaciones" className="text-white">
                                <FaRegHandPointUp /> Reporte Actuaciones
                            </Nav.Link>
                            <Nav.Link as={Link} to="reportes" className="text-white">
                                <RiUserAddLine /> Reporte Asistencias
                            </Nav.Link>
                        </Nav>
                    </Col>

                    {/* Sidebar Offcanvas para dispositivos móviles */}
                    <Offcanvas
                        show={isSidebarOpen}
                        onHide={() => setIsSidebarOpen(false)}
                        placement="start"
                        className="bg-dark text-white"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>FaceAttendance</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <img
                                src={`${imagenes.logo}`}
                                alt="img-client"
                                className="m-auto mt-3 p-1 border border-light rounded-circle d-flex flex-column align-items-center"
                                width={120}
                                height={120}
                            />
                            <div className="text-center mt-3">
                                <h6>Menú de Opciones</h6>
                            </div>
                            <hr className="border-light" />
                            <Nav className="flex-column" style={{ textAlign: "left" }}>
                                <Nav.Link
                                    as={Link}
                                    to="/dashboard"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <CgProfile /> Perfil
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="cursos"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <SiGoogleclassroom /> Cursos
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="estudiantes"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <PiStudent /> Estudiantes
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="asistencias"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <MdOutlinePlaylistAddCheck /> Asistencias
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="actuaciones"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaRegHandPointUp /> Reporte Actuaciones
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="reportes"
                                    className="text-white"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <RiUserAddLine /> Reporte Asistencias
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>


                    {/* Main Content */}
                    <Col xs={12} lg={9} className="d-flex flex-column">
                        {/* Navbar */}
                        <Navbar bg="dark" variant="dark" sticky="top" className="w-100">
                            <Button
                                variant="outline-light"
                                className="d-lg-none me-2"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                Menú
                            </Button>
                            <Navbar.Text className="ms-auto me-2">
                                <span
                                    className="bg-success rounded-circle"
                                    style={{ width: "10px", height: "10px", display: "inline-block" }}
                                ></span>
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
                            <Button
                                variant="outline-danger"
                                className="me-3"
                                onClick={() => {
                                    logout();
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }}
                            >
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
        </>
    );
}

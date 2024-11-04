// NavBarComponent.js
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import imagenes from '../components/images'


const NavBarComponent = () => {
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <img onClick={() => navigate('/')} src={imagenes.logo} alt="Logo" style={{ height: '25px', borderRadius: '40px', cursor: 'pointer' }} />
                <Navbar.Brand
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    FaceAttendance
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">

                        <Button
                            variant="outline-light"
                            className="mx-2"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/register')}
                        >
                            Registrarse
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBarComponent;

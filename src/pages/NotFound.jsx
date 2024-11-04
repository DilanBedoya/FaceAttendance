
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { PiSmileySadLight } from "react-icons/pi";

export default function NotFound() {

    const navigate = useNavigate()

    return (
        <>

            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>

                <PiSmileySadLight style={{ fontSize: '20rem' }}></PiSmileySadLight>
                <h1 className="display-1">404</h1>
                <p className="lead">Oops! La Página que estás buscando no fue encontrada</p>
                <Button variant="outline-dark" onClick={() => navigate('/')}>
                    Volver al inicio
                </Button>
            </Container>
        </>
    )
}
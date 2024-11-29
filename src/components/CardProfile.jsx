import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import userAuth from '../context/AuthProvider';
import imagenes from '../components/images'

const CardProfile = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user, updateProfile } = userAuth();

    // Efect para llenar el formulario con los datos del usuario al cargar
    useEffect(() => {
        reset({
            id: user?.id || '',
            nombre: user?.nombre || '',  // Asignar por defecto
            apellido: user?.apellido || '',
            ciudad: user?.ciudad || '',
            direccion: user?.direccion || '',
            email: user?.email || '',
        });
    }, [user, reset]);

    const onSubmit = (data) => {
        updateProfile(data);

    };

    return (
        <Card className="m-3">
            
            <Card.Body>
                <Row>

                    <Card.Title>Perfil</Card.Title>
                    
                    <Col>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            {/* Campo oculto para el ID */}
                            <input type="hidden" {...register('id')} />

                            <Form.Group controlId="firstName">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('nombre', { required: true })}
                                />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Apellido:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('apellido', { required: true })}
                                />
                            </Form.Group>
                            <Form.Group controlId="city">
                                <Form.Label>Ciudad:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('ciudad', { required: true })}
                                />
                            </Form.Group>
                            <Form.Group controlId="direccion">
                                <Form.Label>Dirección:</Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('direccion', { required: true })}
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    disabled
                                    type="text"
                                    {...register('email', { required: true })}
                                />
                            </Form.Group>


                            <br />
                            <Button variant="dark" type="submit">
                                Actualizar
                            </Button>
                        </Form>
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <img
                            src={(imagenes.perfil)}
                            alt="Perfil-docente"
                            style={{ height: "350px", width: "350px" }}
                        />
                    </Col>

                </Row>

            </Card.Body>
        </Card>
    );
};

export default CardProfile;

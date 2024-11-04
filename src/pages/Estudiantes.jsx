
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";

export default function Estudiantes() {
    const [subject, setSubject] = useState('');


    const handleSelectSubject = (subject) => {
        setSubject(subject);
    };

    const [estudiantes, setEstudiantes] = useState([])



    return (
        <>

            <Container className="mt-2">

                <Table striped bordered hover responsive="sm" style={{ textAlign: 'center' }}>
                    <thead className="table-dark ">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cédula</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th style={{ textAlign: "center" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.length > 0 ? (
                            estudiantes.map((estudiantes, index) => (
                                <tr key={estudiantes.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{estudiantes.nombre}</td>
                                    <td>{estudiantes.apellido}</td>
                                    <td>{estudiantes.cedula}</td>
                                    <td>{estudiantes.direccion}</td>
                                    <td>{estudiantes.ciudad}</td>
                                    <td>{estudiantes.telefono}</td>

                                    <td style={{ textAlign: "center" }}>
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                visualizarCurso(estudiantes._id)

                                            }}
                                            style={{ padding: 0, color: 'inherit', marginRight: '10px' }}
                                        >
                                            <GrUpdate />
                                        </Button>
                                        <Button
                                            variant="link"
                                            // onClick={() => eliminarCurso(estudiantes._id)}
                                            title="Eliminar curso"
                                            style={{ padding: 0, color: 'inherit' }}
                                        >
                                            <RiDeleteBin2Fill />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>Curso no seleccionado</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>

            <Container>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Gestionar Estudiantes</h1>
                </div>
                <Row className='text-center'>
                    <Col className='d-flex flex-column align-items-center'>
                        {/* Botón para seleccionar materia */}
                        <Form.Label>Seleccione la Materia</Form.Label>
                        <DropdownButton variant='outline-dark' title="Opciones" onSelect={handleSelectSubject}>
                            <Dropdown.Item eventKey="POO">POO</Dropdown.Item>
                            <Dropdown.Item eventKey="Matemáticas">Matemáticas</Dropdown.Item>
                        </DropdownButton>

                    </Col>

                </Row>



                <Row className='mt-3 text-center'>
                    <Col>
                        <h5>Materia: {subject}</h5>
                    </Col>
                    <Col>
                        <h5>Semestre : 2024-B</h5>
                    </Col>
                    <Col>
                        <h5>Paralelo : GR2</h5>

                    </Col>


                    {/* Tabla con la información de los estudiantes */}
                    <Table striped bordered hover responsive="sm" >
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cédula</th>
                                <th>Dirección</th>
                                <th>Ciudad</th>
                                <th>Teléfono</th>
                                <th style={{ textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td>1</td>
                                <td>Dilan</td>
                                <td>Bedoya</td>
                                <td>1728172882</td>
                                <td>Floresta</td>
                                <td>Quito</td>
                                <td>0982000211</td>

                                <td style={{ textAlign: "center" }}><GrUpdate style={{ marginRight: '10px' }} /><RiDeleteBin2Fill /></td>
                            </tr>
                            <tr >
                                <td>2</td>
                                <td>Alexis</td>
                                <td>Farinango</td>
                                <td>1725489665</td>
                                <td>San Antonio</td>
                                <td>Quito</td>
                                <td>0985265240</td>
                                <td style={{ textAlign: "center" }}><GrUpdate style={{ marginRight: '10px' }} /><RiDeleteBin2Fill /></td>
                            </tr>
                            <tr >
                                <td>3</td>
                                <td>Steven</td>
                                <td>Castillo</td>
                                <td>1725845698</td>
                                <td>Pomasqui</td>
                                <td>Quito</td>
                                <td>0982547841</td>

                                <td style={{ textAlign: "center" }}><GrUpdate style={{ marginRight: '10px' }} /><RiDeleteBin2Fill /></td>
                            </tr>

                        </tbody>
                    </Table>
                </Row>


            </Container>
        </>
    );
};



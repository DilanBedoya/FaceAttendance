
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { BiCommentDetail } from "react-icons/bi";

export default function Actuaciones() {

    const [subject, setSubject] = useState('');


    const handleSelectSubject = (subject) => {
        setSubject(subject);
    };

    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Gestionar Actuaciones</h1>
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
                            <th>Correo Electrónico</th>
                            <th>Cantidad</th>

                            <th style={{ textAlign: "center" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td>1</td>
                            <td>Dilan</td>
                            <td>Bedoya</td>
                            <td>dilan@epn</td>
                            <td>1</td>


                            <td style={{ textAlign: "center" }}><BiCommentDetail /></td>
                        </tr>
                        <tr >
                            <td>2</td>
                            <td>Alexis</td>
                            <td>Farinango</td>
                            <td>alexis@epn</td>
                            <td>0</td>

                            <td style={{ textAlign: "center" }}><BiCommentDetail /></td>

                        </tr>
                        <tr >
                            <td>3</td>
                            <td>Steven</td>
                            <td>Castillo</td>
                            <td>steven@epn</td>
                            <td>2</td>
                            <td style={{ textAlign: "center" }}><BiCommentDetail /></td>

                        </tr>

                    </tbody>
                </Table>
            </Row>


        </Container>
    );
};




import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';

export default function Reportes() {
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [attendance, setAttendance] = useState({
        dilan: 'presente',
        steven: 'ausente'
    });

    const handleSelectSubject = (subject) => {
        setSubject(subject);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleAttendanceChange = (student, status) => {
        setAttendance({
            ...attendance,
            [student]: status
        });
    };

    const handleSubmit = () => {
        console.log('PDF Generado', attendance);
        alert('PDF generado con éxito');
    };
    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Reportes</h1>
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
                <Col className='d-flex flex-column align-items-center'>
                    {/* Input para seleccionar la fecha */}
                    <Form.Group controlId="date">
                        <Form.Label>Filtrar por Fecha</Form.Label>
                        <Form.Control type="date" value={date} onChange={handleDateChange} style={{ width: '150px' }} />
                    </Form.Group>
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
                <Table striped bordered hover >

                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cantidad Presentes</th>
                            <th>Cantidad Ausentes</th>
                            <th>Cantidad Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dilan</td>
                            <td>Bedoya</td>
                            <td>19</td>
                            <td>1</td>
                            <td>20</td>

                        </tr>
                        <tr>
                            <td>Steven</td>
                            <td>Castillo</td>
                            <td>20</td>
                            <td>0</td>
                            <td>20</td>

                        </tr>
                    </tbody>
                </Table>
            </Row>

            <div>

                <div className="text-end">
                    <Button variant="dark" onClick={handleSubmit}>Generar PDF</Button>
                </div>
            </div>
        </Container>
    );
};



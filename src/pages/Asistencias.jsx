
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function Asistencias() {
    const navigate = useNavigate();
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
        console.log('Guardar asistencia:', attendance);
        alert('Asistencia guardada');
    };

    const handleSubmitRegister = () => {
        //navegar al dashboard
        navigate("/dashboard/registro-asistencias");
    };


    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Gestionar Asistencias</h1>
            </div>

            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'left', lineHeight: '1.6' }}>
                Este módulo te permite registrar la asistencia de los estudiantes.

            </h6>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

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
                        <Form.Label>Seleccione la fecha</Form.Label>
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
                            <th>Correo Electrónico</th>
                            <th>Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Dilan</td>
                            <td>Bedoya</td>
                            <td>dilan@epn</td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    label="Presente"
                                    name="dilan"
                                    checked={attendance.dilan === 'presente'}
                                    onChange={() => handleAttendanceChange('dilan', 'presente')}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Ausente"
                                    name="dilan"
                                    checked={attendance.dilan === 'ausente'}
                                    onChange={() => handleAttendanceChange('dilan', 'ausente')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Steven</td>
                            <td>Castillo</td>
                            <td>steven@epn</td>
                            <td>
                                <Form.Check
                                    type="radio"
                                    label="Presente"
                                    name="steven"
                                    checked={attendance.steven === 'presente'}
                                    onChange={() => handleAttendanceChange('steven', 'presente')}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Ausente"
                                    name="steven"
                                    checked={attendance.steven === 'ausente'}
                                    onChange={() => handleAttendanceChange('steven', 'ausente')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Row>

            <div className="d-flex justify-content-between">
                <div className="text-start">
                    <Button variant="outline-dark" onClick={handleSubmitRegister}>Registrar Asistencia</Button>

                </div>
                <div className="text-end">
                    <Button variant="dark" onClick={handleSubmit}>Guardar</Button>
                </div>
            </div>
        </Container>
    );
};



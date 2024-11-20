
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { BiCommentDetail } from "react-icons/bi";
import axios from 'axios';
import userAuth from '../context/AuthProvider';
export default function Actuaciones() {
    const user = userAuth((state) => state.user);
    const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos
    const [selectedCourse, setSelectedCourse] = useState(null); // Estado para almacenar el curso seleccionado

    // Función para listar cursos
    const listarCursos = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/curso/visualizar`;
            const data = { "docenteId": user.id };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            // Hacer la petición POST al backend con token
            const response = await axios.post(url, data, { headers });
            setCursos(response.data); // Guardar los cursos en el estado
            console.log(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        listarCursos();
    }, []);

    // Manejar la selección del curso en el Dropdown
    const handleSelectSubject = (cursoId) => {
        const cursoSeleccionado = cursos.find(curso => curso._id === cursoId);
        setSelectedCourse(cursoSeleccionado);

    };


    const [subject, setSubject] = useState('');



    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Gestionar Actuaciones</h1>
            </div>
            <Row className='text-center'>
                <Col className='d-flex flex-column align-items-center'>
                    {/* Botón para seleccionar curso */}
                    <Form.Label><strong>Seleccione el Curso</strong></Form.Label>
                    <DropdownButton variant='outline-dark' title={selectedCourse ? selectedCourse.materia : "Opciones"} onSelect={handleSelectSubject}>
                        {cursos.map((curso) => (
                            <Dropdown.Item key={curso._id} eventKey={curso._id}>{curso.materia + " - " + curso.paralelo}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>

            <Row className='mt-3 text-center'>
                <Col>
                    <h5>Materia: {selectedCourse ? selectedCourse.materia : "---"}</h5>
                </Col>
                <Col>
                    <h5>Semestre : {selectedCourse ? selectedCourse.semestre : "---"}</h5>
                </Col>
                <Col>
                    <h5>Paralelo : {selectedCourse ? selectedCourse.paralelo : "---"}</h5>
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



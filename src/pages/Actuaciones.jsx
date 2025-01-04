
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { BiCommentDetail } from "react-icons/bi";
import axios from 'axios';
import userAuth from '../context/AuthProvider';
import images from '../components/images';
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
        listarEstudiantes(cursoSeleccionado);
    };

    // Función para listar estudiantes del curso seleccionado
    const [students, setStudents] = useState([]); // Estado para almacenar los estudiantes del curso seleccionado
    const listarEstudiantes = async (curso) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/actuacion/reporte`;
            const data = {
                "materia": curso.materia,
                "paralelo": curso.paralelo,
                "semestre": curso.semestre,
            };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            // Hacer la petición POST al backend para obtener los estudiantes
            const response = await axios.post(url, data, { headers });
            setStudents(response.data); // Guardar los estudiantes en el estado
            return response.data;
        } catch (error) {
            console.log(error);
            setStudents([])
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    };
    //Funcionalidad para filtrar
    const [filter, setFilter] = useState(''); // Estado para el filtro de nombre
    // Filtra los estudiantes por el nombre ingresado
    const filteredStudents = students.filter(estudiante =>
        estudiante.estudiante?.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        estudiante.estudiante?.apellido.toLowerCase().includes(filter.toLowerCase())
    );
    // Estado para controlar el modal
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null); // Estudiante seleccionado
    // Funciones para abrir y cerrar el modal
    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setShowModal(true);

    };
    const handleCloseModal = () => {
        setSelectedStudent(null);
        setShowModal(false);
    };


    const generatePDF = async (student) => {

        // Mostrar el cuadro de confirmación
        const { isConfirmed } = await Swal.fire({
            title: '¡Listo para crear el reporte!',
            text: `Para la estudiante "${student.estudiante.nombre} ${student.estudiante.apellido}". ¿Deseas continuar?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, adelante!',
            cancelButtonText: 'Cancelar',
        });

        if (isConfirmed) {
            const doc = new jsPDF();

            // Título del PDF
            const logoUrl = `${images.logo}`;
            const imgX = 15;
            const imgY = 10;
            const imgWidth = 18;
            const imgHeight = 18;
            doc.addImage(logoUrl, "PNG", imgX, imgY, imgWidth, imgHeight);

            // Agregar título
            const titleX = doc.internal.pageSize.getWidth() / 2; // Centro de la página
            const titleY = imgY + imgHeight + 5; // Debajo del logo, más cerca
            doc.setFontSize(20);
            doc.text("FaceAttendance", titleX, imgY + 10, { align: "center" });

            // Subtítulos
            doc.setFontSize(15);
            doc.text("Reporte de Actuaciones", 10, titleY + 2); // Ajustado para estar más cerca
            doc.setFontSize(14);
            doc.text(`Estudiante: ${student.estudiante.nombre} ${student.estudiante.apellido}`, 10, titleY + 10);

            // Espacio antes de las actuaciones
            let currentY = titleY + 18;

            // Validar si hay actuaciones
            if (student.descripciones.length > 0 && student.fecha_actuaciones.length > 0) {
                const groupedData = [];

                // Agrupar actuaciones por fecha
                student.fecha_actuaciones.forEach((fecha, index) => {
                    const descripciones = student.descripciones[index];
                    if (descripciones && descripciones.length > 0) {
                        groupedData.push({
                            fecha,
                            descripciones,
                        });
                    }
                });

                // Construir contenido del PDF
                groupedData.forEach(({ fecha, descripciones }) => {
                    doc.setFontSize(12);
                    doc.text(`Fecha: ${fecha}`, 10, currentY); // Ajustar posición de la fecha

                    currentY += 10; // Espacio después de la fecha

                    const data = descripciones.map((descripcion) => [descripcion]);

                    doc.autoTable({
                        head: [["Descripción"]],
                        body: data,
                        startY: currentY - 6, // Establecer la posición de inicio de la tabla
                        margin: { top: 5, left: 10, right: 10, bottom: 5 },
                        theme: "grid",
                        pageBreak: "auto",
                    });

                    currentY = doc.lastAutoTable.finalY + 10; // Ajustar la posición después de la tabla
                });
            } else {
                // Mensaje en caso de no tener actuaciones
                doc.setFontSize(12);
                doc.text("No hay actuaciones disponibles.", 10, currentY);
            }

            // Guardar PDF
            doc.save(`Reporte_Actuaciones_${student.estudiante.nombre}_${student.estudiante.apellido}.pdf`);
        }

    };

    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Reporte Actuaciones</h1>
            </div>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'left', lineHeight: '1.6' }}>
                Este módulo te permite
                obtener el reporte de actuaciones en PDF de cada estudiante.

            </h6>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

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


                <div>
                    {/* Input para filtrar por nombre */}
                    <Form.Group controlId="filterName" style={{ textAlign: 'left' }}>

                        <Form.Control
                            type="text"
                            placeholder="Filtrar por nombre o apellido"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </Form.Group>


                    <Table striped bordered hover responsive="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellido</th>

                                <th>Actuaciones durante el semestre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourse ? (
                                filteredStudents.length > 0 ? (
                                    filteredStudents.map((estudiante, index) => (
                                        <tr key={estudiante?._id}>
                                            <td>{index + 1}</td>
                                            <td>{estudiante.estudiante?.nombre}</td>
                                            <td>{estudiante.estudiante?.apellido}</td>


                                            <td>{estudiante.cantidad_actuaciones}</td>

                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    variant="link"
                                                    title='Reporte actuaciones'
                                                    onClick={() => handleOpenModal(estudiante)}
                                                    style={{ padding: 0, color: 'inherit', marginRight: '10px' }}
                                                >
                                                    <BiCommentDetail />
                                                </Button>

                                            </td>


                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron estudiantes</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>Selecciona un curso para ver los estudiantes</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>

                        Actuaciones de {selectedStudent?.estudiante?.nombre}{" "}
                        {selectedStudent?.estudiante?.apellido}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStudent?.descripciones?.length > 0 && selectedStudent?.fecha_actuaciones?.length > 0 ? (
                        <div>
                            <ol className="list-group list-group-numbered">
                                {selectedStudent.descripciones.map((descripcionesPorFecha, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>Fecha:</strong> {selectedStudent.fecha_actuaciones[index]} <br />
                                        <strong>Descripciones:</strong>
                                        <ul>
                                            {descripcionesPorFecha.length === 0 ? (
                                                <p>Sin actuaciones</p>
                                            ) : (
                                                descripcionesPorFecha.map((descripcion, subIndex) => (
                                                    <li key={subIndex}>{descripcion}</li>
                                                ))
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ) : (
                        <p>No hay actuaciones disponibles.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => generatePDF(selectedStudent)} disabled={
                        !selectedStudent?.descripciones?.length || // No hay descripciones
                        !selectedStudent?.fecha_actuaciones?.length || // No hay fechas de actuaciones
                        selectedStudent.descripciones.every(descripciones => descripciones.length === 0) // Todas las descripciones están vacías
                    }>
                        Generar PDF
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>



                </Modal.Footer>
            </Modal>

        </Container>
    );
};



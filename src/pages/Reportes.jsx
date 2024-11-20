
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//manejar estado del usuario
import userAuth from '../context/AuthProvider';
export default function Reportes() {

    const [date, setDate] = useState('');
    const [isFilteredByDate, setIsFilteredByDate] = useState(false);

    // Manejar el cambio de fecha
    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    // Función para enviar la petición cuando se confirma la fecha
    const FiltrarEstudianteFecha = async () => {
        if (date) {
            const [year, month, day] = date.split("-");
            const formattedDate = `${day}/${month}/${year}`;

            // Llamar a listarEstudiantes con await para esperar la respuesta
            const estudiantesFiltrados = await listarEstudiantes(selectedCourse, formattedDate);
            console.log(estudiantesFiltrados);
            if (estudiantesFiltrados) {
                setIsFilteredByDate(true); // Cambiar a vista de búsqueda por fecha solo si la respuesta es válida
                Swal.fire({
                    icon: 'success',
                    title: 'Filtrado Correcto',
                    text: "Puede visualizar la tabla",
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'black'
                });
            }
        } else {
            Swal.fire({
                icon: 'question',
                title: 'Advertencia',
                text: "La fecha no ha sido seleccionado aún",
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    };

    const handleSubmit = () => {
        console.log('PDF Generado');
        alert('PDF generado con éxito');
    };
    // Función para listar cursos
    const user = userAuth((state) => state.user);

    const [selectedCourse, setSelectedCourse] = useState(null); // Estado para almacenar el curso seleccionado
    const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos
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
            setDate("")
            setCursos(response.data); // Guardar los cursos en el estado
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    // Manejar la selección del curso en el Dropdown
    const handleSelectSubject = (cursoId) => {
        const cursoSeleccionado = cursos.find(curso => curso._id === cursoId);
        setIsFilteredByDate(false)
        setDate("")
        setSelectedCourse(cursoSeleccionado);
        listarEstudiantes(cursoSeleccionado); // Listar los estudiantes del curso seleccionado
    };

    useEffect(() => {
        listarCursos();
    }, []);


    // Función para listar estudiantes del curso seleccionado
    const [students, setStudents] = useState([]); // Estado para almacenar los estudiantes del curso seleccionado
    console.log(students);
    const listarEstudiantes = async (curso, formattedDate = "") => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/asistencia/reporte`;
            const data = {
                "materia": curso.materia,
                "paralelo": curso.paralelo,
                "semestre": curso.semestre,
            };

            // Si la fecha no está vacía, agregarla al objeto data
            if (formattedDate) {
                data.fecha = formattedDate;
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            console.log(data);

            // Hacer la petición POST al backend para obtener los estudiantes
            const response = await axios.post(url, data, { headers });
            setStudents(response.data); // Guardar los estudiantes en el estado
            // Retornar los datos de estudiantes
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            setStudents([])
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.msg || "El curso aún no ha sido seleccionado",
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


    const generatePDF = async () => {
        // Validación de curso y estudiantes
        if (!selectedCourse) {
            await Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un curso para generar el reporte.',
                icon: 'question',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (!filteredStudents || filteredStudents.length === 0) {
            await Swal.fire({
                title: 'Error',
                text: 'No hay estudiantes en el curso seleccionado para generar el reporte.',
                icon: 'question',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Mostrar el cuadro de confirmación
        const { isConfirmed } = await Swal.fire({
            title: '¡Listo para crear el reporte!',
            text: `Generaremos el informe para la materia "${selectedCourse.materia + " - " + selectedCourse.paralelo}". ¿Deseas continuar?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, adelante!',
            cancelButtonText: 'Cancelar',
        });

        if (isConfirmed) {
            // Generación del PDF
            const doc = new jsPDF();
            const title = isFilteredByDate ? `Reporte de Asistencia por Fecha en ${selectedCourse.materia + " " + selectedCourse.paralelo}` : `Reporte de Asistencia Total en ${selectedCourse.materia + " " + selectedCourse.paralelo}`;

            // Título del PDF
            doc.text(title, 14, 10);

            let tableColumn, tableRows;
            if (isFilteredByDate) {
                // Configuración de columnas y filas cuando se filtra por fecha
                tableColumn = ["#", "Nombre", "Apellido", "Fecha", "Estado de Asistencia"];
                tableRows = filteredStudents.map((estudiante, index) => [
                    index + 1,
                    estudiante.estudiante?.nombre || "",
                    estudiante.estudiante?.apellido || "",
                    estudiante.fecha || "",
                    estudiante.estadoAsistencia || ""
                ]);
            } else {
                // Configuración de columnas y filas para el reporte completo
                tableColumn = ["#", "Nombre", "Apellido", "Fechas y Estados de Asistencia", "Asistencias", "Ausencias", "Total"];
                tableRows = filteredStudents.map((estudiante, index) => {
                    const fechasYEstados = estudiante.fechasAsistencias && estudiante.estadosAsistencias
                        ? estudiante.fechasAsistencias.map((fecha, i) => `${fecha}: ${estudiante.estadosAsistencias[i] || ''}`).join('\n')
                        : "";

                    return [
                        index + 1,
                        estudiante.estudiante?.nombre || "",
                        estudiante.estudiante?.apellido || "",
                        fechasYEstados,
                        estudiante.cantidadPresentes || 0,
                        estudiante.cantidadAusencias || 0,
                        estudiante.cantidadAsistencias || 0
                    ];
                });
            }

            // Genera la tabla en el PDF
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { halign: 'center', valign: 'middle' },
                columnStyles: {
                    3: { cellWidth: isFilteredByDate ? 'auto' : 40 },
                },
            });

            // Descarga el PDF
            doc.save(`${selectedCourse.materia + "_" + selectedCourse.paralelo}_reporte_asistencias.pdf`);
        }
    };

    return (
        <Container>
            <div>
                <h1 style={{ textAlign: 'center' }}>Reporte Asistencia</h1>
            </div>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'justify', lineHeight: '1.6' }}>
                Este módulo permite seleccionar el curso para ver el reporte completo o filtrar por una fecha
                específica para revisar la asistencia de los estudiantes, además, puede generar un PDF para
                obtener un reporte detallado, ya sea del total o del filtro aplicado.
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
                <Col className='d-flex flex-column align-items-center'>
                    <Form.Group controlId="date">
                        <Form.Label><strong>Filtrar por Fecha</strong></Form.Label>
                        <Form.Control type="date" value={date} onChange={handleDateChange} style={{ width: '150px' }} />
                    </Form.Group>
                    <Button onClick={FiltrarEstudianteFecha} variant="outline-dark" style={{ marginTop: '10px' }}>Buscar</Button>
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

                {/* Tabla con la información de los estudiantes */}
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
                                {isFilteredByDate ? (
                                    <>
                                        <th>Fecha</th>
                                        <th>Estado de Asistencia</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Asistencias durante el semestre</th>
                                        <th>Ausencias durante el semestre</th>

                                        <th>Total</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourse ? (
                                filteredStudents.length > 0 ? (
                                    filteredStudents.map((estudiante, index) => (
                                        <tr key={estudiante.estudiante?._id}>
                                            <td>{index + 1}</td>
                                            <td>{estudiante.estudiante?.nombre}</td>
                                            <td>{estudiante.estudiante?.apellido}</td>
                                            {isFilteredByDate ? (
                                                <>
                                                    <td>{estudiante.fecha}</td>
                                                    <td>{estudiante.estadoAsistencia}</td>
                                                </>
                                            ) : (
                                                <>

                                                    <td>{estudiante.cantidadPresentes}</td>
                                                    <td>{estudiante.cantidadAusencias}</td>

                                                    <td>{estudiante.cantidadAsistencias}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center' }}>No se encontraron estudiantes</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>Selecciona un curso para ver los estudiantes</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Row>


            <div>

                <div className="text-end">
                    <Button variant="dark" onClick={generatePDF} >Generar PDF</Button>
                </div>
            </div>
        </Container>
    );
};



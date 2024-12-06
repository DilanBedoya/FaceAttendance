
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import userAuth from '../context/AuthProvider';
import Swal from 'sweetalert2';


export default function Asistencias() {

    const user = userAuth((state) => state.user);
    const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos
    const [selectedCourse, setSelectedCourse] = useState(null); // Estado para almacenar el curso seleccionado
    const [students, setStudents] = useState([]); // Estado para almacenar los estudiantes del curso seleccionado
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
    // Manejar la selección del curso en el Dropdown
    const handleSelectSubject = (cursoId) => {
        const cursoSeleccionado = cursos.find(curso => curso._id === cursoId);
        setSelectedCourse(cursoSeleccionado);
        listarEstudiantes(cursoSeleccionado);
    };

    useEffect(() => {
        listarCursos();
    }, []);

    // Función para listar estudiantes del curso seleccionado
    const listarEstudiantes = async (curso) => {
        try {

            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/asistencia/visualizar`;
            const data = {

                "materia": curso.materia,
                "paralelo": curso.paralelo,
                "semestre": curso.semestre
            };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            // Hacer la petición Put al backend para obtener los estudiantes
            const response = await axios.post(url, data, { headers });
            setStudents(response.data); // Guardar los estudiantes en el estado
            console.log(response.data);

        } catch (error) {
            console.log(error);
            setStudents([])
        }
    };


    //funcion para registrar la asistencia (Guardar)
    const handleSubmit = async (curso, date, asistencias) => {


        // Validación de curso y estudiantes
        if (!selectedCourse) {
            await Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un curso para guardar la asistencia',
                icon: 'question',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (!filteredStudents || filteredStudents.length === 0) {
            await Swal.fire({
                title: 'Error',
                text: 'No existe registro de estudiantes',
                icon: 'question',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            });
            return;
        }   

        // Validación de fecha no seleccionada
        if (!date) {
            await Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona la fecha',
                icon: 'question',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        console.log(curso);
        console.log(formattedDate);
        console.log(asistencias);

        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/asistencia/actualizar`;

            const data = {
                "materia": curso.materia,
                "paralelo": curso.paralelo,
                "semestre": curso.semestre,
                "fecha": formattedDate,
                "estudiantes": asistencias.map((asistencia) => ({
                    "asistenciaId": asistencia._id,
                    "estudianteId": asistencia.estudiante._id,
                    "estado": attendance[asistencia.estudiante._id] || "ausente",
                }))
            };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            // Hacer la petición POST al backend para obtener los estudiantes
            const response = await axios.put(url, data, { headers });
            Swal.fire({
                icon: 'success',
                title: 'Registro',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
            console.log(response.data);

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Registro',
                text: error.response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    };


    //Funcionalidad para obtener estudiantes
    console.log(students);
    const [filter, setFilter] = useState(''); // Estado para el filtro de nombre
    // Filtra los estudiantes por el nombre ingresado
    const filteredStudents = students.filter(estudiante =>
        estudiante.estudiante.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        estudiante.estudiante.apellido.toLowerCase().includes(filter.toLowerCase())
    );
    console.log(filteredStudents);


    //funcionalidad fecha
    const [date, setDate] = useState('');
    // Manejar el cambio de fecha

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };
    //Funcionalidad para validar que la fecha solo sea el dia actual
    const today = new Date();
    const formattedDateMax = today.toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
    const formattedDateMin = formattedDateMax;

    //Reconocimiento Facial
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [recognitionResult, setRecognitionResult] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (showModal) {
            const startCamera = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current.srcObject = stream;
                } catch (err) {
                    console.error('Error accessing camera:', err);
                }
            };
            startCamera();
        }

        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [showModal]);

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            setCapturedImage(blob);
            sendImageToBackend(blob, selectedCourse);
        }, 'image/jpeg');
    };

    const sendImageToBackend = async (blob, selectedCourse) => {
        const formData = new FormData();
        console.log(blob);
        console.log('curso seleccionado IA: ', selectedCourse);

        formData.append('image', blob);
        // Agregar los detalles del curso
        formData.append('materia', selectedCourse.materia);
        formData.append('semestre', selectedCourse.semestre);
        formData.append('paralelo', selectedCourse.paralelo);
        console.log("Contenido de FormData:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const url = `${import.meta.env.VITE_URL_BACKEND}/asistencia/reconocimiento-facial`;

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            );

            setRecognitionResult(response.data.message);
        } catch (error) {
            console.error('Error en el reconocimiento facial:', error);
        }
    };


    // Estado para manejar la asistencia por estudiante
    const [attendance, setAttendance] = useState({});

    // Maneja los cambios en la asistencia
    const handleAttendanceChange = (studentId, value) => {
        setAttendance(prevState => ({
            ...prevState,
            [studentId]: value, // Actualiza el valor seleccionado
        }));
    };
    console.log("Datos de asistencia:", attendance);

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
                        <Form.Label><strong>Seleccione la Fecha</strong></Form.Label>
                        <Form.Control min={formattedDateMin} max={formattedDateMax} type="date" value={date} onChange={handleDateChange} style={{ width: '150px' }} />
                    </Form.Group>
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
                    <Table striped bordered hover responsive="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo Electrónico</th>
                                <th style={{ textAlign: "center" }}>Estado de asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourse ? (
                                filteredStudents.length > 0 ? (
                                    filteredStudents.map((estudiante, index) => (
                                        <tr key={estudiante.estudiante._id}>
                                            <td>{index + 1}</td>
                                            <td>{estudiante.estudiante.nombre}</td>
                                            <td>{estudiante.estudiante.apellido}</td>
                                            <td>{estudiante.estudiante.email}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Form.Check
                                                    type="radio"
                                                    label="Presente"
                                                    name={`attendance-${estudiante.estudiante._id}`}
                                                    value="presente"
                                                    checked={attendance[estudiante.estudiante._id] === "presente"}
                                                    onChange={() => handleAttendanceChange(estudiante.estudiante._id, "presente")}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Ausente"
                                                    name={`attendance-${estudiante.estudiante._id}`}
                                                    value="ausente"
                                                    checked={attendance[estudiante.estudiante._id] === "ausente" || !attendance[estudiante.estudiante._id]}
                                                    onChange={() => handleAttendanceChange(estudiante.estudiante._id, "ausente")}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center' }}>No se encontraron estudiantes</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>Selecciona un curso para ver los estudiantes</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Row>





            <div className="d-flex justify-content-between">
                <div className="text-start">
                    <Button variant="outline-dark" onClick={() => setShowModal(true)}>Registrar Asistencia</Button>

                </div>
                <div className="text-end">
                    <Button variant="dark" onClick={() => { handleSubmit(selectedCourse, date, filteredStudents) }}>Guardar</Button>
                </div>
            </div>


            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reconocimiento Facial</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center align-items-center flex-column">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    style={{
                                        width: '100%',
                                        maxWidth: '800px',
                                        height: 'auto',
                                        border: '2px solid #007bff',
                                        borderRadius: '8px',
                                    }}
                                ></video>
                                {recognitionResult && (
                                    <p
                                        style={{
                                            marginTop: '15px',
                                            fontSize: '18px',
                                            color: 'green',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Resultado: {recognitionResult}
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                                <button className="btn btn-success" onClick={captureImage}>
                                    Capturar Imagen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};




import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import userAuth from '../context/AuthProvider';
import Swal from 'sweetalert2';
import '../styles/asistencias.css'

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


        console.log("Curso", curso);
        console.log("Fecha", formattedDate);
        console.log("asistencias", asistencias);

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
            setSelectedCourse(null)
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
  
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = async () => {
        // Validación de curso 
        if (!selectedCourse) {
            await Swal.fire({
                title: 'Error',
                text: 'Por favor, selecciona un curso para registrar la asistencia',
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

        setShowModal(true); // Abre el modal si el curso está seleccionado
    };

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

    const [isLoading, setIsLoading] = useState(false);
    const [recognitionStatus, setRecognitionStatus] = useState(null); 
    const [recognizedName, setRecognizedName] = useState("");
    const [isCapturing, setIsCapturing] = useState(false); 
    const timeoutRef = useRef(null); 
    const isCapturingRef = useRef(isCapturing);
    useEffect(() => {
       
        isCapturingRef.current = isCapturing;
    }, [isCapturing]);

    const handleStartCapture = () => {
        setIsCapturing(true); 
        console.log("Captura iniciada");
    };
    const handleStopCapture = () => {
        setIsCapturing(false); 
        console.log("Captura detenida");
    };

    const captureImage = () => {

        if (!isCapturingRef.current) {
            console.log("Captura detenida, no se ejecuta");
            return; // Si está detenido, no hace nada
        }
        console.log('capturando imagen');
        setIsLoading(true); // Inicia el proceso de carga
        setRecognitionStatus(null); // Resetea el estado previo

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            setCapturedImage(blob);

            // Simula el envío al backend y espera la respuesta
            sendImageToBackend(blob, selectedCourse, filteredStudents).then(() => {
                setIsLoading(false);

                // Configura el próximo disparo 3 segundos después de obtener la respuesta
                timeoutRef.current = setTimeout(() => {
                    captureImage();
                }, 3000);
            }).catch(() => {
                setIsLoading(false);

                // Asegura reintentar después de 3 segundos incluso en caso de error
                timeoutRef.current = setTimeout(() => {
                    captureImage();
                }, 3000);
            });
        }, 'image/jpeg');
    };

    // Limpia el timeout cuando se detiene la captura o el componente se desmonta
    useEffect(() => {
        if (!isCapturing && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isCapturing]);

    const sendImageToBackend = async (blob, selectedCourse, students) => {
        setIsLoading(true); // Inicia el proceso de carga
        setRecognitionStatus(null); // Resetea el estado previo
        setRecognizedName(null); // Resetea el nombre reconocido

        const formData = new FormData();
        formData.append('image', blob);
        formData.append('materia', selectedCourse.materia);
        formData.append('semestre', selectedCourse.semestre);
        formData.append('paralelo', selectedCourse.paralelo);

        const url = `${import.meta.env.VITE_URL_BACKEND}/asistencia/reconocimiento-facial`;

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Verificar si se ha reconocido un rostro
            const recognizedName = response.data.coincidencia; // Suponemos que el backend devuelve el nombre
            console.log("Coincidencia log:", recognizedName);

            if (recognizedName) {
                // Busca el estudiante en la lista utilizando el nombre reconocido
                const studentId = findStudentIdByName(students, recognizedName);

                if (studentId) {
                    setRecognitionStatus("recognized"); // Si se reconoce al estudiante, se actualiza el estado
                    setRecognizedName(recognizedName); // Muestra el nombre del estudiante reconocido
                    handleAttendanceChange(studentId, 'presente'); // Cambia el estado de asistencia del estudiante
                } else {
                    console.warn('Estudiante no encontrado:', recognizedName);
                    setRecognitionStatus("not_recognized"); // Si no se encuentra el estudiante en la lista
                }
            } else {
                setRecognitionStatus("not_recognized"); // Si no hay coincidencia
            }
        } catch (error) {
            console.error('Error en el reconocimiento facial:', error);
            setRecognitionStatus("error"); // Si ocurre un error durante la petición
        } finally {
            setIsLoading(false); // Detiene el spinner de carga
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


    // Función para encontrar el ID del estudiante a partir del nombre
    const findStudentIdByName = (students, fullName) => {
        if (!Array.isArray(students)) {
            console.error('Error: la lista de estudiantes no es válida', students);
            return null;
        }

        // Normaliza los nombres para la comparación (quita espacios y hace todo minúscula)
        const normalizeString = str => str.trim().toLowerCase();

        const normalizedFullName = normalizeString(fullName);

        // Construye el nombre completo de cada estudiante y lo normaliza para comparar
        const student = students.find(student => {
            const studentFullName = `${student.estudiante.nombre} ${student.estudiante.apellido}`;
            console.log(studentFullName);
            return normalizeString(studentFullName) === normalizedFullName;
        });

        return student ? student.estudiante._id : null; // Retorna el ID si lo encuentra, o null si no
    };

    useEffect(() => {
        console.log("UseEffect capturing", isCapturing);
        if (!isCapturing) {
            return; // No hace nada si isCapturing es falso
        }

        captureImage(); // Llama al primer reconocimiento inmediatamente
    }, [isCapturing]); // Escucha cambios en isCapturing

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
                    <Button variant="outline-dark" onClick={() => handleOpenModal()}>Registrar Asistencia</Button>

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
                                <button disabled={isLoading} className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body d-flex justify-content-center align-items-center flex-column">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    style={{
                                        width: '100%',
                                        maxWidth: '1200px',
                                        height: 'auto',
                                        border: '2px solid #007bff',
                                        borderRadius: '8px',
                                    }}
                                ></video>

                                {/* Contenido según el estado */}
                                {isLoading ? (
                                    <div className="spinner-container">
                                        <p>Verificando rostro, por favor espere...</p>
                                        <div className="spinner"></div> {/* Spinner visual */}
                                    </div>
                                ) : !isCapturing ? ( // Mostrar mensaje "Detenido" si no está capturando
                                    <p>Detenido</p>
                                ) : recognitionStatus === "recognized" ? (
                                    <div style={{ color: "green", textAlign: "center" }}>
                                        <p>¡Rostro reconocido con éxito!</p>
                                        <p><strong>{recognizedName}</strong></p>
                                        <p>Estado: Presente</p>
                                    </div>
                                ) : recognitionStatus === "not_recognized" ? (
                                    <div style={{ color: "red", textAlign: "center" }}>
                                        <p>No se pudo reconocer el rostro.</p>
                                    </div>
                                ) : recognitionStatus === "error" ? (
                                    <div style={{ color: "red", textAlign: "center" }}>
                                        <p>Rostro no reconocido</p>
                                    </div>
                                ) : (
                                    <p>Esperando rostro...</p>
                                )}

                            </div>

                            <div className="modal-footer">
                                {!isCapturing ? (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleStartCapture()} // Inicia la captura automática
                                    >
                                        Comenzar Reconocimiento Facial
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleStopCapture()} // Detener la captura automática
                                    >
                                        Detener
                                    </button>
                                )}

                                <button disabled={isLoading} className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Container>
    );
};



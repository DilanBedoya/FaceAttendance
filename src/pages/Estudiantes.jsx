
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
//manejar estado del usuario
import userAuth from '../context/AuthProvider';

export default function Estudiantes() {



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

    // Función para listar estudiantes del curso seleccionado
    const listarEstudiantes = async (curso) => {
        try {

            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/visualizar/estudiantes`;
            const data = {
                
                "materia": curso.materia,
                "paralelo": curso.paralelo,
                "semestre": curso.semestre
            };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };

            // Hacer la petición POST al backend para obtener los estudiantes
            const response = await axios.post(url, data, { headers });
            setStudents(response.data); // Guardar los estudiantes en el estado
            console.log(response.data);

        } catch (error) {
            console.log(error);
            setStudents([])
        }
    };

    // Manejar la selección del curso en el Dropdown
    const handleSelectSubject = (cursoId) => {
        const cursoSeleccionado = cursos.find(curso => curso._id === cursoId);
        setSelectedCourse(cursoSeleccionado);
        listarEstudiantes(cursoSeleccionado); // Listar los estudiantes del curso seleccionado
    };

    useEffect(() => {
        listarCursos();
    }, []);


    //Función para eliminar estudiante
    const eliminarEstudiante = async (id) => {

        // Mostrar el cuadro de confirmación
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar',
        });

        //si el docente confirma la eliminacion
        if (isConfirmed) {
            try {
                const token = localStorage.getItem("token")
                //url del endpoint para el crear curso
                const url = `${import.meta.env.VITE_URL_BACKEND}/docente/eliminar/estudiante/${id}`
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

                // Hacer la petición POST al backend con token
                const response = await axios.delete(url, { headers });


                //mostrar alerta correcta
                Swal.fire({
                    icon: 'success',
                    title: 'Estudiante eliminado!',
                    text: response.data.msg,
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'black'
                });
                console.log(response.data);
                // Actualizar la lista de estudiantes
                listarEstudiantes(selectedCourse);

            } catch (error) {
                console.log(error);
            }
        }

    }


    //Función para visualizar curso independiente

    const visualizarEstudiante = async (id) => {
        try {
            const token = localStorage.getItem("token")
            //url del endpoint para el visualizar el curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/visualizar/estudiante/${id}`
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.get(url, { headers });
            console.log(response.data);

            handleShowUpdate()
            resetUpdate(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    //Funcion para actualizar estudiante
    // Formulario de Actualizar
    const {
        register: registerUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate
    } = useForm();


    const [showUpdate, setShowUpdate] = useState(false);

    const handleShowUpdate = () => {
        setShowUpdate(true);
    };
    const handleCloseUpdate = () => setShowUpdate(false);
    const actualizarEstudiante = async (data) => {
        try {
            const token = localStorage.getItem("token")
            //url del endpoint para actualizar el curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/docente/actualizar/estudiante/${data._id}`
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.put(url, data, { headers });
            console.log(response.data);

            //mostrar alerta correcta
            Swal.fire({
                icon: 'success',
                title: 'Estudiante Actualizado!',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });

            //Cerrar el modal
            handleCloseUpdate()

            //actualizar tabla en tiempo real
            listarEstudiantes(selectedCourse);


        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    }

    //Funcionalidad para filtrar
    const [filter, setFilter] = useState(''); // Estado para el filtro de nombre
    // Filtra los estudiantes por el nombre ingresado
    const filteredStudents = students.filter(estudiante =>
        estudiante.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        estudiante.apellido.toLowerCase().includes(filter.toLowerCase())
    );


    return (
        <Container>



            <div>
                <h1 style={{ textAlign: 'center' }}>Gestionar Estudiantes</h1>
            </div>

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'justify', lineHeight: '1.6' }}>
                Este módulo está diseñado para facilitar la administración de los estudiantes dentro del
                sistema, desde aquí, podrá visualizar, editar y eliminar los registros de los
                estudiantes de manera sencilla y eficiente.

            </h6>

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

                {/* Tabla con la información de los estudiantes */}
                <div>
                    {/* Input para filtrar por nombre */}
                    <Form.Group controlId="filterName" style={{ textAlign: 'left' }}>

                        <Form.Control
                            type="text"
                            placeholder="Filtrar por nombre o apellido"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)} // Actualiza el valor del filtro
                        />
                    </Form.Group>


                    <Table striped bordered hover responsive="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cédula</th>
                                <th>Dirección</th>
                                <th>Correo Electrónico</th>
                                <th>Ciudad</th>
                                <th>Teléfono</th>
                                <th style={{ textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourse ? (
                                filteredStudents.length > 0 ? (
                                    filteredStudents.map((estudiante, index) => (
                                        <tr key={estudiante._id}>
                                            <td>{index + 1}</td>
                                            <td>{estudiante.nombre}</td>
                                            <td>{estudiante.apellido}</td>
                                            <td>{estudiante.cedula}</td>
                                            <td>{estudiante.direccion}</td>
                                            <td>{estudiante.email}</td>
                                            <td>{estudiante.ciudad}</td>
                                            <td>{estudiante.telefono}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    variant="link"
                                                    onClick={() => visualizarEstudiante(estudiante._id)}
                                                    style={{ padding: 0, color: 'inherit', marginRight: '10px' }}
                                                >
                                                    <GrUpdate />
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    onClick={() => eliminarEstudiante(estudiante._id)}
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
            {/* Modal para actualizar estudiante */}
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Estudiante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpdate(actualizarEstudiante)}>
                        <Form.Group controlId="formStudentName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el nombre del estudiante" className={errorsUpdate.nombre ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('nombre', {
                                    required: {
                                        value: true,
                                        message: "Nombre es requerido"
                                    },

                                })}
                            />
                        </Form.Group>
                        {errorsUpdate.nombre && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.nombre.message}</span>}

                        <Form.Group controlId="formStudentLastname">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el apellido del estudiante" className={errorsUpdate.apellido ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('apellido', {
                                    required: {
                                        value: true,
                                        message: "Apellido es requerido"
                                    },


                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.apellido && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.apellido.message}</span>}

                        <Form.Group controlId="formStudentCi">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la cédula del estudiante" className={errorsUpdate.cedula ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('cedula', {
                                    required: {
                                        value: true,
                                        message: "Cédula es requerido"
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,  // Expresión regular que asegura que solo se ingresen números
                                        message: "La cédula debe contener solo números"
                                    }

                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.cedula && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.cedula.message}</span>}

                        <Form.Group controlId="formStudentDirection">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la dirección del estudiante" className={errorsUpdate.direccion ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('direccion', {
                                    required: {
                                        value: true,
                                        message: "Dirección es requerido"
                                    },


                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.direccion && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.direccion.message}</span>}

                        <Form.Group controlId="formStudentCity">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese la ciudad del estudiante" className={errorsUpdate.ciudad ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('ciudad', {
                                    required: {
                                        value: true,
                                        message: "Ciudad es requerido"
                                    },


                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.ciudad && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.ciudad.message}</span>}

                        <Form.Group controlId="formStudentPhone">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el teléfono del estudiante" className={errorsUpdate.telefono ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('telefono', {
                                    required: {
                                        value: true,
                                        message: "Teléfono es requerido"
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,  // Expresión regular que asegura que solo se ingresen números
                                        message: "El teléfono debe contener solo números"
                                    }

                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.telefono && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.telefono.message}</span>}



                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseUpdate}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type='submit'>
                                Actualizar
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>

        </Container>
    );
};



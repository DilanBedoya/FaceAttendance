import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
//manejar estado del usuario
import userAuth from '../context/AuthProvider';
export default function Cursos() {

    // Formulario de Crear
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: errorsCreate },
        reset: resetCreate
    } = useForm();

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    };
    const handleClose = () => setShow(false);


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


    const materiasPorSemestre = {
        "Segundo": [
            { nombre: 'Programación' },
            { nombre: 'Algoritmos Y Estructuras De Datos' },
            { nombre: 'Arquitectura De Computadores' },
            { nombre: 'Redes De Computadores' },
            { nombre: 'Sistemas Operativos' },
        ],
        "Tercero": [
            { nombre: 'Programación Orientada A Objetos' },
            { nombre: 'Diseño De Interfaces' },
            { nombre: 'Gestión De Proyectos De Software' },
            { nombre: 'Base De Datos' },
            { nombre: 'Análisis De Datos' },
        ],
        "Cuarto": [
            { nombre: 'Desarrollo De Aplicaciones Web' },
            { nombre: 'Desarrollo De IoT' },
            { nombre: 'Fundamentos De Inteligencia Artificial' },
            { nombre: 'Metodología De Investigación' },
        ],
        "Quinto": [
            { nombre: 'Desarrollo De Aplicaciones Móviles' },
            { nombre: 'Aplicaciones Distribuidas' },
            { nombre: 'Tecnologías De Seguridad' },
        ],
    };

    const [semestreSeleccionado, setSemestreSeleccionado] = useState('Seleccione el ciclo académico');


    const crearCurso = async (data) => {
        try {
            const token = localStorage.getItem("token")
            //url del endpoint para el crear curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/curso/registro`
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.post(url, data, { headers });

            //mostrar alerta correcta
            Swal.fire({
                icon: 'success',
                title: 'Curso creado!',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
            // Manejar la respuesta
           
            //limpiar form
            resetCreate();
            //cerrar el modal
            handleClose();
            //Actualizar tabla en tiempo real
            await listarCursos()
        } catch (error) {
            // Manejar errores
            console.error('Error en la petición:', error);
            //mostrar alerta incorrecta
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });
        }
    };

    const [cursos, setCursos] = useState([]); // Estado para almacenar los cursos

    const user = userAuth((state) => state.user);

    const listarCursos = async () => {
        try {


            const token = localStorage.getItem("token")
            //url del endpoint para el crear curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/curso/visualizar`
            const data = {
                "docenteId": user.id
            }
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.post(url, data, { headers });
            setCursos(response.data); // Guardar los cursos en el estado
           

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        listarCursos();

    }, []);

    //Función para eliminar cursos
    const eliminarCurso = async (id) => {

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
                const url = `${import.meta.env.VITE_URL_BACKEND}/curso/eliminar/${id}`
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

                // Hacer la petición POST al backend con token
                const response = await axios.delete(url, { headers });


                //mostrar alerta correcta
                Swal.fire({
                    icon: 'success',
                    title: 'Curso eliminado!',
                    text: response.data.msg,
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'black'
                });
                // Actualizar la lista de cursos en estado local
                setCursos((prevCursos) => prevCursos.filter(curso => curso._id !== id));


            } catch (error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.msg,
                    confirmButtonText: 'OK',
                    confirmButtonColor: 'black'
                });

                console.log(error);
            }
        }

    }


    //Función para visualizar curso independiente

    const visualizarCurso = async (id) => {
        try {
            const token = localStorage.getItem("token")
            //url del endpoint para el visualizar el curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/curso/visualizar/${id}`
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.get(url, { headers });

            handleShowUpdate()
            resetUpdate(response.data)

        } catch (error) {
            console.log(error);
        }
    }

    //Funcion para actualizar curso
    const actualizarCurso = async (data) => {
        try {
            const token = localStorage.getItem("token")
            //url del endpoint para actualizar el curso
            const url = `${import.meta.env.VITE_URL_BACKEND}/curso/actualizar/${data._id}`
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            // Hacer la petición POST al backend con token
            const response = await axios.put(url, data, { headers });

            //mostrar alerta correcta
            Swal.fire({
                icon: 'success',
                title: 'Curso Actualizado!',
                text: response.data.msg,
                confirmButtonText: 'OK',
                confirmButtonColor: 'black'
            });

            //Cerrar el modal
            handleCloseUpdate()

            //actualizar tabla en tiempo real
            listarCursos()


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
    const filteredCourses = cursos.filter(curso =>
        curso.materia.toLowerCase().includes(filter.toLowerCase())

    );

    return (
        <>
            <div>
                <h1 style={{ textAlign: 'center' }}>Gestionar Cursos</h1>
            </div>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'left', lineHeight: '1.6' }}>
                Este módulo te permite visualizar, agregar, actualizar y eliminar los cursos disponibles.

            </h6>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <Container className="mt-2">
                <Button variant="dark" className='mb-4' onClick={handleShow}>
                    Crear
                </Button>
                <div>
                    {/* Input para filtrar por materia */}
                    <Form.Group controlId="filterCourse">
                        <Form.Control
                            type="text"
                            placeholder="Filtrar por nombre de la materia"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </Form.Group>

                    {/* Tabla con la información de los cursos */}
                    <Table striped bordered hover responsive="sm" style={{ textAlign: 'center' }}>
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Materia</th>
                                <th>Código</th>
                                <th>Paralelo</th>
                                <th>Semestre</th>
                                <th style={{ textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((curso, index) => (
                                    <tr key={curso.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{curso.materia}</td>
                                        <td>{curso.codigo}</td>
                                        <td>{curso.paralelo}</td>
                                        <td>{curso.semestre}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <Button
                                                variant="link"
                                                title="Actualizar curso"
                                                onClick={() => visualizarCurso(curso._id)}
                                                style={{ padding: 0, color: 'inherit', marginRight: '10px' }}
                                            >
                                                <GrUpdate />
                                            </Button>
                                            <Button
                                                variant="link"
                                                onClick={() => eliminarCurso(curso._id)}
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
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron cursos</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>

            {/* Modal para crear curso */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitCreate(crearCurso)}>
                        <Form.Group controlId="formSemestre">
                            <Form.Label>Materia</Form.Label>
                            <Form.Select
                                as="select"
                                value={semestreSeleccionado}
                                onChange={(e) => setSemestreSeleccionado(e.target.value)}>

                                <option value="">Seleccione el ciclo académico</option>
                                {Object.keys(materiasPorSemestre).map((semestre, index) => (
                                    <option key={index} value={semestre}>
                                        {semestre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="formCourseName">
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {(
                                    materiasPorSemestre[semestreSeleccionado]?.map((materia, index) => (
                                        <Form.Check
                                            key={index}
                                            type="radio"
                                            label={materia.nombre}
                                            value={materia.nombre}
                                            name="materia"
                                            {...registerCreate('materia', {
                                                required: {
                                                    value: true,
                                                    message: "Selecciona una materia"
                                                },
                                            })}
                                        />
                                    ))
                                )}
                            </div>
                        </Form.Group>


                        {errorsCreate.materia && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsCreate.materia.message}</span>}

                        <Form.Group controlId="formCourseCode">
                            <Form.Label>Código</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese el código del curso" className={errorsCreate.codigo ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerCreate('codigo', {
                                    required: {
                                        value: true,
                                        message: "Código es requerido"
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "El código debe estar en un rango entre 4 y 6 digitos"
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: "El código debe estar en un rango entre 4 y 6 digitos"
                                    }

                                })}

                            />
                        </Form.Group>
                        {errorsCreate.codigo && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsCreate.codigo.message}</span>}

                        <Form.Group controlId="formCourseParalelo">
                            <Form.Label>Paralelo</Form.Label>
                            <Form.Select className={errorsCreate.paralelo ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerCreate('paralelo', {
                                    required: {
                                        value: true,
                                        message: "Paralelo es requerido"
                                    },
                                })}>
                                <option value="">Seleccione el paralelo</option>
                                <option value="GR1">GR1</option>
                                <option value="GR2">GR2</option>
                                <option value="GR3">GR3</option>
                                <option value="GR4">GR4</option>
                                <option value="GR5">GR5</option>
                                <option value="GR6">GR6</option>
                                <option value="GR7">GR7</option>
                                <option value="GR8">GR8</option>
                            </Form.Select>
                        </Form.Group>
                        {errorsCreate.paralelo && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsCreate.paralelo.message}</span>}

                        <Form.Group controlId="formSelect">
                            <Form.Label>Semestre</Form.Label>
                            <Form.Select className={errorsCreate.semestre ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerCreate('semestre', {
                                    required: {
                                        value: true,
                                        message: "Semestre es requerido"
                                    },
                                })}>
                                <option value="">Seleccione el semestre</option>
                                <option value="2024-B">2024-B</option>
                                <option value="2025-A">2025-A</option>
                                <option value="2025-B">2025-B</option>
                                <option value="2026-A">2026-A</option>
                                <option value="2026-B">2026-B</option>
                            </Form.Select>
                        </Form.Group>
                        {errorsCreate.semestre && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsCreate.semestre.message}</span>}

                        <Modal.Footer>
                            <Button variant="primary" type='submit' disabled={semestreSeleccionado == "Seleccione el ciclo académico" || semestreSeleccionado == ''} >
                                Guardar
                            </Button>
                            <Button variant="secondary" onClick={handleClose} >
                                Cancelar
                            </Button>

                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>

            {/* Modal para actualizar curso */}
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Curso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpdate(actualizarCurso)}>
                        <Form.Group controlId="formCourseName">
                            <Form.Label>Materia</Form.Label>
                            <Form.Control disabled type="text" placeholder="Ingrese el nombre de la materia" className={errorsUpdate.materia ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('materia', {
                                    required: {
                                        value: true,
                                        message: "Materia es requerido"
                                    },

                                })}
                            />
                        </Form.Group>
                        {errorsUpdate.materia && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.materia.message}</span>}

                        <Form.Group controlId="formCourseCode">
                            <Form.Label>Código</Form.Label>
                            <Form.Control type="text" disabled placeholder="Ingrese el código del curso" className={errorsUpdate.codigo ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('codigo', {
                                    required: {
                                        value: true,
                                        message: "Código es requerido"
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "El código debe estar en un rango entre 4 y 6 digitos"
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: "El código debe estar en un rango entre 4 y 6 digitos"
                                    }

                                })}

                            />
                        </Form.Group>
                        {errorsUpdate.codigo && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.codigo.message}</span>}

                        <Form.Group controlId="formCourseParalelo">
                            <Form.Label>Paralelo</Form.Label>
                            <Form.Select className={errorsUpdate.paralelo ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('paralelo', {
                                    required: {
                                        value: true,
                                        message: "Paralelo es requerido"
                                    },
                                })}>
                                <option value="">Seleccione el paralelo</option>
                                <option value="GR1">GR1</option>
                                <option value="GR2">GR2</option>
                                <option value="GR3">GR3</option>
                                <option value="GR4">GR4</option>
                                <option value="GR5">GR5</option>
                                <option value="GR6">GR6</option>
                                <option value="GR7">GR7</option>
                                <option value="GR8">GR8</option>
                            </Form.Select>
                        </Form.Group>
                        {errorsUpdate.paralelo && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.paralelo.message}</span>}

                        <Form.Group controlId="formSelect">
                            <Form.Label>Semestre</Form.Label>
                            <Form.Select className={errorsUpdate.semestre ? 'is-invalid mb-1' : 'mb-1'}
                                {...registerUpdate('semestre', {
                                    required: {
                                        value: true,
                                        message: "Semestre es requerido"
                                    },
                                })}>
                                <option value="">Seleccione el semestre</option>
                                <option value="2024-B">2024-B</option>
                                <option value="2025-A">2025-A</option>
                                <option value="2025-B">2025-B</option>
                                <option value="2026-A">2026-A</option>
                                <option value="2026-B">2026-B</option>
                            </Form.Select>
                        </Form.Group>
                        {errorsUpdate.semestre && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorsUpdate.semestre.message}</span>}

                        <Modal.Footer>
                            <Button variant="primary" type='submit'>
                                Actualizar
                            </Button>
                            <Button variant="secondary" onClick={handleCloseUpdate}>
                                Cancelar
                            </Button>

                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>

        </>
    );
}

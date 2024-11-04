import { create } from 'zustand';
import axios from 'axios';
import Swal from 'sweetalert2';

const actualizarPerfil = async (datos) => {
    const token = localStorage.getItem('token')
    try {
        const url = `${import.meta.env.VITE_URL_BACKEND}/docente/modificar-perfil/${datos.id}`
        const options = {
            headers: {
                method: 'PUT',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }
        const response = await axios.put(url, datos, options)
        //mostrar alerta correcta
        Swal.fire({
            icon: 'success',
            title: 'Se actualizó el perfil',
            text: response.data.msg,
            confirmButtonText: 'OK',
            confirmButtonColor: 'black'
        });
        // Manejar la respuesta
        console.log('Respuesta exitosa:', response.data);
        console.log(datos);

        return response.data
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
}

const userAuth = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Estado inicial del usuario (cargado desde localStorage)
    isAuthenticated: !!localStorage.getItem('user'), // Autenticado si hay un usuario en localStorage
    login: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
        set({ user: userData, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('user'); // Eliminar de localStorage
        set({ user: null, isAuthenticated: false });
    },
    updateProfile: async (datos) => {
        try {
            await actualizarPerfil(datos);
            set((prevState) => {
                const updatedUser = { ...prevState.user, ...datos };
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Actualizar en localStorage
                return { user: updatedUser };
            });
        } catch (error) {
            console.error('Error al actualizar el perfil en el Auth:', error);
        }
    },
}));




export default userAuth;

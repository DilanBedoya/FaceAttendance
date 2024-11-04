
import { Navigate } from 'react-router-dom';

const AuthValidate = () => {
    const autenticado = localStorage.getItem('token')
    return (
        <main>
            {autenticado ? <Navigate to='/dashboard' /> : <Navigate to='/' />}
        </main>
    )
}

export default AuthValidate
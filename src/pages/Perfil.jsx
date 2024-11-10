
import React from 'react';
import CardProfile from '../components/cardProfile';


export default function Perfil() {

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Perfil del Docente</h1>
            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'justify', lineHeight: '1.6' }}>
                ¡Bienvenido! Aquí podrás actualizar la información de tu perfil docente,
                asegúrate de que todos los campos estén completos y actualizados para que tu información esté siempre
                correctamente registrada y sea fácil de gestionar. 
                
            </h6>
            <CardProfile />
        </div>
    );
};



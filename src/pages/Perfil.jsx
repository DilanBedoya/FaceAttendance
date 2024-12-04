
import React from 'react';
import CardProfile from '../components/CardProfile';


export default function Perfil() {

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Perfil del Docente</h1>
            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <h6 style={{ fontSize: '1.1rem', color: '#495057', textAlign: 'left', lineHeight: '1.6' }}>
                ¡Bienvenido! Este módulo te permite actualizar la información personal.
            </h6>

            <hr style={{ border: 'none', borderTop: '4px solid #aaa', margin: '20px 0', width: '100%', borderRadius: '8px', opacity: 0.5 }} />

            <CardProfile />
        </div>
    );
};



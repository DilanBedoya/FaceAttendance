
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import RecoverPassword from "../pages/RecoverPassword";


describe('Recuperar contraseña test', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/recover-password']}>
                <Routes>
                    <Route path="/recover-password" element={<RecoverPassword />} />
                </Routes>
            </MemoryRouter>
        );
    })
    test('Renderizar formulario de recuperacion de contraseña', () => {
        screen.debug()
        const txt = screen.getByText(/Tienes problemas para ingresar/i);
        const emailInput = screen.getByPlaceholderText(/Correo Electrónico/i);
        expect(txt).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
    })

    test('Manejo correcto de errores al envíar un correo no institucional', async () => {
        const emailInput = screen.getByPlaceholderText(/Correo Electrónico/i);
        const sendButton = screen.getByRole('button', { name: /Envíar enlace de acceso/i });
        await userEvent.type(emailInput, 'dilan@hotmail.com')
        await userEvent.click(sendButton)
        await waitFor(() => {
            const errorMessage = screen.getByText(/El correo debe ser institucional - @epn.edu.ec/i);
            expect(errorMessage).toBeInTheDocument();
        });

    })

    test('Envío de formulario correcto', async () => {
        const emailInput = screen.getByPlaceholderText(/Correo Electrónico/i);
        const sendButton = screen.getByRole('button', { name: /Envíar enlace de acceso/i });
        
        await userEvent.type(emailInput, 'example@epn.edu.ec')
        await userEvent.click(sendButton)

         // Esperar a que el mensaje de registro exitoso aparezca
         await waitFor(() => {
            const message = screen.getByText(/Correo Enviado/i);
            expect(message).toBeInTheDocument();
        });
    })

})
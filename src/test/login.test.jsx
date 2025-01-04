import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Login from '../pages/Login';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import Perfil from "../pages/Perfil";


describe('Login test', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard/*" element={<Perfil />} />
                </Routes>
            </MemoryRouter>
        );
    });

    test('Renderizar elementos clave', () => {
        const txtLogin = screen.getByText(/Bienvenido/i);
        expect(txtLogin).toBeInTheDocument();
    });

    test("Mostrar errores cuando se ingresa datos incorrectos", async () => {
        const mailInput = screen.getByLabelText(/Correo Electrónico/i);
        const buttons = screen.getAllByRole('button', { name: /Iniciar Sesión/i });
        const buttonLogin = buttons[1];
        await userEvent.click(mailInput);
        await userEvent.click(buttonLogin);

        await waitFor(() => {
            const errorMessage = screen.getByText(/Email es requerido/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('Inicio de sesión exitoso', async () => {
        const mailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const buttons = screen.getAllByRole('button', { name: /Iniciar Sesión/i });
        const buttonLogin = buttons[1];

        await userEvent.type(mailInput, "example@epn.edu.ec");
        await userEvent.type(passwordInput, "dilan123");
        await userEvent.click(buttonLogin);

        const message = await screen.findByText(/Inicio de Sesión Correcto/i);
        expect(message).toBeInTheDocument();

        const buttonOk = await screen.findByRole('button', { name: /OK/i });
        await userEvent.click(buttonOk);

        const dashboardText = await screen.findByText(/Perfil del Docente/i);
        expect(dashboardText).toBeInTheDocument();

    });
});

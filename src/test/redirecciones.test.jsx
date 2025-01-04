import { describe, test, expect, beforeEach, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Login from '../pages/Login';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import Dashboard from "../layout/Dashboard";

beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener: () => { },
            removeListener: () => { },
        };
    };
});

describe('Visualizar dashboard test', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </MemoryRouter>
        );
    });

    test('Redirección al dashboard luego de iniciar sesión', async () => {
        // Simular ingreso de correo y contraseña
        const mailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const buttons = screen.getAllByRole('button', { name: /Iniciar Sesión/i });
        const buttonLogin = buttons[1];

        // Ingresar datos y hacer clic en iniciar sesión
        await userEvent.type(mailInput, "example@epn.edu.ec");
        await userEvent.type(passwordInput, "dilan123");
        await userEvent.click(buttonLogin);

        const message = await screen.findByText(/Inicio de Sesión Correcto/i);
        expect(message).toBeInTheDocument();

        const buttonOk = await screen.findByRole('button', { name: /OK/i });
        await userEvent.click(buttonOk);

        screen.debug()
        // Verificar titulo del dashboard
        await waitFor(() => {
            const messange = screen.findByText(/FaceAttendance/i)
            expect(messange).toBeDefined()
        });

    });

});

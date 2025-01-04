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

describe('Cerrar sesión test', () => {
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

    test('Token almacenado cuando se inicia sesión', async () => {
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
        // Verificar si el token está presente en localStorage y luego eliminarlo para el siguiente test
        await waitFor(() => {
            const token = localStorage.getItem("token");
            expect(token).toBeTruthy();
            localStorage.clear();
        });

    });

    test('Token eliminado luego de cerrar sesión', async () => {
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

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </MemoryRouter>
        );
        const logoutButtons = screen.getAllByText(/Salir/i);
        const logoutButton = logoutButtons[1]; 
        expect(logoutButton).toBeInTheDocument();

        await userEvent.click(logoutButton);

        await waitFor(() => {
            const token = localStorage.getItem("token");
            expect(token).toBeNull();
        });


    });
});

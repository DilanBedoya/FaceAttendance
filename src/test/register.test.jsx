
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Register from '../pages/Register';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from '@testing-library/user-event';



vi.mock("../components/Navbar", () => ({
    default: () => <div data-testid="mock-navbar"></div>
}));

describe("Registro test", () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/Register']}>
                <Routes>
                    <Route path="/Register" element={<Register />} />
                </Routes>
            </MemoryRouter>
        );
    })
    test("Renderizar página de registro", () => {
        expect(screen.getByText("Registrate")).toBeDefined();
    })

    test("Mostrar errores cuando se ingresa datos incorrectos", async () => {

        const nameInput = screen.getByLabelText(/nombre/i);
        const buttons = screen.getAllByRole('button', { name: /Registrarse/i });
        const button = buttons[0];
        await userEvent.click(nameInput);
        await userEvent.click(button);

        await waitFor(() => {
            const errorMessage = screen.getByText(/nombre es requerido/i);
            expect(errorMessage).toBeInTheDocument();
        })
    });

    test("Registro exitoso del docente", async () => {
        const nombreInput = screen.getByLabelText(/nombre/i);
        const apellidoInput = screen.getByLabelText(/apellido/i);
        const ciudadInput = screen.getByLabelText(/ciudad/i);
        const direccionInput = screen.getByLabelText(/Dirección/i);
        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        await userEvent.type(nombreInput, 'Dilan');
        await userEvent.type(apellidoInput, 'Bedoya');
        await userEvent.type(ciudadInput, 'Quito');
        await userEvent.type(direccionInput, 'Floresta');
        await userEvent.type(emailInput, 'example@epn.edu.ec');
        await userEvent.type(passwordInput, 'dilan123');

        const buttons = screen.getAllByRole('button', { name: /Registrarse/i });
        const button = buttons[0];
        await userEvent.click(button)

        // Esperar a que el mensaje de registro exitoso aparezca
        await waitFor(() => {
            const message = screen.getByText(/¡Registro correcto!/i);
            expect(message).toBeInTheDocument();
        });

    })

})
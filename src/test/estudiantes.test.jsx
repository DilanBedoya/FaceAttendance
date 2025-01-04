import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";
import Estudiantes from "../pages/Estudiantes";

describe("Estudiante test", () => {
    // Limpia el DOM después de cada test
    afterEach(() => {
        localStorage.clear();
        cleanup();
    });

    beforeEach(async () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard/*" element={<Estudiantes />} />
                </Routes>
            </MemoryRouter>
        );

        // Realizar el inicio de sesión
        const mailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const buttons = screen.getAllByRole("button", { name: /Iniciar Sesión/i });
        const buttonLogin = buttons[1];

        await userEvent.type(mailInput, "example@epn.edu.ec");
        await userEvent.type(passwordInput, "dilan123");
        await userEvent.click(buttonLogin);

        // Verificar el mensaje de inicio de sesión
        const message = await screen.findByText(/Inicio de Sesión Correcto/i);
        expect(message).toBeInTheDocument();

        // Hacer clic en "OK" para continuar al Dashboard
        const buttonOk = await screen.findByRole("button", { name: /OK/i });
        await userEvent.click(buttonOk);

    });

    test("Mostrar título de la página", () => {
        expect(screen.getByText(/Gestionar Estudiantes/i)).toBeDefined();
    });

    test("Actualización de estudiante exitoso", async () => {

        const selectCourse = screen.getByRole('button', { name: /Opciones/i });
        await userEvent.click(selectCourse);
        // Pausa para permitir que las opciones se rendericen
        await new Promise(resolve => setTimeout(resolve, 500));
        screen.debug()
        const optionSelected = screen.getByRole('button', { name: /Programación - GR1/i })
        await userEvent.click(optionSelected);

        await new Promise(resolve => setTimeout(resolve, 500));
        const updateButton = screen.getByTitle('Actualizar estudiante');
        await userEvent.click(updateButton);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        const nameInput = screen.getByLabelText('Nombre');
        await userEvent.clear(nameInput)
        await userEvent.type(nameInput, "Alejandro Augusto")
        const buttonUpdate = screen.getByRole('button', { name: 'Actualizar' });
        await userEvent.click(buttonUpdate);

        await waitFor(() => {
            const message = screen.getByText(/Estudiante Actualizado!/i);
            expect(message).toBeInTheDocument();
        });
    });

});

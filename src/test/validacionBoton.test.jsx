import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";
import Cursos from "../pages/Cursos";

describe("Botón deshabilitado en crear cursos test", () => {
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
                    <Route path="/dashboard/*" element={<Cursos />} />
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

    test("Mostrar título de la página cursos", () => {
        expect(screen.getByText(/Gestionar Cursos/i)).toBeDefined();
    });

    test("Botón de crear curso deshabilitado con datos incompletos", async () => {
        const buttonCreate = await screen.findByRole("button", { name: /Crear/i });
        await userEvent.click(buttonCreate);

        const buttonSave = await screen.findByRole("button", { name: /Guardar/i });
        expect(buttonSave).toBeDisabled();
    });

});

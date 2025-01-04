import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import Perfil from "../pages/Perfil";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";

describe("Perfil test", () => {
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
                    <Route path="/dashboard/*" element={<Perfil />} />
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

        // Esperar a que se cargue el componente del Dashboard
        await waitFor(() => {
            expect(screen.getByText(/Perfil del Docente/i)).toBeInTheDocument();
        });
    });

    test("Renderizar elementos clave", () => {
        expect(screen.getByText(/Perfil del Docente/i)).toBeDefined();
    });

    test("Mostrar errores cuando se ingresa datos incorrectos", async () => {
        const nombreInput = screen.getByLabelText(/nombre/i);
        const buttonUpdate = screen.getByRole("button", { name: /Actualizar/i });

        await userEvent.type(nombreInput, "1");
        await userEvent.click(buttonUpdate);

        await waitFor(() => {
            const message = screen.getByText(/Solo se permiten letras y espacios/i);
            expect(message).toBeInTheDocument();
        });
    });

    test("Actualización de perfil exitoso", async () => {
        const nombreInput = screen.getByLabelText(/nombre/i);
        const buttonUpdate = screen.getByRole("button", { name: /Actualizar/i });
        await userEvent.clear(nombreInput)
        await userEvent.type(nombreInput, "Byron");
        await userEvent.click(buttonUpdate);

        await waitFor(() => {
            const message = screen.getByText(/Perfil modificado con éxito/i);
            expect(message).toBeInTheDocument();
        });
    });
});

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";
import Reportes from "../pages/Reportes";

describe("Reporte de asistencias test", () => {
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
                    <Route path="/dashboard/*" element={<Reportes />} />
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

    test("Renderizar página de asistencias", () => {
        expect(screen.getByText(/Reporte Asistencias/i)).toBeDefined();
    });

    test("Visualizar asistencias totales durante el semestre", async () => {

        const selectCourse = screen.getByRole('button', { name: /Opciones/i });
        await userEvent.click(selectCourse);
        // Pausa para permitir que las opciones se rendericen
        await new Promise(resolve => setTimeout(resolve, 500));
        const optionSelected = screen.getByRole('button', { name: /Programación - GR1/i })
        await userEvent.click(optionSelected);

        await new Promise(resolve => setTimeout(resolve, 500));
        await waitFor(() => {
            const student = screen.getByText(/Alejandro Augusto/i);
            expect(student).toBeInTheDocument();

            const allTotals = screen.getAllByText(/Total/i); 
            const lastTotal = allTotals[allTotals.length - 1]; 
            expect(lastTotal).toBeInTheDocument();

        });
    });

    test("Validar el generar reporte de las asistencias", async () => {

        const selectCourse = screen.getByRole('button', { name: /Opciones/i });
        await userEvent.click(selectCourse);
        // Pausa para permitir que las opciones se rendericen
        await new Promise(resolve => setTimeout(resolve, 500));
        const optionSelected = screen.getByRole('button', { name: /Programación - GR1/i })
        await userEvent.click(optionSelected);

        await new Promise(resolve => setTimeout(resolve, 500));
        const btnPDF = screen.getByRole('button', { name: /Generar PDF/i })
        await userEvent.click(btnPDF);

        await waitFor(() => {
            const validation = screen.getByText(/¡Listo para crear el reporte!/i);
            expect(validation).toBeInTheDocument();

        });
    });

});

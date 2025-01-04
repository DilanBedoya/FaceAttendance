import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";


describe('Landing Page test', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </MemoryRouter>
        );
    });

    test('Renderizar titulo principal de la página', () => {
        const txtTitle = screen.getByText(/Bienvenido a FaceAttendance/i);
        expect(txtTitle).toBeInTheDocument();
    });

});

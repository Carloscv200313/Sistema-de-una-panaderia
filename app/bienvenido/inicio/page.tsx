'use client';
import { useEffect, useState } from 'react';
import { empleados } from '@/consultas/empleados';


interface Empleado {
    ID: number;
    Contrasena: string;
}

export default function Home() {
    const [empleadosList, setEmpleadosList] = useState<Empleado[]>([]); // Cambié el nombre para evitar conflicto con la función "empleados"

    useEffect(() => {
        // Llamar a la API de forma asíncrona
        const fetchEmpleados = async () => {
            const data = await empleados();
            setEmpleadosList(data);
        };

        fetchEmpleados();
    }, []);

    return (
        <div>
            <h1>Lista de Empleados</h1>

            <ul>
                {empleadosList.map((empleado) => (
                    <li key={empleado.ID}>{empleado.Contrasena}</li>  // Asegúrate de que los nombres coincidan con los datos de la API
                ))}
            </ul>
        </div>
    );
}

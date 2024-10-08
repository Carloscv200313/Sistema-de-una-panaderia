"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa 'next/navigation' para App Router
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const verificar = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log(data);
            if (!data.Mensaje) {
                // Guardar ID_empleado y ID_cargo en localStorage
                localStorage.setItem('ID_empleado', data.ID_empleado);
                localStorage.setItem('ID_cargo', data.ID_cargo);

                // Redirigir a la página de bienvenida si las credenciales son correctas
                router.push('/bienvenido');
            } else {
                // Mostrar un mensaje de error si las credenciales son incorrectas
                alert(data.Mensaje);
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            alert("Error en el servidor, por favor intente de nuevo más tarde.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Inicia sesión en tu cuenta
                        </h2>
                    </div>
                    <div className="mt-8">
                        <form className="space-y-6" onSubmit={verificar}>
                            <div>
                                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Usuario
                                </Label>
                                <div className="mt-1">
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Correo electrónico"
                                        autoComplete="username"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </Label>
                                <div className="mt-1 relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Contraseña"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Iniciar sesión
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <Image
                    className="absolute inset-0 h-full w-auto object-cover"
                    src="/img/fondo.webp"
                    alt="Imagen de la empresa"
                    width={2000}
                    height={1080}
                />
            </div>
        </div>
    )
}

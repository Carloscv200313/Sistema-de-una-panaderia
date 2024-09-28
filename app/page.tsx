"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa 'next/navigation' para App Router
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const verificar = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "hola" && password === "123456") {
            router.push('/bienvenido'); // Asegúrate de tener esta página
        } else {
            alert("Credenciales incorrectas");
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <Image
                            className="h-12 w-auto"
                            src="/img/imagen.jpeg"
                            alt="Logo de la empresa"
                            width={48}
                            height={48}
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Inicia sesión en tu cuenta</h2>
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
                                <div className="mt-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Contraseña"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
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
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/img/imagen.jpeg"
                    alt="Imagen de la empresa"
                    width={1920}
                    height={1080}
                />
            </div>
        </div>
    )
}

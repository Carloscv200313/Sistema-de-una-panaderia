"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLogout, IconPremiumRights } from '@tabler/icons-react';

export function SidebarDemo({ children }: { children: React.ReactNode }) {
    const links = [
        {
            label: "Home",
            href: "/bienvenido",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
            ),
        },
        {
            label: "Empleados",
            href: "/bienvenido/empleados",
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Ventas",
            href: "/bienvenido/ventas",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 9m0 1.105a1.105 1.105 0 0 1 1.105 -1.105h1.79a1.105 1.105 0 0 1 1.105 1.105v9.79a1.105 1.105 0 0 1 -1.105 1.105h-1.79a1.105 1.105 0 0 1 -1.105 -1.105z" />
                    <path d="M17 3m0 1.105a1.105 1.105 0 0 1 1.105 -1.105h1.79a1.105 1.105 0 0 1 1.105 1.105v15.79a1.105 1.105 0 0 1 -1.105 1.105h-1.79a1.105 1.105 0 0 1 -1.105 -1.105z" />
                    <path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                </svg>
            ),
        },
        {
            label: "Inventario",
            href: "/bienvenido/inventario",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                    <path d="M9 7l6 0" />
                    <path d="M9 11l6 0" />
                    <path d="M9 15l4 0" />
                </svg>
            ),
        },
        {
            label: "Caja",
            href: "/bienvenido/caja",
            icon: (
                <IconPremiumRights stroke={2} className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                // Cambiar entre columna y fila dependiendo del tamaño de pantalla
                "flex md:flex-row  bg-gray-900 w-full flex-1 max-w-7xl mx-auto border-spacing-0  overflow-hidden",

            )}
        >
            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Salir",
                                href: "/",
                                icon: (
                                    <IconLogout stroke={2} />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            {/* Contenido que se muestra debajo del sidebar en pantallas pequeñas */}
            <main className="p-4 w-full md:w-auto md:flex-1">
                {children}
            </main>
        </div>
    );
}


export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};
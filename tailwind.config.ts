import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],  // El modo oscuro solo se activará con la clase 'dark'
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background, 0 0% 100%))',  // Color de fondo por defecto claro
				foreground: 'hsl(var(--foreground, 0 0% 0%))',   // Texto por defecto negro
				card: {
					DEFAULT: 'hsl(var(--card, 0 0% 100%))',
					foreground: 'hsl(var(--card-foreground, 0 0% 0%))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover, 0 0% 100%))',
					foreground: 'hsl(var(--popover-foreground, 0 0% 0%))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary, 210 100% 50%))',
					foreground: 'hsl(var(--primary-foreground, 0 0% 100%))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary, 210 100% 94%))',
					foreground: 'hsl(var(--secondary-foreground, 0 0% 10%))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted, 210 50% 94%))',
					foreground: 'hsl(var(--muted-foreground, 0 0% 50%))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent, 210 100% 94%))',
					foreground: 'hsl(var(--accent-foreground, 0 0% 10%))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive, 0 84.2% 60.2%))',
					foreground: 'hsl(var(--destructive-foreground, 0 0% 100%))'
				},
				border: 'hsl(var(--border, 0 0% 80%))',
				input: 'hsl(var(--input, 0 0% 94%))',
				ring: 'hsl(var(--ring, 210 100% 50%))',
				chart: {
					'1': 'hsl(var(--chart-1, 12 76% 61%))',
					'2': 'hsl(var(--chart-2, 173 58% 39%))',
					'3': 'hsl(var(--chart-3, 197 37% 24%))',
					'4': 'hsl(var(--chart-4, 43 74% 66%))',
					'5': 'hsl(var(--chart-5, 27 87% 67%))'
				}
			},
			borderRadius: {
				lg: 'var(--radius, 0.5rem)',
				md: 'calc(var(--radius, 0.5rem) - 2px)',
				sm: 'calc(var(--radius, 0.5rem) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;

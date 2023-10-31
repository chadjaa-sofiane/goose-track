/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                accents: {
                    1: 'hsl(var(--color-accent-100) / <alpha-value>)',
                    2: 'hsl(var(--color-accent-200) / <alpha-value>)',
                    3: 'hsl(var(--color-accent-2) / <alpha-value>)',
                },
                bg: 'hsl(var(--color-bg) / <alpha-value>)',
                text: 'hsl(var(--color-text) / <alpha-value>)',
            },
            fontFamily: {
                Inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

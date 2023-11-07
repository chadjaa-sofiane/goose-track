/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                accents: {
                    1: 'hsl(var(--color-accent-1) / <alpha-value>)',
                    2: 'hsl(var(--color-accent-2) / <alpha-value>)',
                    3: 'hsl(var(--color-accent-3) / <alpha-value>)',
                    4: 'hsl(var(--color-accent-4) / <alpha-value>)',
                    5: 'hsl(var(--color-accent-5) / <alpha-value>)',
                    6: 'hsl(var(--color-accent-6) / <alpha-value>)',
                },
                bg: 'hsl(var(--color-bg) / <alpha-value>)',
                text: 'hsl(var(--color-text) / <alpha-value>)',
                error: 'hsl(var(--color-error) / <alpha-value>)',
                done: 'hsl(var(--color-done) / <alpha-value>)',
            },
            fontFamily: {
                Inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

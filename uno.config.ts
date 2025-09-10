// uno.config.ts
import { defineConfig } from 'unocss'
import colors from 'tailwindcss/colors'
import tailwindConfig from './tailwind.config'


export default defineConfig({
    // ...UnoCSS options
    theme: {
        colors: {
            veryCool: '#0000ff', // class="text-very-cool"
            brand: {
                primary: '#91271b', //class="bg-brand-primary"
                DEFAULT: '#91271b', //class="bg-brand"
            },
            primary: {
                DEFAULT: '#A9321E',
                '50': '#FDF5F4',
                '100': '#F8DBD8',
                '200': '#EEA8A0',
                '300': '#E47667',
                '400': '#DA462F',
                '500': '#A9321E',
                '600': '#8B2B19',
                '700': '#6C2213',
                '800': '#4E1A0E',
                '900': '#301008',
                '950': '#210B06',
            },
            secondary: {
                DEFAULT: '#121420',
                50: '#FDF5F4',
                100: '#F8DBD8',
                200: '#EEA8A0',
                300: '#E47667',
                400: '#DA462F',
                500: '#121420',
                600: '#8B2B19',
                700: '#6C2213',
                800: '#4E1A0E',
                900: '#301008',
                950: '#210B06',
            },
            muted: colors.slate,
            neutral: {
                100: "#FFFFFF",
                200: "#F9FAFB",
                300: "#F0F3F5",
                400: "#F0F3F5",
                500: "#698596",
                600: "#435560",
                700: "#273137",
                800: "#111618",
                900: "#0C0808",
            },
            success: {
                100: '#F7FDF9',
                200: '#EAFAF1',
                300: '#D5F6E3',
                400: '#ACECC6',
                500: '#44D580',
                600: '#1E8549',
                700: '#166437',
                800: '#0F4324',
                900: '#072112',
            },
            danger: {
                100: '#FDF7F7',
                200: '#FDF7F7',
                300: '#F6D5D5',
                400: '#ECACAC',
                500: '#D54444',
                600: '#851E1E',
                700: '#641616',
                800: '#430F0F',
                900: '#210707',
            },
            warning: {
                DEFAULT: '#FF9B2A',
                100: '#FFFDF5',
                200: '#FEFBE6',
                300: '#FEF7CD',
                400: '#FCEE9C',
                500: '#FF9B2A',
                600: '#9F8804',
                700: '#776603',
                800: '#504402',
                900: '#282201',
            },

            info: {
                DEFAULT: '#FF9B2A',
                100: '#FFFDF5',
                200: '#FEFBE6',
                300: '#FEF7CD',
                400: '#FCEE9C',
                500: '#FF9B2A',
                600: '#9F8804',
                700: '#776603',
                800: '#504402',
                900: '#282201',
            },
        },
    },
})

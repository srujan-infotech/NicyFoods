// ============================================================
//  Shared Tailwind config — include AFTER the Tailwind CDN script
// ============================================================
tailwind.config = {
    theme: {
        extend: {
            colors: {
                cream: '#FBF1E2',
                jaggery: '#5C3A25',
                ink: '#3A2417',
                turmeric: '#E8A33D',
                marigold: '#F2C14E',
                kumkum: '#A63A2E',
                herbal: '#5F7A4F',
                sidebar: '#1a110c',
                'sidebar-hover': '#2d1a10',
                'card-bg': '#FFFFFF',
                'form-bg': '#FDF8F2',
            },
            fontFamily: {
                display: ['"Rozha One"', 'serif'],
                body: ['Poppins', 'sans-serif'],
            },
        },
    },
};

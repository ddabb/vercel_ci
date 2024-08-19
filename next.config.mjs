/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/html/index.html',
            },
        ];
    },
};

export default nextConfig;
module.exports = {
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/html/index.html'

            },
        ];
    },
};
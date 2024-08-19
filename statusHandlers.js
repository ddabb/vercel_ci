const path = require('path');

const statusHandlers = new Map([
    [404, (req, res) => res.sendFile(path.join(__dirname, '..', 'public', '404.html'))],
    [500, (req, res) => res.sendFile(path.join(__dirname, '..', 'public', '500.html'))],
]);

module.exports = statusHandlers;
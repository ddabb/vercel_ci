export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ message: 'test from the API!' });
    } else {
        return res.status(405).json({ message: 'test Method not allowed' });
    }
}
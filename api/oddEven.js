export default async function handler(request, response) {
    if (typeof request.body === 'number' &&!Number.isInteger(request.body)) {
        return response.status(400).json({ error: '数据格式不正确，传入的不是整数' });
    }
    const isEven = (request.body % 2 === 0);

    response.status(200).json({ message: isEven? '偶数' : '奇数' });
}
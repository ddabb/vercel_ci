export default async function handler(request, response) {
  try {
    // 获取请求体
    const requestBody = await request.text();

    // 验证请求体是否为字符串
    if (typeof requestBody !== 'string') {
      return response.status(400).json({ error: '请求体必须是字符串' });
    }

    // 尝试将字符串转换为BigInt
    const number = BigInt(requestBody);

    // 验证转换后的数字是否为正整数
    if (isNaN(number) || number < BigInt(0n) || !number.toString().match(/^[0-9]+$/)) {
      return response.status(400).json({ error: '数据格式不正确，传入的不是正整数' });
    }

    // 检查数字是否为偶数
    const isEven = (number % BigInt(2n) === BigInt(0n));

    // 返回结果
    response.status(200).json({ message: isEven ? '偶数' : '奇数' });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ error: '服务器内部错误' });
  }
}
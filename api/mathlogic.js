const idcard = require("idcard-tool");

export default async function handler(request, response) {
  try {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        const requestBody = JSON.parse(body);
        if (!requestBody.number || !requestBody.callType) {
          return response.status(400).json({ error: '请求体必须包含 number 和 callType 字段' });
        }

        let numberStr;
        let result;
        switch (requestBody.callType) {
          case 'leapyear':
            numberStr = typeof requestBody.number === 'number' ? requestBody.number.toString() : requestBody.number;
            if (typeof numberStr !== 'string' || !/^[0-9]+$/.test(numberStr)) {
              return response.status(400).json({ error: '数据格式不正确，number 字段必须是数字字符串' });
            }
            result = (BigInt(numberStr) % BigInt(4n) === BigInt(0n)) && (BigInt(numberStr) % BigInt(100n) !== BigInt(0n) || BigInt(numberStr) % BigInt(400n) === BigInt(0n));
            break;
          case 'oddEven':
            numberStr = typeof requestBody.number === 'number' ? requestBody.number.toString() : requestBody.number;
            if (typeof numberStr !== 'string' || !/^[0-9]+$/.test(numberStr)) {
              return response.status(400).json({ error: '数据格式不正确，number 字段必须是数字字符串' });
            }
            result = (BigInt(numberStr) % BigInt(2n) === BigInt(0n));
            break;
          case 'IdCard':
            numberStr = typeof requestBody.number === 'number' ? requestBody.number.toString() : requestBody.number;
            if (typeof numberStr !== 'string' || !/^(?:[0-9]{18}|[JZ][0-9]{16}[0-9Xx])$/i.test(numberStr)) {
              return response.status(400).json({ error: '数据格式不正确，number 字段必须是有效的身份证号码字符串' });
            }
            result = idcard(numberStr.toUpperCase());
            break;
          default:
            return response.status(400).json({ error: '无效的 callType 值，有效值为 leapyear, oddEven 或 IdCard' });
        }

        let message;
        if (requestBody.callType === 'leapyear') {
          message = result ? '闰年' : '平年';
        } else if (requestBody.callType === 'oddEven') {
          message = result ? '偶数' : '奇数';
        } else if (requestBody.callType === 'IdCard') {
          message = JSON.stringify(result);
        }

        response.status(200).json({ message });
      } catch (parseError) {
        console.error("JSON 解析错误:", parseError);
        response.status(400).json({ error: '请求体格式不正确' });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ error: `服务器内部错误: ${error.message}` });
  }
}
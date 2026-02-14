// netlify/functions/analyze.js
const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { imageBase64, prompt } = JSON.parse(event.body);
    const API_KEY = process.env.ZHIPU_API_KEY;

    // 构造请求给智谱 AI (使用支持图片的模型)
    const response = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      model: "glm-4v-flash", // 这里使用视觉模型，flash版本通常更便宜或免费
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "请帮我分析这张图片中的数学题，并给出解题步骤。" },
            { type: "image_url", image_url: { url: imageBase64 } } // 智谱接收 Base64 图片
          ]
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 返回智谱的结果给前端
    return {
      statusCode: 200,
      body: JSON.stringify(response.data.choices[0].message)
    };

  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "服务器处理失败，请检查日志" })
    };
  }
};
export async function handler(event) {
  // 处理OPTIONS请求（CORS预检）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    // 调用DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: `你是SDD（Spec-Driven Development，规格驱动开发）教学助手。
你的职责：
1. 帮助学习者理解SDD核心概念和方法论
2. 解答关于规格文档编写、测试、API设计等问题
3. 对比SDD与Vibe Coding的差异
4. 提供实战案例和最佳实践建议
5. 解释并发、性能、数据模型等高级话题

回答风格：
- 清晰、准确、务实
- 使用代码示例说明
- 避免空洞理论，注重实用性
- 鼓励学习者动手实践` 
          },
          { role: "user", content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "抱歉，我暂时无法回答这个问题。";

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        reply: "抱歉，服务暂时不可用。请稍后再试。",
        error: error.message 
      })
    };
  }
}

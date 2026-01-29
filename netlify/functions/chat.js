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

    // 检测消息语言（简单检测：是否包含中文字符）
    const hasChinese = /[\u4e00-\u9fa5]/.test(message);
    const language = hasChinese ? 'zh' : 'en';

    // 根据语言设置系统提示
    const systemPrompt = language === 'zh' 
      ? `你是SDD（Spec-Driven Development，规格驱动开发）教学助手。
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
- 鼓励学习者动手实践
- 用中文回答所有问题`
      : `You are an SDD (Spec-Driven Development) teaching assistant.

Your responsibilities:
1. Help learners understand SDD core concepts and methodologies
2. Answer questions about spec documentation, testing, API design, etc.
3. Compare differences between SDD and Vibe Coding
4. Provide practical case studies and best practice recommendations
5. Explain advanced topics like concurrency, performance, data models

Response style:
- Clear, accurate, and pragmatic
- Use code examples for illustration
- Avoid empty theories, focus on practicality
- Encourage learners to practice hands-on
- Answer ALL questions in English`;

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
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 2000,  // 增加token数量
        temperature: 0.5,   // 降低temperature加快响应
        stream: false       // 确保不使用流式响应
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error: ${response.status}`, errorText);
      throw new Error(`DeepSeek API返回错误 ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    
    // 检查返回数据的有效性
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response:', data);
      throw new Error('API返回了无效的数据格式');
    }
    
    const reply = data.choices[0].message.content || 
      (language === 'zh' ? "抱歉，我暂时无法回答这个问题。" : "Sorry, I cannot answer this question at the moment.");

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ reply, language })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    
    // 从请求中尝试提取语言信息
    let language = 'zh';
    try {
      if (event.body) {
        const { message } = JSON.parse(event.body);
        const hasChinese = /[\u4e00-\u9fa5]/.test(message);
        language = hasChinese ? 'zh' : 'en';
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        reply: language === 'zh' 
          ? "抱歉，AI服务暂时不可用。可能的原因：\n1. API密钥未配置或已过期\n2. 网络连接问题\n3. DeepSeek服务暂时不可用\n\n请检查Netlify环境变量中的DEEPSEEK_API_KEY是否正确配置。" 
          : "Sorry, the AI service is temporarily unavailable. Possible reasons:\n1. API key not configured or expired\n2. Network connection issues\n3. DeepSeek service temporarily unavailable\n\nPlease check if DEEPSEEK_API_KEY is correctly configured in Netlify environment variables.",
        error: error.message,
        language
      })
    };
  }
}

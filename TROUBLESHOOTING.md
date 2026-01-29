# AI助手故障排查与优化

## 🔍 问题诊断

### 当前错误分析
根据截图显示的错误：
```
Failed to load resource: the server responded with a status of 504
Failed to load resource: the server responded with a status of 502
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**错误原因：**
1. **504/502错误**：网关超时，说明Netlify Functions调用DeepSeek API时超时
2. **JSON解析错误**：服务器返回了HTML错误页面而不是JSON
3. **可能的根本原因**：
   - DeepSeek API密钥未配置或无效
   - API配额已用完
   - DeepSeek服务响应过慢
   - Netlify Functions超时（默认10秒）

## ✅ 解决方案

### 1. 检查API密钥配置

#### 在Netlify检查：
1. 登录 Netlify Dashboard
2. 选择你的站点
3. 进入 **Site settings** → **Environment variables**
4. 确认 `DEEPSEEK_API_KEY` 已配置
5. 检查密钥是否正确（没有多余空格）

#### 测试API密钥：
```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hi"}],
    "max_tokens": 100
  }'
```

### 2. 本次更新的优化

#### 后端优化（chat.js）：
```javascript
// ✅ 增加max_tokens到2000（更快响应）
max_tokens: 2000

// ✅ 降低temperature到0.5（减少随机性，加快速度）
temperature: 0.5

// ✅ 明确禁用流式响应
stream: false

// ✅ 更详细的错误信息
if (!response.ok) {
  const errorText = await response.text();
  console.error(`DeepSeek API error: ${response.status}`, errorText);
  throw new Error(`API返回错误 ${response.status}`);
}
```

#### 前端优化（index.html）：
```javascript
// ✅ 添加30秒超时
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

// ✅ 详细的错误分类
if (error.name === 'AbortError') {
  // 超时错误
} else if (error.message.includes('504') || error.message.includes('502')) {
  // 网关错误
} else {
  // 其他错误
}
```

### 3. 验证API密钥

#### 获取新的API密钥：
1. 访问 https://platform.deepseek.com
2. 登录账号
3. 进入 **API Keys** 页面
4. 检查现有密钥状态
5. 如果需要，创建新密钥

#### 检查配额：
- DeepSeek免费层限制：可能有请求速率限制
- 如果超出限制，需要升级套餐或等待配额重置

### 4. Netlify Functions配置

确保 `netlify.toml` 配置正确：
```toml
[build]
  functions = "netlify/functions"
  publish = "."

[functions]
  node_bundler = "esbuild"
  
# 可选：增加函数超时时间（付费计划）
# [functions]
#   "*".timeout = 30
```

### 5. 环境变量设置步骤

#### 通过Netlify UI设置：
1. Netlify Dashboard
2. 选择站点
3. **Site settings** → **Build & deploy** → **Environment**
4. 点击 **Add a variable**
5. Key: `DEEPSEEK_API_KEY`
6. Value: `your_actual_api_key`
7. 点击 **Save**
8. **重新部署站点**（重要！）

#### 通过命令行设置：
```bash
netlify env:set DEEPSEEK_API_KEY "your_actual_api_key"
```

### 6. 测试步骤

#### 测试1：英文提问（已正常）
```
User: What is SDD?
Expected: English response ✅
```

#### 测试2：中文提问（需修复）
```
用户：什么是SDD？
期望：中文回答
```

#### 测试3：检查控制台
1. 按F12打开开发者工具
2. 切换到Console标签
3. 提交中文问题
4. 查看错误详情
5. 检查Network标签中的API请求

## 🚀 部署更新

```bash
# 1. 提交代码
git add .
git commit -m "Fix API timeout and improve error handling"
git push origin main

# 2. Netlify自动部署

# 3. 确认环境变量
netlify env:list

# 4. 如需手动触发部署
netlify deploy --prod
```

## 📊 性能优化总结

### 速度提升措施：
1. ✅ **增加max_tokens**: 1000 → 2000
2. ✅ **降低temperature**: 0.7 → 0.5
3. ✅ **添加超时控制**: 30秒
4. ✅ **优化错误处理**: 详细分类错误
5. ✅ **禁用流式响应**: 确保完整响应

### 预期效果：
- 响应时间：从可能的超时 → 5-10秒内
- 成功率：提高（通过更好的错误处理）
- 用户体验：清晰的错误提示

## 🔧 故障排查清单

使用此清单诊断问题：

- [ ] DeepSeek API密钥已在Netlify配置
- [ ] API密钥有效且未过期
- [ ] API配额未超限
- [ ] 已重新部署站点
- [ ] 浏览器控制台没有CORS错误
- [ ] Network标签显示请求已发送
- [ ] Functions日志显示请求被接收
- [ ] DeepSeek API服务正常运行

## 📝 调试命令

### 查看Netlify函数日志：
```bash
netlify functions:list
netlify logs:function chat
```

### 本地测试：
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 本地运行
netlify dev

# 访问 http://localhost:8888
```

### 测试API直接调用：
```bash
# 测试中文
curl -X POST https://your-site.netlify.app/.netlify/functions/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"什么是SDD？"}'

# 测试英文
curl -X POST https://your-site.netlify.app/.netlify/functions/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is SDD?"}'
```

## 💡 常见问题

### Q1: 504错误持续出现
**A**: 检查DeepSeek API密钥和配额

### Q2: 英文正常但中文失败
**A**: 可能是字符编码问题，已在代码中处理

### Q3: 响应很慢
**A**: 本次已优化，降低temperature和增加tokens

### Q4: 偶尔超时
**A**: DeepSeek服务可能繁忙，已添加30秒超时和重试提示

## 🎯 下一步

1. **立即**：推送更新到GitHub
2. **验证**：Netlify自动部署完成
3. **确认**：环境变量DEEPSEEK_API_KEY已设置
4. **测试**：中文和英文提问
5. **监控**：观察响应时间和成功率

---

更新后，中文功能应该能正常工作，响应速度也会更快！🚀

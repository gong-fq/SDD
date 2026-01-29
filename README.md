# SDD 规格驱动开发学院

一个面向开发者的**Spec-Driven Development（规格驱动开发）**教学平台，帮助你掌握系统化的软件开发方法论。

## 🎯 项目特点

- **8讲系统课程**：从基础到高级，全面覆盖SDD核心知识
- **互动式学习**：每讲包含单选题和实战案例
- **AI智能助教**：基于DeepSeek的24/7在线答疑
- **🌐 双语支持**：智能识别中英文提问，自动匹配回答语言
- **语音交互**：支持中英文语音提问（Web Speech API）
- **TTS朗读**：AI回答可中英文语音朗读
- **中英文参考资料**：每讲提供权威学习资源

## 📚 课程大纲

1. **第1讲**：什么是SDD？- 理解核心理念与Vibe Coding的区别
2. **第2讲**：编写第一份规格文档 - 掌握规格文档结构
3. **第3讲**：从规格到测试用例 - 实现TDD与SDD结合
4. **第4讲**：接口设计与API规格 - RESTful API最佳实践
5. **第5讲**：数据模型与Schema设计 - 数据一致性保障
6. **第6讲**：并发与状态管理规格 - 解决竞态条件问题
7. **第7讲**：性能与可扩展性规格 - 非功能性需求定义
8. **第8讲**：SDD在AI时代的应用 - Prompt工程与人机协作

## 🚀 快速开始

### 本地开发

```bash
# 克隆仓库
git clone <your-repo-url>
cd sdd-learning-academy

# 安装依赖（可选）
npm install netlify-cli -g

# 设置环境变量
# 创建 .env 文件
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 启动开发服务器
netlify dev

# 访问 http://localhost:8888
```

### 部署到Netlify

1. **连接GitHub仓库**
   - 登录 [Netlify](https://app.netlify.com)
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的GitHub仓库

2. **配置环境变量**
   - 进入 Site settings → Environment variables
   - 添加 `DEEPSEEK_API_KEY`
   - 值为你的DeepSeek API密钥

3. **部署设置**
   - Build command: `echo 'Static site'`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

4. **触发部署**
   - 推送代码到主分支
   - Netlify自动构建和部署

## 🔑 获取DeepSeek API密钥

1. 访问 [DeepSeek开放平台](https://platform.deepseek.com)
2. 注册/登录账号
3. 进入"API Keys"页面
4. 创建新的API密钥
5. 复制密钥并保存

## 🛠️ 技术栈

- **前端**：原生HTML/CSS/JavaScript
- **样式**：自定义CSS（Crimson Pro + JetBrains Mono字体）
- **后端**：Netlify Functions (Serverless)
- **AI模型**：DeepSeek Chat API（支持中英文双语）
- **语音**：Web Speech API (中英文语音识别 + TTS)
- **语言检测**：基于正则的智能中英文识别
- **部署**：Netlify

## 📖 使用指南

### 课程导航
- 点击顶部标签切换课程
- 每讲包含理论、代码示例、测试题和案例

### AI助教功能
1. **语言选择**：
   - 🌐 自动检测：根据你的提问语言自动回答
   - 🇨🇳 中文模式：强制使用中文交流
   - 🇺🇸 English：强制使用英文交流
   
2. **文字提问**：
   - 点击右下角🤖按钮打开助手面板
   - 用中文或英文输入问题后点击📤发送
   - AI会用相同语言回答
   
3. **语音提问**：
   - 点击🎤按钮开始录音（需授权麦克风）
   - 用中文或英文说出问题
   - 系统自动识别语言并发送
   
4. **朗读回答**：
   - AI回答后点击🔊按钮
   - 自动检测回答语言进行朗读

### 答题系统
- 每讲末尾有单选题
- 选择答案后点击"提交答案"
- 即时反馈正确/错误

## 🎨 设计特色

- **深色主题**：护眼的蓝色渐变背景
- **动画效果**：流畅的页面切换和交互动画
- **响应式**：完美支持桌面和移动设备
- **代码高亮**：JetBrains Mono字体优化代码阅读

## 🔒 隐私说明

- 语音识别在本地浏览器完成
- 对话内容通过HTTPS加密传输到DeepSeek
- 不存储用户个人信息和对话历史

## 📝 开发路线图

- [x] 8讲核心课程内容
- [x] AI智能助教集成
- [x] 语音识别与TTS
- [x] 单选题答题系统
- [x] 实战案例展示
- [ ] 多选题和主观题支持
- [ ] 代码在线编辑器
- [ ] 学习进度追踪
- [ ] 用户证书生成

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进课程内容和功能！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [DeepSeek](https://deepseek.com) - 提供强大的AI模型
- [Netlify](https://netlify.com) - 免费的Serverless部署平台
- 所有参考资料的原作者

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交GitHub Issue
- 邮箱：your-email@example.com

---

**⭐ 如果觉得有帮助，欢迎给项目点个Star！**

让我们一起掌握SDD，在AI时代成为更高效的开发者！🚀

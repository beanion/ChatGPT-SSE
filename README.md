# 实时ChatGPT服务，基于最新的gpt-3.5-turbo-0301模型

## chatGPT-SSE

- chatGPT-SSE: [https://github.com/beanion/ChatGPT-SSE](https://github.com/beanion/chatgpt-sse) 
  - chatGPT-SSE是一个前端服务，以sse的方式实时接收chatGPT-service返回的消息


## 快速开始

```bash
# 拉取代码
git clone https://github.com/beanion/ChatGPT-SSE.git
cd chatgpt-sse

# chatGPT的注册页面: https://beta.openai.com/signup
# chatGPT的APIkey管理界面: https://beta.openai.com/account/api-keys


## 如何编译

```bash
# .env.development为运行测试的配置文件
# .env.production为正式构建的配置文件
# 拉取构建依赖
npm install
# 运行测试
npm run serve
# 执行编译
npm run build
```

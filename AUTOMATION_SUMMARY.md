# 自动化部署总结

## ✅ 已完成的自动化操作

### 1. 创建 Worker 配置文件
- ✅ 创建 `worker/package.json`
- ✅ 创建 `worker/.gitignore`
- ✅ 更新 `worker/wrangler.toml`
- ✅ 安装 npm 依赖（wrangler）
- ✅ 提交并推送到 GitHub

### 2. 配置前端环境变量
- ✅ 创建 `.env.local` 文件
- ✅ 填入 Supabase 配置
- ⚠️ PayPal Client ID 需要你手动填入

---

## ⚠️ 需要你手动完成的操作

由于以下操作需要你的凭证或交互式操作，我无法自动完成：

### 1. 填入 PayPal Client ID

编辑 `.env.local` 文件：
```bash
cd /root/projects/recognize_chinese_characters
nano .env.local
```

将 `VITE_PAYPAL_CLIENT_ID=你的_sandbox_client_id` 改为你的真实 Sandbox Client ID。

---

### 2. 部署 Cloudflare Worker

需要你登录 Cloudflare 并设置 Secrets：

```bash
cd /root/projects/recognize_chinese_characters/worker

# 登录 Cloudflare（会打开浏览器）
npx wrangler login

# 设置 Secrets（需要交互式输入）
npx wrangler secret put PAYPAL_SANDBOX_CLIENT_ID
# 输入你的 Sandbox Client ID

npx wrangler secret put PAYPAL_SANDBOX_SECRET
# 输入你的 Sandbox Secret

npx wrangler secret put PAYPAL_LIVE_CLIENT_ID
# 输入你的 Live Client ID

npx wrangler secret put PAYPAL_LIVE_SECRET
# 输入你的 Live Secret

npx wrangler secret put PAYPAL_MODE
# 输入: sandbox

# 部署
npx wrangler deploy
```

部署成功后，你会得到一个 Worker URL，例如：
```
https://recognize-chinese-characters-api.xxx.workers.dev
```

---

### 3. 更新前端 API 地址

拿到 Worker URL 后，需要更新两个文件：

**文件 1: src/views/Pricing.vue**
```javascript
// 第 15 行左右
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://你的worker地址.workers.dev'  // 👈 改这里
  : 'http://localhost:8787'
```

**文件 2: src/views/PaymentSuccess.vue**
```javascript
// 第 15 行左右
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://你的worker地址.workers.dev'  // 👈 改这里
  : 'http://localhost:8787'
```

然后提交：
```bash
git add src/views/Pricing.vue src/views/PaymentSuccess.vue
git commit -m "chore: 更新 PayPal Worker API 地址"
git push
```

---

### 4. 本地测试（可选）

如果想本地测试：

**终端 1 - 启动前端：**
```bash
cd /root/projects/recognize_chinese_characters
npm run dev
```

**终端 2 - 启动后端：**
```bash
cd /root/projects/recognize_chinese_characters/worker
npx wrangler dev
```

访问 http://localhost:5173/#/pricing 测试支付流程。

---

## 📋 操作清单

- [x] 创建 Worker 配置文件
- [x] 安装 npm 依赖
- [x] 创建 .env.local 文件
- [x] 提交代码到 GitHub
- [ ] 填入真实的 PayPal Client ID（需要你操作）
- [ ] 登录 Cloudflare（需要你操作）
- [ ] 设置 Worker Secrets（需要你操作）
- [ ] 部署 Worker（需要你操作）
- [ ] 更新前端 API 地址（需要你操作）
- [ ] 提交 API 地址更新（需要你操作）

---

## 🎯 下一步

1. 从你的 PayPal 截图中获取 Sandbox Client ID
2. 填入 `.env.local` 文件
3. 按照上面的步骤部署 Worker
4. 更新前端 API 地址
5. 等待 GitHub Pages 自动部署
6. 访问 https://recognize-chinese-characters.online/#/pricing 测试

---

**我已经完成了所有我能自动化的操作，剩下的需要你的 PayPal 凭证和 Cloudflare 登录。**

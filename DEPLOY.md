# 部署说明（Cloudflare Pages）

当前项目使用 **Cloudflare Pages 自动构建部署**。

GitHub Actions 工作流当前是占位禁用状态：
- 文件：`.github/workflows/deploy.yml`
- 当前策略：代码 push 到 GitHub 后，由 Cloudflare Pages 自动拉取仓库并构建部署

---

## 生产环境必须配置的环境变量

由于项目现在通过 Vite 环境变量读取 Supabase 配置，所以在 Cloudflare Pages 中必须配置：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

如果没配，前端在启动时会直接报错：

```text
Missing Supabase env: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
```

---

## Cloudflare Pages 页面操作步骤

进入 Cloudflare Dashboard：

1. 打开 **Workers & Pages**
2. 进入当前项目
3. 打开 **Settings**
4. 打开 **Environment variables**
5. 分别在以下环境中补齐变量：
   - `Production`
   - `Preview`（建议也配，避免预览环境构建失败）

建议配置如下：

```env
VITE_SUPABASE_URL=https://hbojueszbpyeyaqssplt.supabase.co
VITE_SUPABASE_ANON_KEY=你的 Supabase publishable / anon key
```

---

## 推荐的 Build 配置

如果 Cloudflare Pages 里还没确认，可以核对以下配置：

- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 建议 `22`

---

## 本地开发对应方式

本地开发时：

```bash
cp .env.example .env
npm install
npm run dev
```

本地构建验证：

```bash
npm run build
```

---

## 部署排查 checklist

如果线上打不开或白屏，优先检查：

### 1. 环境变量是否已配置
确认 Cloudflare Pages 的 Production / Preview 都配置了：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. 是否重新触发部署
环境变量变更后，通常需要：
- 重新部署最新版本
- 或重新触发一次构建

### 3. 构建输出目录是否是 `dist`
Vite 默认产物目录是 `dist`，配错会导致部署成功但页面异常。

### 4. Node 版本是否过旧
建议固定到 Node 22，避免依赖和构建行为不一致。

---

## 当前部署策略建议

短期建议继续保持：
- GitHub 作为代码仓库
- Cloudflare Pages 自动部署
- 环境变量由 Cloudflare Pages 面板管理

这样最简单、最稳。

# 认字乐园

一个面向低龄儿童的汉字启蒙 Web 应用。

当前版本已经具备：
- 分级学习关卡
- 游戏化答题
- 复习 / 强化模式
- 学习进度统计
- 家长中心
- 打卡与成就
- Supabase 账号登录与云同步

## 在线地址

- 线上站点：https://recognize-chinese-characters.online
- GitHub 仓库：https://github.com/weilailai2026-art/recognize_chinese_characters

---

## 项目目标

把“识字”做成更像小游戏而不是死记硬背：
- 小朋友可以直接开始认字
- 系统会根据答题情况区分：未学过 / 需复习 / 需强化 / 已掌握
- 家长可以从家长中心查看整体进度
- 用户登录后可跨设备同步学习记录

---

## 当前核心功能

### 1. 首页学习入口
- 展示用户等级、连续打卡、整体掌握情况
- 展示分级关卡：启蒙级 / 初级 / 中级 / 高级
- 支持锁定未解锁关卡
- 新增“今日推荐练习”卡片：
  - 优先推荐当前关卡的强化字
  - 其次推荐复习字
  - 再次推荐继续学习新字

### 2. 游戏模式
- 普通学习模式（normal）
- 专项复习模式（review）
- 游戏页已接入：
  - `level`
  - `mode`
- 会按当前关卡出题，而不是全量混出
- 复习模式优先抽当前关卡中 `review + strengthen` 的字

### 3. 进度与成长体系
- 单字状态：
  - `unlearned`
  - `review`
  - `strengthen`
  - `mastered`
- 连续打卡
- 对局统计
- 成就解锁弹窗

### 4. 家长中心
- 查看所有字的掌握情况
- 按状态筛选
- 按关卡筛选
- 查看单字详情：
  - 拼音
  - 所属关卡
  - 答对次数
  - 答错次数
- 支持重置进度
- 支持修改家长密码

### 5. 登录与云同步
- Supabase 邮箱注册 / 登录
- 学习进度同步到云端
- 多设备共享学习进度

---

## 最近完成的关键迭代

近期已经完成并推送：

- `edb8735 feat: Game 接入 level 和 mode 参数`
- `fa8c863 feat: 接入游戏打卡与成就结算`
- `24a9c28 feat: 家长中心支持按关卡筛选进度`
- `8f531a2 feat: 首页增加今日推荐练习`
- `d700322 docs: 完善项目 README 与开发说明`

---

## 技术栈

- Vue 3
- Vite
- Vue Router
- Tailwind CSS
- Supabase

---

## 本地开发

### 安装依赖

```bash
npm install
```

### 配置环境变量

先复制示例配置：

```bash
cp .env.example .env
```

然后根据你的环境修改：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 启动开发环境

```bash
npm run dev
```

默认本地地址：

```bash
http://localhost:5173
```

### 构建生产版本

```bash
npm run build
```

### 本地预览生产包

```bash
npm run preview
```

---

## 项目结构

```text
src/
├── assets/              静态资源
├── components/          弹窗 / 成就 / 登录等组件
├── data/
│   └── characters.js    汉字数据、关卡定义
├── lib/
│   └── supabase.js      Supabase 客户端
├── router/
│   └── index.js         路由配置
├── utils/
│   ├── auth.js          登录态管理
│   ├── progression.js   打卡、成就、关卡成长逻辑
│   ├── speech.js        发音与音效
│   └── storage.js       本地进度与云同步
├── views/
│   ├── Home.vue         首页
│   ├── Game.vue         游戏页
│   └── Parent.vue       家长中心
├── App.vue
└── main.js
```

---

## 关键数据逻辑

### 关卡定义
在 `src/data/characters.js`：
- `levels` 定义关卡
- 每个字包含：
  - `char`
  - `pinyin`
  - `emoji`
  - `description`
  - `level`

### 单字状态判断
在 `src/utils/storage.js`：
- 连续答对达到阈值后进入 `mastered`
- 答错积累后会进入 `strengthen`
- 中间状态为 `review`

### 成长与成就
在 `src/utils/progression.js`：
- 连续打卡统计
- 成就解锁
- 关卡掌握度计算
- 用户等级标题

---

## Supabase 说明

当前项目通过环境变量初始化 Supabase：
- 文件：`src/lib/supabase.js`
- 示例配置：`.env.example`

使用方式：

```js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

如果未配置环境变量，项目会在启动时报错，避免在错误配置下静默运行。

### 建议
后续更稳妥的做法：
- 区分开发 / 生产环境变量
- 增加部署平台（如 Cloudflare Pages）的环境变量说明
- 避免把真实私密配置提交进仓库

---

## 后续建议优先级

### P1
- 增加首页“今日任务完成度”
- 增加关卡完成后的引导（自动推荐下一关）
- 给家长中心增加按关卡统计图
- 增加部署环境变量配置说明

### P2
- 增加音效开关入口
- 优化移动端细节和动画反馈
- 增加更多汉字包 / 分类内容

### P3
- 增加排行榜 / 勋章墙
- 增加家长学习报告
- 增加 A/B 测试不同练习节奏

---

## 当前已知可以继续优化的点

- README 之前是 Vite 默认模板，现已补成项目说明
- 浏览器自动化验证在当前执行环境里受限，主要依赖 `npm run build` 做快速回归
- Git 推送链路已经切换为 SSH，可继续直接提交 / 推送
- 生产环境部署时需要同步配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`

---

## 维护建议

每次做功能改动，建议保持这个顺序：

1. 改代码
2. `npm run build`
3. `git commit`
4. `git push origin main`
5. 更新 README 中的关键功能说明（如果有明显产品变化）

这样后续接手成本最低。

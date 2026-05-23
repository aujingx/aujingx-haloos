## 概念

**Halo OS** — 一套无需点按、为智能眼镜 + 蓝牙耳机打造的 AI 操作系统。官网用产品发布会的叙事节奏介绍它："看一眼，它就懂；说一句，它就做。"

视觉融合：
- **Meta Ray-Ban 的生活感**：真实佩戴场景、明亮户外摄影、人物视角、暖色调
- **Xreal/Rokid 的未来感**：HUD 信息层、霓虹光晕、视点追踪可视化、深色科技段落

整体节奏：明（生活场景）→ 暗（系统能力）→ 明（CTA），形成呼吸感。

---

## 页面结构（单页长滚动 + 内嵌 demo）

```
/  (src/routes/index.tsx)
 ├─ Nav            固定顶栏，半透明毛玻璃
 ├─ Hero           暗场 + 眼镜佩戴第一视角，标语 "No tap. Just look."
 ├─ Manifesto      三行大字宣言，慢速淡入
 ├─ Section 1      "It listens."   ─── 语音对话场景 + AI 状态点演示
 ├─ Section 2      "It sees."      ─── 视点追踪 demo（鼠标=视线，悬停 0.8s 触发）
 ├─ Section 3      "It acts."      ─── 手势/对话执行任务，HUD 卡片浮现
 ├─ Demo 区块      全宽嵌入三幕交互（日程 / 消息 / 导航），底部进度条
 ├─ Hardware       眼镜 + 耳机产品图，规格表（Ray-Ban 风）
 ├─ Ambient AI     "AI 在听 / 懂了 / 在执行" 状态语言展示
 ├─ Tech Specs     深色段，霓虹分隔线（Xreal 风）
 ├─ CTA            "Pre-order Halo" + 邮件订阅
 └─ Footer         极简
```

`/demo` 也建一个独立路由，承载放大版交互 demo，便于直接分享。

---

## 三幕交互 demo（保留并升级现有方案）

| 幕 | 场景 | 交互 |
|---|---|---|
| 日程 | 早晨语音卡片浮现 | 视点悬停展开 → 右滑（手势）完成 |
| 消息 | 视野角落呼吸光点 | 靠近 → 三列环绕展开 → 选"语音回复" |
| 导航 | 街景全景 | 左右拖拽=转头，POI 标签视差，"信息用完即散" |

右上角 AI 状态点：待机 / 在听 / 理解中 / 执行中（四态光晕动画）。

---

## 视觉系统

- **配色**：主体 `#0A0A0B` 深黑 + `#F5F1EA` 暖米；点缀 `#FF5A1F` 焰橙（Ray-Ban 标志色）和 `#7CF9FF` 冷青 HUD 光（Xreal 风）
- **字体**：标题 Sora（科技几何）；正文 Inter；小标签等宽 JetBrains Mono
- **动效**：Framer Motion + scroll-triggered；hero 视差、文字 mask reveal、HUD 元素从视点位置放射
- **图像**：用 `imagegen` 生成 6–8 张关键图（佩戴场景、产品特写、HUD overlay、街景）

---

## 技术实现

- 新增路由：`src/routes/index.tsx`（重写）、`src/routes/demo.tsx`
- 组件：`Nav`, `Hero`, `Section`, `AIStatusOrb`, `DemoStage`, `SceneSchedule`, `SceneMessage`, `SceneNav`, `HUDOverlay`, `SpecTable`, `CTA`, `Footer`
- 设计 token 全部写入 `src/styles.css`（oklch）
- 安装：`framer-motion`
- 每个路由独立 `head()` meta（SEO）
- 生成图存于 `src/assets/`，作为 ES6 import

---

## 不做的事

- 不接入真实 AI / 后端（纯前端原型）
- 不做账号、支付、订阅落库（CTA 仅展示）
- 不做移动端深度适配（demo 主要面向桌面演示，但布局响应式不破）

---

确认后我开始构建。产品名我先用 **Halo OS**，如果你想换（如 Lumen / Vista / Aura）告诉我。

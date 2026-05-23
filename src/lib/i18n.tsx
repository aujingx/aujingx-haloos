import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;
type Dicts = Record<Locale, Dict>;

const dict: Dicts = {
  zh: {
    // Nav
    "nav.listens": "听见",
    "nav.sees": "看见",
    "nav.acts": "行动",
    "nav.demo": "演示",
    "nav.hardware": "硬件",
    "nav.tryDemo": "试用 Demo",
    "nav.langToggle": "EN",

    // Hero
    "hero.eyebrow": "重磅推出 · Halo OS",
    "hero.title1": "无需点按。",
    "hero.title2": "只需一眼。",
    "hero.body": "一套为智能眼镜与无线音频打造的环境式操作系统。说一句、看一眼、做个手势——界面在听，世界仍在眼前。",
    "hero.scroll": "向下滚动",

    // Manifesto
    "manifesto.l1": "屏幕的十年，已经过去。",
    "manifesto.l2": "我们停止抬头很久了。",
    "manifesto.l3": "Halo 把世界还给前景。",

    // Feature: listens
    "f.listens.eyebrow": "01 · 听见",
    "f.listens.title": "麦克风敞开。世界依旧在那里。",
    "f.listens.body": "说一句话，Halo 接住你停下注意的地方。设备端语音识别，由耳机波束成形拾音、由边缘模型解析——无需唤醒词，也无需尴尬的停顿。",
    "f.listens.b1k": "唤醒到响应",
    "f.listens.b1v": "110 毫秒",
    "f.listens.b2k": "识别",
    "f.listens.b2v": "本地识别 · 28 种语言",
    "f.listens.b3k": "确认反馈",
    "f.listens.b3v": "轻提示音 + 青色光点",
    "f.listens.b4k": "隐私指示灯",
    "f.listens.b4v": "采集时常亮",
    "f.listens.alt": "在城市街道上佩戴 Halo Frames 的人",

    // Feature: sees
    "f.sees.eyebrow": "02 · 看见",
    "f.sees.title": "视线即光标。停留即点击。",
    "f.sees.body": "凝视一张卡片 800 毫秒，它就展开；移开视线，它就消散。没有指针，也没有菜单——只有你本就在付出的注意力与意图。",
    "f.sees.b1k": "视点追踪",
    "f.sees.b1v": "中央凹 · 240 Hz",
    "f.sees.b2k": "停留选择",
    "f.sees.b2v": "800 毫秒 · 可调",
    "f.sees.b3k": "确认手势",
    "f.sees.b3v": "拇指轻触",
    "f.sees.b4k": "阅读模式",
    "f.sees.b4v": "看到文字自动暂停",
    "f.sees.alt": "咖啡馆场景中浮现的 Halo HUD 消息气泡",

    // Feature: acts
    "f.acts.eyebrow": "03 · 行动",
    "f.acts.title": "一句话。系统包办剩下的事。",
    "f.acts.body": "「把 2 点的会改到周四，告诉团队，并预订 Aurora 会议室。」Halo 把意图编排到日历、聊天和会议室——一份轻巧的回执，浮在视野边缘。",
    "f.acts.b1k": "跨应用意图",
    "f.acts.b1v": "原生动作图",
    "f.acts.b2k": "撤销窗口",
    "f.acts.b2v": "10 秒一瞥可撤销",
    "f.acts.b3k": "操作回执",
    "f.acts.b3v": "4 秒后淡出",
    "f.acts.b4k": "离线",
    "f.acts.b4v": "核心动作设备端完成",
    "f.acts.alt": "骑行第一视角中的 Halo 导航叠加",

    // DemoStage
    "demo.eyebrow": "实时演示 · 三幕",
    "demo.title1": "看见你",
    "demo.title2": "不用触碰的界面。",
    "demo.hint": "用视线（鼠标）悬停一张卡片即可停留选择。Halo 会在 800 毫秒内响应——和一瞥一样的速度。",
    "demo.scene.schedule": "日程",
    "demo.scene.message": "消息",
    "demo.scene.navigate": "导航",
    "demo.scene.schedule.cap": "凝视展开。挥手确认。",
    "demo.scene.message.cap": "通知会呼吸。语音可回复。",
    "demo.scene.navigate.cap": "转头即可。标签随你而动。",
    "demo.fov": "视场 110°",

    // Schedule scene
    "sch.morning": "周二 · 早晨",
    "sch.task1": "晨会 · 工程组",
    "sch.task1p": "Halo 工作室",
    "sch.task2": "和 Mira 喝咖啡",
    "sch.task2p": "Blue Bottle",
    "sch.task3": "设计评审 · Frames v3",
    "sch.task3p": "Aurora 会议室",
    "sch.swipeHint": "右滑 → 标记完成",
    "sch.swipeBtn": "手势：右滑 →",

    // Message scene
    "msg.who": "Mira · 刚刚",
    "msg.from": "Mira",
    "msg.body": "11 点的咖啡还约吗？我在找个角落的桌子。",
    "msg.lookSpeak": "看着 + 说",
    "msg.reply": "「在路上了，两分钟。」",
    "msg.voice": "语音回复",
    "msg.dismiss": "忽略",
    "msg.mute": "静音 Mira · 1 小时",
    "msg.share": "分享位置",
    "msg.sent": "已发送 · 「在路上了，两分钟。」",

    // Navigate scene
    "nav.poi1": "Blue Bottle 咖啡",
    "nav.poi2": "Halo 工作室",
    "nav.poi3": "Aurora 公园",
    "nav.heading": "朝向",
    "nav.dragHint": "拖拽转头",

    // Hardware
    "hw.eyebrow": "硬件",
    "hw.title1": "两件设备。",
    "hw.title2": "一层环境界面。",
    "hw.body": "Halo OS 跑在通用硬件上：一副波导智能眼镜，加任意蓝牙耳机。无需新生态。",
    "hw.glasses.tag": "Halo Frames",
    "hw.glasses.title": "智能眼镜",
    "hw.g1k": "显示", "hw.g1v": "立体波导 · 1080p",
    "hw.g2k": "视场", "hw.g2v": "110°",
    "hw.g3k": "重量", "hw.g3v": "62 克",
    "hw.g4k": "续航", "hw.g4v": "8 小时综合使用",
    "hw.g5k": "输入", "hw.g5v": "视线 · 语音 · 手势",
    "hw.buds.tag": "Halo Buds",
    "hw.buds.title": "无线音频",
    "hw.b1k": "驱动单元", "hw.b1v": "11 mm 动圈",
    "hw.b2k": "延迟", "hw.b2v": "< 60 ms",
    "hw.b3k": "编解码", "hw.b3v": "LC3 · aptX Adaptive",
    "hw.b4k": "续航", "hw.b4v": "6 小时 + 24 小时充电盒",
    "hw.b5k": "麦克风", "hw.b5v": "双麦波束成形",
    "hw.gen": "Gen 01",

    // Ambient states
    "amb.eyebrow": "环境语言",
    "amb.title1": "四种状态。",
    "amb.title2": "这就是全部界面。",
    "amb.body": "Halo 不给你桌面，它告诉你它在听、在想，还是在做——其它时候，让出舞台。",
    "amb.idle.t": "待机", "amb.idle.b": "视野角落一点温润的微光。无光，无声——只是在。",
    "amb.listening.t": "在听", "amb.listening.b": "青色光环呼吸收拢。耳机里一声轻响，确认你被听见。",
    "amb.thinking.t": "理解中", "amb.thinking.b": "光点转为余烬色。Halo 在解析意图与情境——世界不被阻挡。",
    "amb.acting.t": "执行中", "amb.acting.b": "一次青色脉动，然后消散。完成使命的信息，自行退场。",

    // TechSpecs
    "ts.eyebrow": "系统 · 01",
    "ts.title": "为眼角而工程。",
    "ts.r1k": "输入", "ts.r1v": "视点追踪 · 语音 · 微手势 · 轻微点头",
    "ts.r2k": "输出", "ts.r2v": "立体波导 HUD · 空间音频 · 镜腿触觉",
    "ts.r3k": "延迟", "ts.r3v": "唤醒到渲染：110 ms · 停留选择：800 ms",
    "ts.r4k": "隐私", "ts.r4v": "设备端语音识别 · 加密中继 · 摄像头快门指示灯",
    "ts.r5k": "运行时", "ts.r5v": "Halo Core · 4B 参数 · 边缘量化推理",
    "ts.r6k": "SDK", "ts.r6v": "TypeScript · 原生意图 · 环境卡片 API",

    // CTA
    "cta.eyebrow": "预订 · 首发批次",
    "cta.title1": "抬起头。",
    "cta.title2": "操作系统会向你而来。",
    "cta.body": "首发限量 5000 名创始用户。第四季度发货。无需手机。",
    "cta.placeholder": "you@somewhere.co",
    "cta.btn": "预订",
    "cta.sent": "已预订 · 我们会与你联系",
    "cta.demoLink": "或者试一下交互演示 →",

    // Footer
    "ft.ver": "v0.1 · 概念",
    "ft.copy": "© 2026 · 一次环境计算的探索",

    // Demo page
    "demoPage.eyebrow": "交互原型",
    "demoPage.title": "Halo OS · 演示",
    "demoPage.body": "你的鼠标即是视线。悬停 800 毫秒即可停留选择。用舞台下方的场景切换器在「日程 / 消息 / 导航」之间切换。",

    // Orb labels
    "orb.idle": "待机",
    "orb.listening": "在听",
    "orb.thinking": "理解中",
    "orb.acting": "执行中",
    "orb.brand": "Halo",
  },
  en: {
    "nav.listens": "Listens",
    "nav.sees": "Sees",
    "nav.acts": "Acts",
    "nav.demo": "Demo",
    "nav.hardware": "Hardware",
    "nav.tryDemo": "Try Demo",
    "nav.langToggle": "中",

    "hero.eyebrow": "Introducing · Halo OS",
    "hero.title1": "No tap.",
    "hero.title2": "Just look.",
    "hero.body": "An ambient operating system for smart glasses and wireless audio. Speak, glance, gesture — the surface listens, the world stays in view.",
    "hero.scroll": "Scroll",

    "manifesto.l1": "The screen has had its decade.",
    "manifesto.l2": "We stopped looking up.",
    "manifesto.l3": "Halo gives the world back its foreground.",

    "f.listens.eyebrow": "01 · It Listens",
    "f.listens.title": "The mic is open. The world is still there.",
    "f.listens.body": "Say a sentence and Halo picks up where your attention left off. On-device speech, beam-formed by your earbuds, parsed by an edge model — no wake word, no awkward pause.",
    "f.listens.b1k": "Wake to render", "f.listens.b1v": "110 ms",
    "f.listens.b2k": "Recognition", "f.listens.b2v": "On-device · 28 languages",
    "f.listens.b3k": "Confirmation", "f.listens.b3v": "Soft tone + cyan dot",
    "f.listens.b4k": "Privacy LED", "f.listens.b4v": "Always on when capturing",
    "f.listens.alt": "Person wearing Halo Frames on a city street at sunset",

    "f.sees.eyebrow": "02 · It Sees",
    "f.sees.title": "Your gaze is the cursor. Your dwell is the click.",
    "f.sees.body": "Look at a card for 800 ms and it expands. Look away and it dissolves. There is no pointer, no menu — only attention and intent, the two things you were already paying.",
    "f.sees.b1k": "Tracking", "f.sees.b1v": "Foveated · 240 Hz",
    "f.sees.b2k": "Dwell select", "f.sees.b2v": "800 ms · adjustable",
    "f.sees.b3k": "Confirm gesture", "f.sees.b3v": "Subtle thumb tap",
    "f.sees.b4k": "Reading mode", "f.sees.b4v": "Auto-pause on text",
    "f.sees.alt": "Halo HUD message bubble overlaid in cafe scene",

    "f.acts.eyebrow": "03 · It Acts",
    "f.acts.title": "One sentence. The system does the rest.",
    "f.acts.body": "\"Move my 2pm to Thursday, tell the team, and book Aurora.\" Halo composes the intent across calendar, chat, and rooms — and shows you a quiet receipt floating at the edge of view.",
    "f.acts.b1k": "Multi-app intent", "f.acts.b1v": "Native action graph",
    "f.acts.b2k": "Undo window", "f.acts.b2v": "10 s glance-revert",
    "f.acts.b3k": "Receipts", "f.acts.b3v": "Fade after 4 s",
    "f.acts.b4k": "Offline", "f.acts.b4v": "Core actions on-device",
    "f.acts.alt": "Cyclist POV with Halo navigation overlay in park",

    "demo.eyebrow": "Live Demo · 03 Acts",
    "demo.title1": "See the interface",
    "demo.title2": "you don't touch.",
    "demo.hint": "Hover your gaze (cursor) on a card to dwell-select. Halo responds in 800 ms — same as a glance.",
    "demo.scene.schedule": "Schedule",
    "demo.scene.message": "Message",
    "demo.scene.navigate": "Navigate",
    "demo.scene.schedule.cap": "Glance to expand. Swipe to commit.",
    "demo.scene.message.cap": "Notifications breathe. Voice replies.",
    "demo.scene.navigate.cap": "Turn your head. Labels travel with you.",
    "demo.fov": "FOV 110°",

    "sch.morning": "Tuesday · Morning",
    "sch.task1": "Stand-up · Engineering", "sch.task1p": "Halo Studio",
    "sch.task2": "Coffee with Mira", "sch.task2p": "Blue Bottle",
    "sch.task3": "Design review · Frames v3", "sch.task3p": "Room Aurora",
    "sch.swipeHint": "Swipe right → mark done",
    "sch.swipeBtn": "Gesture: Swipe →",

    "msg.who": "Mira · just now",
    "msg.from": "Mira",
    "msg.body": "Coffee at 11 still good? I'm grabbing a corner table.",
    "msg.lookSpeak": "Look + Speak",
    "msg.reply": "\"On my way, two minutes.\"",
    "msg.voice": "Voice reply",
    "msg.dismiss": "Dismiss",
    "msg.mute": "Mute Mira · 1h",
    "msg.share": "Share location",
    "msg.sent": "Sent · \"On my way, two minutes.\"",

    "nav.poi1": "Blue Bottle Coffee",
    "nav.poi2": "Halo Studio",
    "nav.poi3": "Aurora Park",
    "nav.heading": "Heading",
    "nav.dragHint": "Drag to turn your head",

    "hw.eyebrow": "The Hardware",
    "hw.title1": "Two devices.",
    "hw.title2": "One ambient surface.",
    "hw.body": "Halo OS runs on commodity hardware: a pair of waveguide smart glasses and any Bluetooth earbuds. No new ecosystem required.",
    "hw.glasses.tag": "Halo Frames", "hw.glasses.title": "Smart Glasses",
    "hw.g1k": "Display", "hw.g1v": "Stereo waveguide · 1080p",
    "hw.g2k": "FOV", "hw.g2v": "110°",
    "hw.g3k": "Weight", "hw.g3v": "62 g",
    "hw.g4k": "Battery", "hw.g4v": "8 h mixed use",
    "hw.g5k": "Input", "hw.g5v": "Gaze · Voice · Gesture",
    "hw.buds.tag": "Halo Buds", "hw.buds.title": "Wireless Audio",
    "hw.b1k": "Driver", "hw.b1v": "11 mm dynamic",
    "hw.b2k": "Latency", "hw.b2v": "< 60 ms",
    "hw.b3k": "Codec", "hw.b3v": "LC3 · aptX Adaptive",
    "hw.b4k": "Battery", "hw.b4v": "6 h + 24 h case",
    "hw.b5k": "Mic", "hw.b5v": "Beam-forming dual",
    "hw.gen": "Gen 01",

    "amb.eyebrow": "Ambient Language",
    "amb.title1": "Four states.",
    "amb.title2": "That's the whole interface.",
    "amb.body": "Halo doesn't show you a desktop. It shows you whether it's listening, thinking, or acting — and otherwise gets out of the way.",
    "amb.idle.t": "Standing by", "amb.idle.b": "A faint warm dot in the corner of vision. No light, no sound — just presence.",
    "amb.listening.t": "Listening", "amb.listening.b": "Cyan rings breathe in. A soft tone in your earbuds confirms you've been heard.",
    "amb.thinking.t": "Understanding", "amb.thinking.b": "The dot rotates ember. Halo is parsing intent and context — the world stays unblocked.",
    "amb.acting.t": "Acting", "amb.acting.b": "Cyan pulse, then it dissolves. Information that's done its job, leaves.",

    "ts.eyebrow": "System · 01",
    "ts.title": "Engineered for the corner of your eye.",
    "ts.r1k": "Input", "ts.r1v": "Gaze tracking · Voice · Micro-gesture · Subtle nod",
    "ts.r2k": "Output", "ts.r2v": "Stereo waveguide HUD · Spatial audio · Haptic temple",
    "ts.r3k": "Latency", "ts.r3v": "Wake to render: 110 ms · Dwell select: 800 ms",
    "ts.r4k": "Privacy", "ts.r4v": "On-device ASR · Encrypted relay · Camera shutter LED",
    "ts.r5k": "Runtime", "ts.r5v": "Halo Core · 4B params · Quantized for edge inference",
    "ts.r6k": "SDK", "ts.r6v": "TypeScript · Native intents · Ambient cards API",

    "cta.eyebrow": "Pre-order · Wave One",
    "cta.title1": "Look up.",
    "cta.title2": "The OS comes to you.",
    "cta.body": "Limited to 5,000 founders. Ships Q4. No phone required.",
    "cta.placeholder": "you@somewhere.co",
    "cta.btn": "Reserve",
    "cta.sent": "Reserved · We'll be in touch",
    "cta.demoLink": "Or try the interactive demo →",

    "ft.ver": "v0.1 · Concept",
    "ft.copy": "© 2026 · An ambient computing exploration",

    "demoPage.eyebrow": "Interactive Prototype",
    "demoPage.title": "Halo OS · Demo",
    "demoPage.body": "Your mouse is your gaze. Hover for 800 ms to dwell-select. Use the scene picker below the stage to switch between Schedule, Message, and Navigate.",

    "orb.idle": "Standing by",
    "orb.listening": "Listening",
    "orb.thinking": "Understanding",
    "orb.acting": "Acting",
    "orb.brand": "Halo",
  },
};

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("halo.locale") as Locale | null;
      if (saved === "zh" || saved === "en") setLocaleState(saved);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => ({
    locale,
    setLocale: (l) => {
      setLocaleState(l);
      try { localStorage.setItem("halo.locale", l); } catch {}
    },
    t: (k) => dict[locale][k] ?? dict.en[k] ?? k,
  }), [locale]);

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useT() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useT must be used within LocaleProvider");
  return ctx;
}

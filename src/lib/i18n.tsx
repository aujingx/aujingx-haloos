import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;
type Dicts = Record<Locale, Dict>;

const dict: Dicts = {
  zh: {
    // Nav
    "nav.listens": "它在听",
    "nav.sees": "它在看",
    "nav.acts": "它在做",
    "nav.demo": "演示",
    "nav.hardware": "硬件",
    "nav.tryDemo": "体验 Demo",
    "nav.langToggle": "EN",

    // Hero
    "hero.eyebrow": "Halo OS · 环境式操作系统",
    "hero.title1": "不用点按。",
    "hero.title2": "看一眼就够了。",
    "hero.body": "为智能眼镜和无线耳机原生设计的 AI 操作系统。说一句话、看一眼、做个手势——AI 在听，而世界从未离开你的视野。",
    "hero.scroll": "向下探索",

    // Manifesto
    "manifesto.l1": "屏幕统治了十年，够了。",
    "manifesto.l2": "我们低头太久，忘了抬头。",
    "manifesto.l3": "Halo 让世界重新回到你眼前。",

    // Feature: listens
    "f.listens.eyebrow": "01 · 它在听",
    "f.listens.title": "麦克风常开，世界不会因此消失。",
    "f.listens.body": "开口说一句话，Halo 就接住你的意图。耳机波束成形拾音，端侧模型即时解析——不需要唤醒词，不需要刻意停顿，像对身边的人说话一样自然。",
    "f.listens.b1k": "唤醒到响应",
    "f.listens.b1v": "110 毫秒",
    "f.listens.b2k": "语音识别",
    "f.listens.b2v": "端侧运行 · 28 种语言",
    "f.listens.b3k": "确认方式",
    "f.listens.b3v": "一声轻响 + 视野光点",
    "f.listens.b4k": "隐私保护",
    "f.listens.b4v": "拾音时指示灯常亮",
    "f.listens.alt": "在城市街道上佩戴 Halo Frames 的人",

    // Feature: sees
    "f.sees.eyebrow": "02 · 它在看",
    "f.sees.title": "你的视线就是光标，注视就是点击。",
    "f.sees.body": "盯着一张卡片看 800 毫秒，它就展开；视线移开，它自行消散。没有指针，没有菜单——你的注意力和意图，就是唯一的交互方式。",
    "f.sees.b1k": "眼动追踪",
    "f.sees.b1v": "中央凹级 · 240 Hz",
    "f.sees.b2k": "注视选择",
    "f.sees.b2v": "800 毫秒 · 可调节",
    "f.sees.b3k": "确认手势",
    "f.sees.b3v": "拇指轻触即确认",
    "f.sees.b4k": "阅读模式",
    "f.sees.b4v": "检测到阅读自动暂停",
    "f.sees.alt": "咖啡馆场景中浮现的 Halo HUD 消息气泡",

    // Feature: acts
    "f.acts.eyebrow": "03 · 它在做",
    "f.acts.title": "说一句话，剩下的交给系统。",
    "f.acts.body": "「把下午两点的会挪到周四，通知团队，顺便订一下 Aurora 会议室。」Halo 把你的意图拆解到日历、聊天、会议室系统——一张轻巧的回执浮在视野边缘，确认一切搞定。",
    "f.acts.b1k": "跨应用调度",
    "f.acts.b1v": "原生意图编排",
    "f.acts.b2k": "反悔窗口",
    "f.acts.b2v": "10 秒内瞥一眼可撤销",
    "f.acts.b3k": "执行回执",
    "f.acts.b3v": "4 秒后自动淡出",
    "f.acts.b4k": "离线能力",
    "f.acts.b4v": "核心操作端侧完成",
    "f.acts.alt": "骑行第一视角中的 Halo 导航叠加",

    // DemoStage
    "demo.eyebrow": "交互演示 · 三个场景",
    "demo.title1": "看见",
    "demo.title2": "一个不需要触碰的界面。",
    "demo.hint": "用鼠标模拟你的视线：悬停在卡片上 800 毫秒即可选中。和真实的一瞥一样快。",
    "demo.scene.schedule": "日程",
    "demo.scene.message": "消息",
    "demo.scene.navigate": "导航",
    "demo.scene.schedule.cap": "看一眼展开，挥一下确认。",
    "demo.scene.message.cap": "通知轻柔浮现，开口即可回复。",
    "demo.scene.navigate.cap": "转个头，标签跟着你走。",
    "demo.fov": "视场 110°",

    // Schedule scene
    "sch.morning": "周二 · 上午",
    "sch.task1": "晨会 · 工程团队",
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
    "msg.body": "11 点的咖啡还去吗？我先占了个角落的位子。",
    "msg.lookSpeak": "看着 + 开口说",
    "msg.reply": "「马上到，两分钟。」",
    "msg.voice": "语音回复",
    "msg.dismiss": "忽略",
    "msg.mute": "免打扰 Mira · 1 小时",
    "msg.share": "分享位置",
    "msg.sent": "已发送 · 「马上到，两分钟。」",

    // Navigate scene
    "nav.poi1": "Blue Bottle 咖啡",
    "nav.poi2": "Halo 工作室",
    "nav.poi3": "Aurora 公园",
    "nav.heading": "朝向",
    "nav.dragHint": "拖拽模拟转头",

    // Hardware
    "hw.eyebrow": "硬件形态",
    "hw.title1": "两件设备。",
    "hw.title2": "一层隐于空气的界面。",
    "hw.body": "Halo OS 运行在通用硬件上：一副轻量波导眼镜，搭配任意蓝牙耳机。不需要新生态，不需要新习惯。",
    "hw.glasses.tag": "Halo Frames",
    "hw.glasses.title": "智能眼镜",
    "hw.g1k": "显示", "hw.g1v": "双目波导 · 1080p",
    "hw.g2k": "视场角", "hw.g2v": "110°",
    "hw.g3k": "重量", "hw.g3v": "62 克",
    "hw.g4k": "续航", "hw.g4v": "8 小时日常混合使用",
    "hw.g5k": "输入方式", "hw.g5v": "视线 · 语音 · 手势",
    "hw.buds.tag": "Halo Buds",
    "hw.buds.title": "无线耳机",
    "hw.b1k": "驱动单元", "hw.b1v": "11 mm 动圈",
    "hw.b2k": "延迟", "hw.b2v": "< 60 ms",
    "hw.b3k": "编解码", "hw.b3v": "LC3 · aptX Adaptive",
    "hw.b4k": "续航", "hw.b4v": "单次 6 小时 + 充电盒 24 小时",
    "hw.b5k": "麦克风", "hw.b5v": "双麦阵列 · 波束成形",
    "hw.gen": "Gen 01",

    // Ambient states
    "amb.eyebrow": "环境语言",
    "amb.title1": "四种状态。",
    "amb.title2": "这就是整个界面。",
    "amb.body": "Halo 不给你桌面、不给你 App 列表。它只告诉你：我在听、我在想、我在做——其余时间，它安静退场。",
    "amb.idle.t": "待机", "amb.idle.b": "视野角落一粒温和的微光。无声无息，但你知道它在。",
    "amb.listening.t": "在听", "amb.listening.b": "青色光环缓缓收拢，耳机传来一声轻响——它听见你了。",
    "amb.thinking.t": "理解中", "amb.thinking.b": "光点转为暖色并旋转，Halo 正在解析你的意图——视野不会被任何东西阻挡。",
    "amb.acting.t": "执行中", "amb.acting.b": "一道青色脉冲闪过，随即消散。任务完成，信息自行退场。",

    // TechSpecs
    "ts.eyebrow": "系统架构",
    "ts.title": "为你的余光而设计。",
    "ts.r1k": "输入", "ts.r1v": "眼动追踪 · 语音 · 微手势 · 轻点头",
    "ts.r2k": "输出", "ts.r2v": "双目波导 HUD · 空间音频 · 镜腿触觉反馈",
    "ts.r3k": "延迟", "ts.r3v": "唤醒到渲染 110 ms · 注视选择 800 ms",
    "ts.r4k": "隐私", "ts.r4v": "端侧语音识别 · 加密传输 · 摄像头物理指示灯",
    "ts.r5k": "运行时", "ts.r5v": "Halo Core · 40 亿参数 · 端侧量化推理",
    "ts.r6k": "开发者", "ts.r6v": "TypeScript SDK · 意图 API · 环境卡片协议",

    // CTA
    "cta.eyebrow": "首批预约",
    "cta.title1": "抬起头来。",
    "cta.title2": "操作系统向你走来。",
    "cta.body": "首批限定 5,000 名创始用户，第四季度发货。不需要手机。",
    "cta.placeholder": "you@somewhere.co",
    "cta.btn": "立即预约",
    "cta.sent": "已预约 · 我们会尽快联系你",
    "cta.demoLink": "或者先体验交互演示 →",

    // Footer
    "ft.ver": "v0.1 · 概念原型",
    "ft.copy": "© 2026 · 一次关于环境计算的探索",

    // Demo page
    "demoPage.eyebrow": "交互原型",
    "demoPage.title": "Halo OS · 演示",
    "demoPage.body": "鼠标就是你的视线。悬停 800 毫秒即为注视选择。在下方切换「日程 / 消息 / 导航」三个场景。",

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

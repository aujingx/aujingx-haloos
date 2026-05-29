import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;
type Dicts = Record<Locale, Dict>;

const dict: Dicts = {
  en: {
    // Nav
    "nav.demo": "Demo",
    "nav.presence": "Sense",
    "nav.trigger": "Wake",
    "nav.emergence": "Notify",
    "nav.action": "Act",
    "nav.multi": "Orchestrate",
    "nav.tryDemo": "Open demo",
    "nav.langToggle": "中",

    // Hero
    "hero.eyebrow": "Halo OS",
    "hero.title1": "Give the agent a body.",
    "hero.title2": "Put the apps away.",
    "hero.body": "No apps to open. Just one agent, in the room with you. Watch how it behaves.",
    "hero.cta": "Open the demo",

    // Five scenes
    "fq.eyebrow": "Five scenes",
    "fq.title": "What's left when the apps are gone.",
    "fq.q1.t": "Sense",
    "fq.q1.b": "How it knows you're there.",
    "fq.q2.t": "Wake",
    "fq.q2.b": "How it starts — without getting in the way.",
    "fq.q3.t": "Notify",
    "fq.q3.b": "How it reaches you — on whatever you're wearing, or nothing at all.",
    "fq.q4.t": "Act",
    "fq.q4.b": "How it helps inside the room — and how you stop it.",
    "fq.q5.t": "Orchestrate",
    "fq.q5.b": "Many devices. One plan. One voice.",

    // Demo stage shell
    "demo.eyebrow": "Demo",
    "demo.hint": "A small room. The robot is in it.",

    // Scene 1 · Sense
    "s1.label": "Sense",
    "s1.hint": "Try a channel. Watch the robot respond.",
    "s1.try.look": "Look at me",
    "s1.try.speak": "Speak",
    "s1.try.wave": "Wave",
    "s1.ch.vision": "Vision",
    "s1.ch.voice": "Voice",
    "s1.ch.gesture": "Gesture",
    "s1.cap.idle": "It's here. Watching. Listening. Reading your hand.",
    "s1.cap.vision": "Saw you. Eyes met.",
    "s1.cap.voice": "Heard you.",
    "s1.cap.gesture": "Caught the gesture.",
    "s1.voiceText": "Hi.",

    // Scene 2 · Wake
    "s2.label": "Wake",
    "s2.case1": "\"A bit cold in here.\"",
    "s2.case2": "Pulled the jacket tighter. Glanced at the window.",
    "s2.case3": "Did nothing.",
    "s2.r1": "Got it. Closing the window.",
    "s2.r2q": "Close the window?",
    "s2.r2note": "Ignore it — it slips away in 3 s.",
    "s2.r3": "(Stays quiet.)",
    "s2.r3sub": "Guest arriving soon. Heat +1°C.",
    "s2.r3undo": "Undo",

    // Scene 3 · Notify (rebuilt — three surfaces)
    "s3.label": "Notify",
    "s3.hint": "Pick what you're wearing.",
    "s3.surface.none": "Nothing on you",
    "s3.surface.glasses": "Smart glasses",
    "s3.surface.watch": "Watch",
    "s3.play": "Play 30 seconds",
    "s3.replay": "Replay",
    // Three messages, three surfaces, three intensities
    "s3.m1.glasses": "Someone at the door",
    "s3.m1.watch": "At the door",
    "s3.m2.glasses": "Lin · movie tonight?",
    "s3.m2.watch": "Lin: movie?",
    "s3.m3.note": "1 push held back",
    "s3.none.idle": "No screen. The robot is the surface.",
    "s3.none.m1": "Soft chime. Eye turns toward the door.",
    "s3.none.m2": "Quiet voice: Lin asked about a movie tonight.",
    "s3.glasses.idle": "Cards slide in at the edge of vision. Fade in 3 s.",
    "s3.watch.idle": "A tap on the wrist. One line, then gone.",

    // Scene 4 · Act (rebuilt — "find my phone")
    "s4.label": "Act",
    "s4.mic": "Hold to speak",
    "s4.micNote": "(In real life: just talk to it.)",
    "s4.youText": "Help me find my phone.",
    "s4.n1": "Looking for your phone.",
    "s4.n2": "Checking the sofa, the table, the entryway, the bedroom.",
    "s4.n3": "Picking up a Bluetooth ping near the sofa.",
    "s4.n4": "It's under the cushion on the left.",
    "s4.n5": "I'll stay here. Light pointing at it.",
    "s4.done": "Found it.",
    "s4.stop": "Raise hand to stop",
    "s4.stopNote": "(In real life: raise a hand, or just say \"stop\".)",
    "s4.stopped": "Stopped. Anything else?",
    "s4.reset": "Run again",
    // Search zones
    "s4.zone.sofa": "Sofa",
    "s4.zone.table": "Coffee table",
    "s4.zone.entry": "Entryway",
    "s4.zone.bedroom": "Bedroom",

    // Scene 5 · Orchestrate (rebuilt — 7 parallel tasks)
    "s5.label": "Orchestrate",
    "s5.play": "I'm heading out to see a client. Back by 9.",
    "s5.mic": "Hold to speak",
    "s5.tagline": "Seven things at once. It only interrupts when it needs you.",
    // Node labels
    "s5.n.car": "Car",
    "s5.n.safety": "Home safety",
    "s5.n.hvac": "AC",
    "s5.n.vacuum": "Vacuum",
    "s5.n.docs": "Files",
    "s5.n.msg": "Message",
    "s5.n.risk": "Heads-up",
    // Tasks per node
    "s5.car.1": "Pre-cooling cabin",
    "s5.car.2": "Route planned · 14 min",
    "s5.car.3": "Battery 18% — short for round-trip",
    "s5.safety.1": "Gas valve closed",
    "s5.safety.2": "Non-essential outlets off",
    "s5.hvac.1": "Switched to away mode",
    "s5.hvac.2": "Pre-cool scheduled · 8:40 PM",
    "s5.vacuum.1": "Standby — starts when you leave",
    "s5.vacuum.2": "Cleaning living room",
    "s5.docs.1": "Pitch deck · ready",
    "s5.docs.2": "Quote v3 · ready",
    "s5.docs.3": "Appendix B missing",
    "s5.msg.1": "\"On my way. See you soon.\" — sent",
    "s5.msg.2": "Read 2 min ago",
    // Risk bubble (only thing that interrupts)
    "s5.risk.title": "Two things need you.",
    "s5.risk.1": "Car battery too low for the round-trip. Charge on the way?",
    "s5.risk.2": "Appendix B is missing from the deck. Skip or fetch?",
    "s5.risk.ok": "OK",

    // Closer
    "closer.line": "one agent, no apps.",

    // Footer
    "ft.ver": "v0.3",
    "ft.copy": "© 2026 · An exploration of post-app interaction",

    // Orb labels
    "orb.idle": "Here",
    "orb.listening": "Listening",
    "orb.thinking": "Thinking",
    "orb.acting": "Acting",
    "orb.handoff": "Over to you",
    "orb.waiting": "Hold on",
    "orb.brand": "Halo",

    // Demo page (legacy /demo)
    "demoPage.eyebrow": "Demo",
    "demoPage.title": "Halo OS",
    "demoPage.body": "Five scenes.",
  },
  zh: {
    "nav.demo": "演示",
    "nav.presence": "感知",
    "nav.trigger": "唤起",
    "nav.emergence": "提示",
    "nav.action": "执行",
    "nav.multi": "协同",
    "nav.tryDemo": "看演示",
    "nav.langToggle": "EN",

    "hero.eyebrow": "Halo OS",
    "hero.title1": "把身体，给 Agent。",
    "hero.title2": "把 App，收起来。",
    "hero.body": "不用打开任何 App。屋里就一台机器人，陪着你。看看它会怎么做。",
    "hero.cta": "开始演示",

    "fq.eyebrow": "五个场景",
    "fq.title": "没有 App 的那一天。",
    "fq.q1.t": "感知",
    "fq.q1.b": "它怎么知道你在。",
    "fq.q2.t": "唤起",
    "fq.q2.b": "怎么开口，怎么不打扰。",
    "fq.q3.t": "提示",
    "fq.q3.b": "你戴着什么，它就用什么提醒你。",
    "fq.q4.t": "执行",
    "fq.q4.b": "它能在屋里帮你做什么。怎么叫停。",
    "fq.q5.t": "协同",
    "fq.q5.b": "几台设备，一个安排，一个声音。",

    "demo.eyebrow": "演示",
    "demo.hint": "一间屋子。机器人在里面。",

    // Scene 1
    "s1.label": "感知",
    "s1.hint": "点一下，看它怎么回应。",
    "s1.try.look": "看着它",
    "s1.try.speak": "说话",
    "s1.try.wave": "挥手",
    "s1.ch.vision": "视觉",
    "s1.ch.voice": "听觉",
    "s1.ch.gesture": "手势",
    "s1.cap.idle": "它在。看着你，听着你，留意你的手。",
    "s1.cap.vision": "看见你了。目光对上了。",
    "s1.cap.voice": "听见了。",
    "s1.cap.gesture": "看到你的手势了。",
    "s1.voiceText": "嗨。",

    // Scene 2
    "s2.label": "唤起",
    "s2.case1": "「有点冷。」",
    "s2.case2": "把外套裹紧了。又看了眼窗户。",
    "s2.case3": "什么也没做。",
    "s2.r1": "好的。去把窗户关上。",
    "s2.r2q": "要关窗吗？",
    "s2.r2note": "不理它，3 秒后就走。",
    "s2.r3": "（保持安静。）",
    "s2.r3sub": "客人快到了。空调调高 1°C。",
    "s2.r3undo": "撤销",

    // Scene 3 · 提示
    "s3.label": "提示",
    "s3.hint": "选一个你身上有的。",
    "s3.surface.none": "什么都没戴",
    "s3.surface.glasses": "智能眼镜",
    "s3.surface.watch": "手表",
    "s3.play": "看这 30 秒",
    "s3.replay": "再看一次",
    "s3.m1.glasses": "门口有人",
    "s3.m1.watch": "门口有人",
    "s3.m2.glasses": "林夕 · 晚上看电影？",
    "s3.m2.watch": "林夕：看电影？",
    "s3.m3.note": "为你挡掉 1 条推送",
    "s3.none.idle": "没有屏幕。机器人就是出口。",
    "s3.none.m1": "轻轻一声。眼睛转向门口。",
    "s3.none.m2": "压低声音说：林夕问你今晚有没有空。",
    "s3.glasses.idle": "卡片从视野边缘滑进来。3 秒淡出。",
    "s3.watch.idle": "腕上一震。一行字，看完就消失。",

    // Scene 4 · 执行（找手机）
    "s4.label": "执行",
    "s4.mic": "按住说话",
    "s4.micNote": "（真实场景里：直接说就行。）",
    "s4.youText": "帮我找一下手机。",
    "s4.n1": "好，找手机。",
    "s4.n2": "看一下沙发、茶几、玄关、卧室。",
    "s4.n3": "沙发附近收到蓝牙信号。",
    "s4.n4": "在左边的靠垫底下。",
    "s4.n5": "我就停这儿。用灯照着它。",
    "s4.done": "找到了。",
    "s4.stop": "举手叫停",
    "s4.stopNote": "（真实场景里：抬一下手，或者说「停」。）",
    "s4.stopped": "停了。怎么了？",
    "s4.reset": "再来一次",
    "s4.zone.sofa": "沙发",
    "s4.zone.table": "茶几",
    "s4.zone.entry": "玄关",
    "s4.zone.bedroom": "卧室",

    // Scene 5 · 协同
    "s5.label": "协同",
    "s5.play": "我去见个客户，晚上 9 点回来。",
    "s5.mic": "按住说话",
    "s5.tagline": "七件事，同时办。只在该问你的时候，才打断你。",
    "s5.n.car": "车",
    "s5.n.safety": "家里安全",
    "s5.n.hvac": "空调",
    "s5.n.vacuum": "扫地机",
    "s5.n.docs": "资料",
    "s5.n.msg": "信息",
    "s5.n.risk": "要你拿主意",
    "s5.car.1": "车里先开冷气",
    "s5.car.2": "路线已规划 · 14 分钟",
    "s5.car.3": "电量 18%，往返不够",
    "s5.safety.1": "燃气关了",
    "s5.safety.2": "非必要插座断电",
    "s5.hvac.1": "切到离家模式",
    "s5.hvac.2": "晚上 8:40 提前回温",
    "s5.vacuum.1": "等你走了就开始",
    "s5.vacuum.2": "正在扫客厅",
    "s5.docs.1": "客户介绍 · 已就绪",
    "s5.docs.2": "报价单 v3 · 已就绪",
    "s5.docs.3": "附录 B 还缺",
    "s5.msg.1": "「我已经出发，稍后见。」已发",
    "s5.msg.2": "对方 2 分钟前看过",
    "s5.risk.title": "有两件事要你拿主意。",
    "s5.risk.1": "车电量不够往返，路上充一下吗？",
    "s5.risk.2": "资料还差一个附录 B，跳过还是去取？",
    "s5.risk.ok": "知道了",

    "closer.line": "one agent, no apps.",

    "ft.ver": "v0.3",
    "ft.copy": "© 2026 · 一次关于无 App 时代交互的探索",

    "orb.idle": "在",
    "orb.listening": "在听",
    "orb.thinking": "在想",
    "orb.acting": "在做",
    "orb.handoff": "看你",
    "orb.waiting": "等你",
    "orb.brand": "Halo",

    "demoPage.eyebrow": "演示",
    "demoPage.title": "Halo OS",
    "demoPage.body": "五个场景。",
  },
};

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

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

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;
type Dicts = Record<Locale, Dict>;

const dict: Dicts = {
  en: {
    // Nav
    "nav.demo": "Demo",
    "nav.presence": "Presence",
    "nav.trigger": "Trigger",
    "nav.emergence": "Surface",
    "nav.action": "Action",
    "nav.multi": "Together",
    "nav.tryDemo": "Open demo",
    "nav.langToggle": "中",

    // Hero
    "hero.eyebrow": "Halo OS",
    "hero.title1": "Give the agent",
    "hero.title2": "a body.",
    "hero.body": "When apps stop being the entry point, what's left is a robot beside you. Five scenes show what that looks like.",
    "hero.cta": "Open the demo",

    // Five questions
    "fq.eyebrow": "Five scenes",
    "fq.title": "What's left after the apps.",
    "fq.q1.t": "Presence",
    "fq.q1.b": "How the robot knows you're there.",
    "fq.q2.t": "Trigger",
    "fq.q2.b": "How it starts — and stays out of the way.",
    "fq.q3.t": "Surface",
    "fq.q3.b": "How information reaches you, gently.",
    "fq.q4.t": "Action",
    "fq.q4.b": "How it acts. How you stop it.",
    "fq.q5.t": "Together",
    "fq.q5.b": "Several devices. One voice.",

    // Demo stage shell
    "demo.eyebrow": "Demo",
    "demo.hint": "A small room. The robot is in it.",

    // Scene 1 · Presence
    "s1.label": "Presence",
    "s1.hint": "Tap to show the robot how you reach it.",
    "s1.try.look": "Look at me",
    "s1.try.speak": "Speak",
    "s1.try.wave": "Wave",
    "s1.ch.vision": "Vision",
    "s1.ch.voice": "Voice",
    "s1.ch.gesture": "Gesture",
    "s1.cap.idle": "It's here. Always sensing — sight, sound, motion.",
    "s1.cap.vision": "Saw you. Eyes met.",
    "s1.cap.voice": "Heard you.",
    "s1.cap.gesture": "Caught your gesture.",
    "s1.voiceText": "Hi.",

    // Scene 2 · Trigger
    "s2.label": "Trigger",
    "s2.case1": "\"I'm a bit cold.\"",
    "s2.case2": "Pulled your coat tighter. Glanced at the window.",
    "s2.case3": "Did nothing.",
    "s2.r1": "Got it. Telling the window to close.",
    "s2.r1note": "Dispatched to the smart-home window.",
    "s2.r2q": "Close the window?",
    "s2.r2note": "Ignore it — it slips away in 3 s.",
    "s2.r3": "(Stays quiet.)",
    "s2.r3sub": "Guest arriving soon — heat +1°C.",
    "s2.r3undo": "Undo",

    // Scene 3 · Surface (light / sound / voice as output channels)
    "s3.label": "Surface",
    "s3.play": "Play 30 seconds",
    "s3.replay": "Replay",
    "s3.t1": "Water is boiling.",
    "s3.t2": "Lin: movie tonight?",
    "s3.t3": "Package — front desk will hold it.",
    "s3.filtered": "Held back 1 notification",
    "s3.legend.light": "light",
    "s3.legend.sound": "chime",
    "s3.legend.voice": "voice",

    // Scene 4 · Action — find my phone (no arms needed)
    "s4.label": "Action",
    "s4.mic": "Hold to speak",
    "s4.micNote": "(In real life: just talk to it.)",
    "s4.youText": "Where's my phone?",
    "s4.n1": "Heard you.",
    "s4.n2": "Last seen on the coffee table.",
    "s4.n3": "Going to check.",
    "s4.n4old": "Heading for the table.",
    "s4.n4new": "Check the kitchen first? — turning around.",
    "s4.n5": "Found it. Lighting it up for you.",
    "s4.done": "There.",
    "s4.stop": "Raise hand to stop",
    "s4.stopNote": "(In real life: raise a hand, or just say \"stop\".)",
    "s4.stopped": "Stopped. What would you like instead?",
    "s4.reset": "Run again",
    "s4.phoneLabel": "phone",

    // Scene 5 · Together
    "s5.label": "Together",
    "s5.play": "I'm leaving in 10 minutes.",
    "s5.home": "Home robot",
    "s5.car": "Car",
    "s5.watch": "Watch",
    "s5.lamp": "Lamp",
    "s5.home1": "Lights off",
    "s5.home2": "AC → away mode",
    "s5.car1": "Pre-conditioning",
    "s5.car2": "Route ready · 12 min",
    "s5.watch1": "Quiet tap on your wrist",
    "s5.watch2": "Reminder: take keys",
    "s5.lowbat": "Car's at 18% — not enough for the round trip. Charge on the way?",
    "s5.lowbatNote": "The car flagged it. The home robot speaks for all three — one voice.",
    "s5.pov.you": "You",
    "s5.pov.agent": "Agent",
    "s5.optional": "Optional: smart glasses",
    "s5.optionalTip": "If you have them, a tiny cue lands in your peripheral vision.",
    "s5.agent.heading": "Agent reasoning",
    "s5.agent.input": "Heard",
    "s5.agent.peers": "Polling peers",
    "s5.agent.decide": "Decision",
    "s5.agent.out": "One voice back",

    // Closing tagline
    "tagline.closing": "One agent, no apps.",

    // Footer
    "ft.ver": "v0.2",
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
    "nav.presence": "在场",
    "nav.trigger": "唤起",
    "nav.emergence": "浮现",
    "nav.action": "执行",
    "nav.multi": "协同",
    "nav.tryDemo": "进入演示",
    "nav.langToggle": "EN",

    "hero.eyebrow": "Halo OS",
    "hero.title1": "让 AI",
    "hero.title2": "走进现实。",
    "hero.body": "当 App 不再是入口，剩下的，是一个在你身边的机器人。下面五个场景，是它的样子。",
    "hero.cta": "开始演示",

    "fq.eyebrow": "五个场景",
    "fq.title": "没有 App 之后,剩下什么。",
    "fq.q1.t": "在场",
    "fq.q1.b": "机器人怎么知道你在。",
    "fq.q2.t": "唤起",
    "fq.q2.b": "怎么开始,怎么不打扰。",
    "fq.q3.t": "浮现",
    "fq.q3.b": "信息怎么刚好被你看到。",
    "fq.q4.t": "执行",
    "fq.q4.b": "它怎么动手,你怎么叫停。",
    "fq.q5.t": "协同",
    "fq.q5.b": "多个设备,同一个声音。",

    "demo.eyebrow": "演示",
    "demo.hint": "一间小屋。机器人在里面。",

    // Scene 1
    "s1.label": "在场",
    "s1.hint": "点一下,看看机器人能用哪些方式感知你。",
    "s1.try.look": "看着我",
    "s1.try.speak": "说话",
    "s1.try.wave": "挥手",
    "s1.ch.vision": "视觉",
    "s1.ch.voice": "语音",
    "s1.ch.gesture": "手势",
    "s1.cap.idle": "它在。看得见环境、听得见声音、留意你的动作。",
    "s1.cap.vision": "看见你了,目光对上了。",
    "s1.cap.voice": "听见你了。",
    "s1.cap.gesture": "注意到你的手势了。",
    "s1.voiceText": "嗨。",

    // Scene 2
    "s2.label": "唤起",
    "s2.case1": "「有点冷。」",
    "s2.case2": "裹紧外套,瞥了一眼窗户。",
    "s2.case3": "什么也没做。",
    "s2.r1": "好,让窗户合上。",
    "s2.r1note": "已指挥智能家居窗户关闭。",
    "s2.r2q": "要把窗合上吗?",
    "s2.r2note": "不理它,3 秒后自动消失。",
    "s2.r3": "(保持安静。)",
    "s2.r3sub": "客人快到了,暖气 +1°C。",
    "s2.r3undo": "撤销",

    // Scene 3
    "s3.label": "浮现",
    "s3.play": "开始这 30 秒",
    "s3.replay": "再看一次",
    "s3.t1": "水开了。",
    "s3.t2": "林夕:晚上一起看电影?",
    "s3.t3": "快递到了,让前台代收。",
    "s3.filtered": "已替你压住 1 条推送",
    "s3.legend.light": "灯光",
    "s3.legend.sound": "短音",
    "s3.legend.voice": "语音",

    // Scene 4 — 找手机
    "s4.label": "执行",
    "s4.mic": "按住说话",
    "s4.micNote": "(真实场景里:直接对它说就好。)",
    "s4.youText": "我手机放哪了?",
    "s4.n1": "听到了。",
    "s4.n2": "回想了一下,应该在茶几上。",
    "s4.n3": "过去看看。",
    "s4.n4old": "正往茶几那边走。",
    "s4.n4new": "你说先看厨房?转过去。",
    "s4.n5": "找到了,用灯指给你看。",
    "s4.done": "好了。",
    "s4.stop": "举手让它停",
    "s4.stopNote": "(真实场景里:抬一下手,或直接说「停」。)",
    "s4.stopped": "停下了。还有什么需要?",
    "s4.reset": "再来一次",
    "s4.phoneLabel": "手机",

    // Scene 5
    "s5.label": "协同",
    "s5.play": "我十分钟后要出门。",
    "s5.home": "家里的机器人",
    "s5.car": "车",
    "s5.watch": "手表",
    "s5.lamp": "灯",
    "s5.home1": "关灯",
    "s5.home2": "空调切到离家",
    "s5.car1": "开始预热",
    "s5.car2": "路线已规划,12 分钟",
    "s5.watch1": "在你手腕轻轻一震",
    "s5.watch2": "提醒你带钥匙",
    "s5.lowbat": "车里只剩 18%,往返不够。顺路充一下吗?",
    "s5.lowbatNote": "状态是车报的,家里的机器人替三方一起告诉你,只说一次。",
    "s5.pov.you": "你看到的",
    "s5.pov.agent": "Agent 的思路",
    "s5.optional": "可选:智能眼镜",
    "s5.optionalTip": "如果你戴着,会有一个极轻的提示落在视野边缘。",
    "s5.agent.heading": "Agent 推理",
    "s5.agent.input": "听到",
    "s5.agent.peers": "询问设备",
    "s5.agent.decide": "决定",
    "s5.agent.out": "只用一个声音回你",

    // Closing tagline
    "tagline.closing": "一个 Agent,再没有 App。",

    "ft.ver": "v0.2",
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

  // Reflect locale on <html lang>
  useEffect(() => {
    try { document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"; } catch {}
  }, [locale]);

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

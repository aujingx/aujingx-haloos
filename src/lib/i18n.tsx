import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

type Dict = Record<string, string>;
type Dicts = Record<Locale, Dict>;

const dict: Dicts = {
  zh: {
    // Nav
    "nav.demo": "演示",
    "nav.presence": "在场",
    "nav.trigger": "唤起",
    "nav.emergence": "浮现",
    "nav.action": "执行",
    "nav.multi": "协同",
    "nav.tryDemo": "进入演示",
    "nav.langToggle": "EN",

    // Hero
    "hero.eyebrow": "Halo OS",
    "hero.title1": "把身体给 Agent。",
    "hero.title2": "把 App 拿走。",
    "hero.body": "没有 App 之后，系统只剩一个 Agent 在你身边。下面五幕，是它的样子。",
    "hero.cta": "开始演示",

    // Five questions
    "fq.eyebrow": "五幕",
    "fq.title": "没有 App 之后，剩下什么。",
    "fq.q1.t": "在场",
    "fq.q1.b": "它怎么让你知道它在。",
    "fq.q2.t": "唤起",
    "fq.q2.b": "怎么开始，怎么不被误触。",
    "fq.q3.t": "浮现",
    "fq.q3.b": "信息怎么刚好被你看见。",
    "fq.q4.t": "执行",
    "fq.q4.b": "它怎么动手，你怎么叫停。",
    "fq.q5.t": "协同",
    "fq.q5.b": "几样东西一起准备，只对你说一次。",

    // Demo stage shell
    "demo.eyebrow": "演示",
    "demo.hint": "以下画面，都是你眼里看到的。",

    // Scene 1 · Presence
    "s1.label": "在场",
    "s1.firstHint": "动一下鼠标，那就是你的视线。",
    "s1.obj1": "杯子",
    "s1.obj2": "窗户",
    "s1.obj3": "机器人",

    // Scene 2 · Trigger
    "s2.label": "唤起",
    "s2.case1": "「有点冷。」",
    "s2.case2": "裹紧了外套，瞥了一眼窗户。",
    "s2.case3": "什么也没做。",
    "s2.r1": "好，关窗。",
    "s2.r2q": "要把窗关上吗？",
    "s2.r2note": "不理它，三秒后自己消失。",
    "s2.r3": "（不打扰。）",
    "s2.r3sub": "客人快到了，暖气 +1°C。",
    "s2.r3undo": "撤销",

    // Scene 3 · Emergence
    "s3.label": "浮现",
    "s3.play": "开始这 30 秒",
    "s3.replay": "再看一次",
    "s3.t1": "水开了。",
    "s3.t2": "林夕：晚上一起看电影？",
    "s3.t3": "快递到了，让前台代收。",
    "s3.filtered": "已为你隐去 1 条推送",

    // Scene 4 · Action
    "s4.label": "执行",
    "s4.mic": "按住说话",
    "s4.micNote": "（真实场景：直接说就好）",
    "s4.youText": "把桌上那杯水递给我。",
    "s4.n1": "看到你在沙发上。",
    "s4.n2": "桌上有一杯水，应该就是这个。",
    "s4.n3": "过去，绕开茶几。",
    "s4.n4old": "从右边过来。",
    "s4.n4new": "你换姿势了，改从左边过来。",
    "s4.n5": "递到你右手边。",
    "s4.done": "好了。",
    "s4.stop": "举手让它停",
    "s4.stopNote": "（真实场景：抬一下手，或者直接说「停」）",
    "s4.stopped": "停下了，要换个方式吗？",
    "s4.reset": "再来一次",

    // Scene 5 · Multi-agent
    "s5.label": "协同",
    "s5.play": "我十分钟后要出门。",
    "s5.glasses": "眼镜",
    "s5.home": "家",
    "s5.car": "车",
    "s5.home1": "关灯",
    "s5.home2": "空调进入离家",
    "s5.car1": "开始预热",
    "s5.car2": "路线已规划，12 分钟",
    "s5.glasses1": "整理会议材料",
    "s5.glasses2": "提醒你带钥匙",
    "s5.lowbat": "车电量只剩 18%，回程不够。顺路充一下吗？",
    "s5.lowbatNote": "这是车的状态，眼镜替它告诉你。只在一个地方说。",

    // Footer
    "ft.ver": "v0.2",
    "ft.copy": "© 2026 · 一次关于无 App 时代交互的探索",

    // Orb labels
    "orb.idle": "在",
    "orb.listening": "在听",
    "orb.thinking": "在想",
    "orb.acting": "在做",
    "orb.handoff": "看你",
    "orb.waiting": "等你",
    "orb.brand": "Halo",

    // Demo page (legacy /demo)
    "demoPage.eyebrow": "演示",
    "demoPage.title": "Halo OS",
    "demoPage.body": "下面是五幕。",
  },
  en: {
    "nav.demo": "Demo",
    "nav.presence": "Presence",
    "nav.trigger": "Trigger",
    "nav.emergence": "Emergence",
    "nav.action": "Action",
    "nav.multi": "Together",
    "nav.tryDemo": "Open demo",
    "nav.langToggle": "中",

    "hero.eyebrow": "Halo OS",
    "hero.title1": "Give the agent a body.",
    "hero.title2": "Take the apps away.",
    "hero.body": "After the apps fall away, the system is just one agent — beside you. Five scenes follow.",
    "hero.cta": "Open the demo",

    "fq.eyebrow": "Five scenes",
    "fq.title": "What's left after the apps.",
    "fq.q1.t": "Presence",
    "fq.q1.b": "How it lets you know it's there.",
    "fq.q2.t": "Trigger",
    "fq.q2.b": "How it starts. How it stays out of your way.",
    "fq.q3.t": "Emergence",
    "fq.q3.b": "How information reaches you, gently.",
    "fq.q4.t": "Action",
    "fq.q4.b": "How it acts. How you stop it.",
    "fq.q5.t": "Together",
    "fq.q5.b": "Several devices, one voice.",

    "demo.eyebrow": "Demo",
    "demo.hint": "Everything below is what you see.",

    "s1.label": "Presence",
    "s1.firstHint": "Move the mouse. That's your gaze.",
    "s1.obj1": "Cup",
    "s1.obj2": "Window",
    "s1.obj3": "Robot",

    "s2.label": "Trigger",
    "s2.case1": "\"I'm a bit cold.\"",
    "s2.case2": "Hugged your coat. Glanced at the window.",
    "s2.case3": "Did nothing.",
    "s2.r1": "Got it. Closing the window.",
    "s2.r2q": "Close the window?",
    "s2.r2note": "Ignore it and it slips away in 3 s.",
    "s2.r3": "(Stays out of the way.)",
    "s2.r3sub": "Guest in 10 min — heat +1°C.",
    "s2.r3undo": "Undo",

    "s3.label": "Emergence",
    "s3.play": "Play 30 seconds",
    "s3.replay": "Replay",
    "s3.t1": "Water is boiling.",
    "s3.t2": "Lin: movie tonight?",
    "s3.t3": "Package — front desk will hold it.",
    "s3.filtered": "Filtered 1 push",

    "s4.label": "Action",
    "s4.mic": "Hold to speak",
    "s4.micNote": "(Real world: just talk)",
    "s4.youText": "Bring me the glass of water on the table.",
    "s4.n1": "I see you on the sofa.",
    "s4.n2": "There's a glass on the table — that should be it.",
    "s4.n3": "Going over, around the coffee table.",
    "s4.n4old": "Coming from the right.",
    "s4.n4new": "You shifted — coming from the left instead.",
    "s4.n5": "Handing it to your right hand.",
    "s4.done": "There.",
    "s4.stop": "Raise hand to stop",
    "s4.stopNote": "(Real world: raise a hand, or just say \"stop\")",
    "s4.stopped": "Stopped. Try another way?",
    "s4.reset": "Run again",

    "s5.label": "Together",
    "s5.play": "I'm leaving in 10 minutes.",
    "s5.glasses": "Glasses",
    "s5.home": "Home",
    "s5.car": "Car",
    "s5.home1": "Lights off",
    "s5.home2": "AC → away",
    "s5.car1": "Pre-conditioning",
    "s5.car2": "Route ready · 12 min",
    "s5.glasses1": "Meeting notes pulled",
    "s5.glasses2": "Reminder: keys",
    "s5.lowbat": "Car's at 18% — not enough for the return. Stop to charge on the way?",
    "s5.lowbatNote": "That's the car's status. The glasses tell you for it. Only one voice.",

    "ft.ver": "v0.2",
    "ft.copy": "© 2026 · An exploration of post-app interaction",

    "orb.idle": "Here",
    "orb.listening": "Listening",
    "orb.thinking": "Thinking",
    "orb.acting": "Acting",
    "orb.handoff": "Over to you",
    "orb.waiting": "Hold on",
    "orb.brand": "Halo",

    "demoPage.eyebrow": "Demo",
    "demoPage.title": "Halo OS",
    "demoPage.body": "Five scenes.",
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

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
    "hero.eyebrow": "Halo OS · 终结点按式 OS",
    "hero.title1": "把身体给 Agent，",
    "hero.title2": "把 App 拿走。",
    "hero.body": "如果剥离所有 App，系统只剩下一个随时待命、能承接任务的 Agent——它如何在场、如何被唤起、如何让信息浮现、又如何在物理世界里替你动手。下面这五幕，是它的样子。",
    "hero.cta": "开始演示",

    // Five questions
    "fq.eyebrow": "五个问题，五幕回答",
    "fq.title": "没有 App 之后，剩下什么？",
    "fq.q1.t": "在场",
    "fq.q1.b": "没有图标，它怎么让你知道它在？",
    "fq.q2.t": "唤起",
    "fq.q2.b": "任务怎么被触发？发呆会不会被误触？",
    "fq.q3.t": "浮现",
    "fq.q3.b": "信息怎么刚好让你注意到？",
    "fq.q4.t": "执行",
    "fq.q4.b": "它怎么读懂场景、动手、随时叫停？",
    "fq.q5.t": "协同",
    "fq.q5.b": "几个身体怎么一起干活？",

    // Demo stage shell
    "demo.eyebrow": "可感知 Demo · 五幕",
    "demo.fov": "视场 110°",
    "demo.left": "人这一端",
    "demo.right": "Agent 这一端",
    "demo.answer": "这一幕回答了什么",

    // Scene 1 · Presence
    "s1.label": "在场",
    "s1.cap": "把鼠标当作你的视线，到处看看。",
    "s1.hint": "移动鼠标 = 视线方向。视野角落的微光、被你看的物体的描边、机器人胸口的光环，三处同步呼吸。对一个物体多看 1 秒，它就接住你。",
    "s1.obj1": "杯子",
    "s1.obj2": "窗户",
    "s1.obj3": "机器人",
    "s1.idle": "我在",
    "s1.listening": "我听见了",
    "s1.answer": "它不是一个图标，是空间里一直亮着的注意力。",

    // Scene 2 · Trigger
    "s2.label": "唤起",
    "s2.cap": "试试这三种状态，看 Agent 怎么反应。",
    "s2.mode1": "我明说了",
    "s2.mode1d": "「我有点冷。」",
    "s2.mode2": "我有点意思",
    "s2.mode2d": "裹紧衣服 + 瞥了眼窗户",
    "s2.mode3": "我在发呆",
    "s2.mode3d": "什么都没做",
    "s2.r1": "好，我去关窗。",
    "s2.r1note": "明确意图 → 直接做。",
    "s2.r2q": "要关窗吗？",
    "s2.r2hint": "3 秒不理会自动消失。错了你不理它就好，没有后果。",
    "s2.r2note": "不确定 → 问一句轻的，不阻塞。",
    "s2.r3": "（什么都没做。）",
    "s2.r3sub": "日程显示 10 分钟后有客人到——已悄悄把暖气 +1°C。撤销",
    "s2.r3note": "没信号 → 不打扰；除非你早立过契约，才会基于日程默默执行。",
    "s2.answer": "不确定时它选最不打扰你的那一档；发呆不会被误触发。",

    // Scene 3 · Emergence
    "s3.label": "浮现",
    "s3.cap": "30 秒内只有几条信息，看看它们怎么不一样地出现。",
    "s3.play": "开始这 30 秒",
    "s3.replay": "重放",
    "s3.t1": "水快烧开了",
    "s3.t1how": "炉灶方向轻轻染暖色 + 一声 1 秒短响。不出字。",
    "s3.t2": "小米：晚上还约吗？",
    "s3.t2how": "视野下沿浮一行小字，3 秒不理就自动收走。",
    "s3.t3": "快递到了",
    "s3.t3how": "已替你代办：请前台代收。3 秒可撤销。",
    "s3.filtered": "已为你过滤 1 条 · App 商城促销",
    "s3.filteredOpen": "查看",
    "s3.answer": "按「该不该打扰你」分三层：环境化 / 轻触 / 代办。同一时刻最多只让一条上前。",

    // Scene 4 · Action
    "s4.label": "执行",
    "s4.cap": "对机器人说一句话，它在做什么写成人话给你看。",
    "s4.mic": "按住说话",
    "s4.micNote": "（真实环境：直接说话）",
    "s4.micRel": "松开发送",
    "s4.you": "你说",
    "s4.youText": "帮我把桌上那杯水递过来。",
    "s4.n1": "看到你在沙发上。",
    "s4.n2": "桌上有一杯水，应该就是这个。",
    "s4.n3": "我先过去，绕开茶几。",
    "s4.n4old": "先从右边绕过去",
    "s4.n4new": "你换姿势了，我从左边过来。",
    "s4.n5": "拿稳了，递到你右手边。",
    "s4.done": "送到。",
    "s4.stop": "举手叫停",
    "s4.stopNote": "（真实环境：举手）",
    "s4.sayStop": "说「停」",
    "s4.sayStopNote": "（真实环境：直接说「停」）",
    "s4.stopped": "我停下了，要换个方式？",
    "s4.answer": "它的判断写成人话给你看，可以随时叫停、随时改主意。",
    "s4.reset": "重来一次",

    // Scene 5 · Multi-agent
    "s5.label": "协同",
    "s5.cap": "一句话，三个身体一起准备。",
    "s5.play": "我十分钟后要出门开会",
    "s5.glasses": "眼镜",
    "s5.home": "家居",
    "s5.car": "车",
    "s5.home1": "关客厅灯",
    "s5.home2": "空调切离家模式",
    "s5.car1": "开始预热",
    "s5.car2": "规划路线 · 12 分钟",
    "s5.glasses1": "抓会议材料",
    "s5.glasses2": "确认你拿了钥匙",
    "s5.lowbat": "电量只有 18%，回程不够。要不要顺路充？",
    "s5.lowbatNote": "车把这个状态汇报给眼镜，由眼镜统一告诉你。",
    "s5.answer": "不是多个 App 在协作，是一个 Agent 借用多个身体——只在一个地方汇报给你。",
    "s5.reset": "重新开始",

    // Footer
    "ft.ver": "v0.2 · 可感知原型",
    "ft.copy": "© 2026 · 一次关于无 App 时代交互的探索",

    // Orb labels
    "orb.idle": "待机",
    "orb.listening": "在听",
    "orb.thinking": "理解中",
    "orb.acting": "执行中",
    "orb.handoff": "等你说一声",
    "orb.waiting": "等你一下",
    "orb.brand": "Halo",

    // Demo page (legacy /demo)
    "demoPage.eyebrow": "可感知原型",
    "demoPage.title": "Halo OS · 演示",
    "demoPage.body": "切到下方任意一幕，看 Agent 如何在场、如何被唤起、如何让信息浮现、如何动手、以及如何协同。",
  },
  en: {
    "nav.demo": "Demo",
    "nav.presence": "Presence",
    "nav.trigger": "Trigger",
    "nav.emergence": "Emergence",
    "nav.action": "Action",
    "nav.multi": "Multi",
    "nav.tryDemo": "Open demo",
    "nav.langToggle": "中",

    "hero.eyebrow": "Halo OS · The post-tap OS",
    "hero.title1": "Give the agent a body.",
    "hero.title2": "Take the apps away.",
    "hero.body": "If every app falls away and the system is just one agent — always on, always ready — how does it exist? How is it triggered? How does information surface? How does it act in the physical world? The five scenes below are its answer.",
    "hero.cta": "Open the demo",

    "fq.eyebrow": "Five questions · Five scenes",
    "fq.title": "What's left after the apps?",
    "fq.q1.t": "Presence",
    "fq.q1.b": "No icon. How do you know it's there?",
    "fq.q2.t": "Trigger",
    "fq.q2.b": "What starts a task? What if you're just zoning out?",
    "fq.q3.t": "Emergence",
    "fq.q3.b": "How does information get noticed — without being noisy?",
    "fq.q4.t": "Action",
    "fq.q4.b": "How does it read the scene, act, and let you stop it?",
    "fq.q5.t": "Multi",
    "fq.q5.b": "How do several bodies work together?",

    "demo.eyebrow": "Perceivable demo · five scenes",
    "demo.fov": "FOV 110°",
    "demo.left": "Your side",
    "demo.right": "Agent's side",
    "demo.answer": "What this scene answers",

    "s1.label": "Presence",
    "s1.cap": "Move the mouse — that's your gaze.",
    "s1.hint": "Three things breathe in sync: a glow in the corner of view, a faint outline on whatever you look at, and a halo on the robot's chest. Look at something for 1 second and it answers.",
    "s1.obj1": "Cup",
    "s1.obj2": "Window",
    "s1.obj3": "Robot",
    "s1.idle": "Here",
    "s1.listening": "I see you",
    "s1.answer": "It isn't an icon. It's ambient attention, always on in the space around you.",

    "s2.label": "Trigger",
    "s2.cap": "Try the three modes. See how the agent reacts.",
    "s2.mode1": "I said it",
    "s2.mode1d": "\"I'm a bit cold.\"",
    "s2.mode2": "Maybe something",
    "s2.mode2d": "You hug your coat + glance at the window",
    "s2.mode3": "Zoning out",
    "s2.mode3d": "Nothing happened",
    "s2.r1": "Okay, I'll close the window.",
    "s2.r1note": "Clear intent → just do it.",
    "s2.r2q": "Close the window?",
    "s2.r2hint": "Disappears in 3 s if you ignore it. No consequence if it guessed wrong.",
    "s2.r2note": "Uncertain → ask softly, don't block.",
    "s2.r3": "(Does nothing.)",
    "s2.r3sub": "Calendar shows a guest in 10 min — quietly bumped the heat +1°C. Undo",
    "s2.r3note": "No signal → don't disturb; only act on a prior contract, like a calendar.",
    "s2.answer": "When unsure, it picks the least intrusive option. Zoning out won't trigger it.",

    "s3.label": "Emergence",
    "s3.cap": "Only a handful of things in 30 s. Watch how differently each shows up.",
    "s3.play": "Play the 30 seconds",
    "s3.replay": "Replay",
    "s3.t1": "Water is about to boil",
    "s3.t1how": "Tint the kitchen direction warm + a soft 1-second tone. No text.",
    "s3.t2": "Mira: still on for tonight?",
    "s3.t2how": "A single line at the bottom of view for 3 s. Ignore it and it goes away.",
    "s3.t3": "Package arrived",
    "s3.t3how": "Asked the front desk to hold it. 3 s to undo.",
    "s3.filtered": "Filtered 1 · App store promo",
    "s3.filteredOpen": "Open",
    "s3.answer": "Information is tiered by 'should this interrupt you' — ambient / soft / acted-on. Only one steps forward at a time.",

    "s4.label": "Action",
    "s4.cap": "Speak to the robot. Its reasoning is written in plain words for you.",
    "s4.mic": "Hold to speak",
    "s4.micNote": "(Real world: just talk)",
    "s4.micRel": "Release to send",
    "s4.you": "You said",
    "s4.youText": "Bring me the glass of water on the table.",
    "s4.n1": "I see you on the sofa.",
    "s4.n2": "There's a glass on the table — that should be the one.",
    "s4.n3": "Going over, going around the coffee table.",
    "s4.n4old": "Coming from the right",
    "s4.n4new": "You shifted — coming from the left instead.",
    "s4.n5": "Steady. Handing it to your right hand.",
    "s4.done": "There you go.",
    "s4.stop": "Raise hand to stop",
    "s4.stopNote": "(Real world: raise your hand)",
    "s4.sayStop": "Say \"stop\"",
    "s4.sayStopNote": "(Real world: just say \"stop\")",
    "s4.stopped": "I've stopped. Want me to try another way?",
    "s4.answer": "Its judgement is written in plain words for you, interruptible at any moment, free to change its mind.",
    "s4.reset": "Run again",

    "s5.label": "Multi",
    "s5.cap": "One sentence. Three bodies prepare in parallel.",
    "s5.play": "I'm leaving for a meeting in 10 minutes",
    "s5.glasses": "Glasses",
    "s5.home": "Home",
    "s5.car": "Car",
    "s5.home1": "Lights off",
    "s5.home2": "AC → away mode",
    "s5.car1": "Pre-conditioning",
    "s5.car2": "Route planned · 12 min",
    "s5.glasses1": "Pulling meeting notes",
    "s5.glasses2": "Reminding you to grab keys",
    "s5.lowbat": "Battery at 18%, not enough to return. Stop to charge on the way?",
    "s5.lowbatNote": "The car reports this to the glasses. Only the glasses speak to you.",
    "s5.answer": "It isn't apps cooperating — it's one agent borrowing several bodies. It speaks to you from one place.",
    "s5.reset": "Restart",

    "ft.ver": "v0.2 · Perceivable prototype",
    "ft.copy": "© 2026 · An exploration of post-app interaction",

    "orb.idle": "Standing by",
    "orb.listening": "Listening",
    "orb.thinking": "Thinking",
    "orb.acting": "Acting",
    "orb.handoff": "Over to you",
    "orb.waiting": "Hold on",
    "orb.brand": "Halo",

    "demoPage.eyebrow": "Perceivable prototype",
    "demoPage.title": "Halo OS · Demo",
    "demoPage.body": "Switch between the five scenes below to see how the agent shows up, is triggered, surfaces information, acts, and coordinates.",
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

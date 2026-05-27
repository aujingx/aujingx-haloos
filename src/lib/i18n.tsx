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
    "hero.title1": "Give the agent a body.",
    "hero.title2": "Put the apps away.",
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
    "s1.cap.idle": "It's here. Eyes open, listening, watching for a hand.",
    "s1.cap.vision": "Saw you. Made eye contact.",
    "s1.cap.voice": "Heard you.",
    "s1.cap.gesture": "Noticed your hand.",
    "s1.voiceText": "Hi.",

    // Scene 2 · Trigger
    "s2.label": "Trigger",
    "s2.case1": "\"I'm a bit cold.\"",
    "s2.case2": "Pulled your coat tighter. Glanced at the window.",
    "s2.case3": "Did nothing.",
    "s2.r1": "Got it. Closing the window.",
    "s2.r2q": "Close the window?",
    "s2.r2note": "Ignore it — it slips away in 3 s.",
    "s2.r3": "(Stays quiet.)",
    "s2.r3sub": "Guest arriving soon — heat +1°C.",
    "s2.r3undo": "Undo",

    // Scene 3 · Surface
    "s3.label": "Surface",
    "s3.play": "Play 30 seconds",
    "s3.replay": "Replay",
    "s3.t1": "Water is boiling.",
    "s3.t2": "Lin: movie tonight?",
    "s3.t3": "Package — front desk will hold it.",
    "s3.filtered": "Filtered 1 push",

    // Scene 4 · Action
    "s4.label": "Action",
    "s4.mic": "Hold to speak",
    "s4.micNote": "(In real life: just talk to it.)",
    "s4.youText": "Bring me the cup on the table.",
    "s4.n1": "I see you on the sofa.",
    "s4.n2": "There's a cup on the table — that's the one.",
    "s4.n3": "Heading over, going around the table.",
    "s4.n4old": "Approaching from your right.",
    "s4.n4new": "You shifted — coming from the left instead.",
    "s4.n5": "Handing it to your right hand.",
    "s4.done": "There.",
    "s4.stop": "Raise hand to stop",
    "s4.stopNote": "(In real life: raise a hand, or just say \"stop\".)",
    "s4.stopped": "Stopped. What would you like instead?",
    "s4.reset": "Run again",

    // Scene 5 · Together
    "s5.label": "Together",
    "s5.play": "I'm leaving in 10 minutes.",
    "s5.glasses": "Phone",
    "s5.home": "Home robot",
    "s5.car": "Car",
    "s5.home1": "Lights off",
    "s5.home2": "AC → away mode",
    "s5.car1": "Pre-conditioning",
    "s5.car2": "Route ready · 12 min",
    "s5.glasses1": "Meeting notes ready",
    "s5.glasses2": "Reminder: take keys",
    "s5.lowbat": "Car's at 18% — not enough for the round trip. Charge on the way?",
    "s5.lowbatNote": "The car flagged it. The home robot speaks for all three — one voice.",

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
    "hero.title1": "把身体给 Agent。",
    "hero.title2": "把 App 拿走。",
    "hero.body": "当 App 不再是入口，剩下的，是一个在你身边的机器人。下面五个场景，是它的样子。",
    "hero.cta": "开始演示",

    "fq.eyebrow": "五个场景",
    "fq.title": "没有 App 之后，剩下什么。",
    "fq.q1.t": "在场",
    "fq.q1.b": "机器人怎么知道你在。",
    "fq.q2.t": "唤起",
    "fq.q2.b": "怎么开始，怎么不打扰。",
    "fq.q3.t": "浮现",
    "fq.q3.b": "信息怎么刚好被你看到。",
    "fq.q4.t": "执行",
    "fq.q4.b": "它怎么动手，你怎么叫停。",
    "fq.q5.t": "协同",
    "fq.q5.b": "多个设备，同一个声音。",

    "demo.eyebrow": "演示",
    "demo.hint": "一间小屋。机器人在里面。",

    // Scene 1
    "s1.label": "在场",
    "s1.hint": "点一下，看看你能用哪些方式让机器人知道你。",
    "s1.try.look": "看着我",
    "s1.try.speak": "说话",
    "s1.try.wave": "挥手",
    "s1.ch.vision": "视觉",
    "s1.ch.voice": "语音",
    "s1.ch.gesture": "手势",
    "s1.cap.idle": "它在。眼睛睁着，耳朵开着，留意你的动作。",
    "s1.cap.vision": "看见你了，目光对上了。",
    "s1.cap.voice": "听见你了。",
    "s1.cap.gesture": "注意到你的手了。",
    "s1.voiceText": "嗨。",

    // Scene 2
    "s2.label": "唤起",
    "s2.case1": "「有点冷。」",
    "s2.case2": "裹紧外套，瞥了一眼窗户。",
    "s2.case3": "什么也没做。",
    "s2.r1": "好，去把窗关上。",
    "s2.r2q": "要把窗关上吗？",
    "s2.r2note": "不理它，3 秒后自动消失。",
    "s2.r3": "（保持安静。）",
    "s2.r3sub": "客人快到了，暖气 +1°C。",
    "s2.r3undo": "撤销",

    // Scene 3
    "s3.label": "浮现",
    "s3.play": "开始这 30 秒",
    "s3.replay": "再看一次",
    "s3.t1": "水开了。",
    "s3.t2": "林夕：晚上一起看电影？",
    "s3.t3": "快递到了，让前台代收。",
    "s3.filtered": "已为你隐去 1 条推送",

    // Scene 4
    "s4.label": "执行",
    "s4.mic": "按住说话",
    "s4.micNote": "（真实场景里：直接对它说就好。）",
    "s4.youText": "把桌上那个杯子拿给我。",
    "s4.n1": "看到你在沙发上。",
    "s4.n2": "桌上有个杯子，应该就是这个。",
    "s4.n3": "过去，绕开茶几。",
    "s4.n4old": "从你右边过来。",
    "s4.n4new": "你换了姿势，改从左边过来。",
    "s4.n5": "递到你右手边。",
    "s4.done": "好了。",
    "s4.stop": "举手让它停",
    "s4.stopNote": "（真实场景里：抬一下手，或直接说「停」。）",
    "s4.stopped": "停下了。还有什么需要？",
    "s4.reset": "再来一次",

    // Scene 5
    "s5.label": "协同",
    "s5.play": "我十分钟后要出门。",
    "s5.glasses": "手机",
    "s5.home": "家里的机器人",
    "s5.car": "车",
    "s5.home1": "关灯",
    "s5.home2": "空调切到离家",
    "s5.car1": "开始预热",
    "s5.car2": "路线已规划，12 分钟",
    "s5.glasses1": "整理好会议材料",
    "s5.glasses2": "提醒你带钥匙",
    "s5.lowbat": "车里只剩 18%，往返不够。顺路充一下吗？",
    "s5.lowbatNote": "状态是车报的，家里的机器人替三方一起告诉你，只说一次。",

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

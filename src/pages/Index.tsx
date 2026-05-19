import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Application {
  id: number;
  username: string;
  email: string;
  name: string;
  tg: string;
  time: string;
}

// ─── Tariff Data ──────────────────────────────────────────────────────────────
const deRates = [
  {
    id: "GAMING-ZERO",
    price: 72,
    cpu: "50% AMD Ryzen 9 7950X3D",
    ram: "1.5 GB DDR4",
    ssd: "8 GB NVMe SSD",
    ports: "1 портов",
    backups: "0 бэкапов",
    dbs: "1 баз данных",
    featured: false,
  },
  {
    id: "GAMING-1",
    price: 141,
    cpu: "100% AMD Ryzen 9 7950X3D",
    ram: "3 GB DDR4",
    ssd: "15 GB NVMe SSD",
    ports: "2 портов",
    backups: "1 бэкапов",
    dbs: "1 баз данных",
    featured: true,
  },
  {
    id: "GAMING-2",
    price: 263,
    cpu: "175% AMD Ryzen 9 7950X3D",
    ram: "6 GB DDR4",
    ssd: "25 GB NVMe SSD",
    ports: "3 портов",
    backups: "1 бэкапов",
    dbs: "2 баз данных",
    featured: false,
  },
  {
    id: "GAMING-3",
    price: 520,
    cpu: "300% AMD Ryzen 9 7950X3D",
    ram: "12 GB DDR4",
    ssd: "50 GB NVMe SSD",
    ports: "5 портов",
    backups: "2 бэкапов",
    dbs: "3 баз данных",
    featured: false,
  },
  {
    id: "GAMING-PRO",
    price: 980,
    cpu: "600% AMD Ryzen 9 7950X3D",
    ram: "24 GB DDR4",
    ssd: "100 GB NVMe SSD",
    ports: "10 портов",
    backups: "5 бэкапов",
    dbs: "5 баз данных",
    featured: false,
  },
];

const ruRates = deRates.map((t) => ({
  ...t,
  price: Math.round(t.price * 1.5),
  id: t.id.replace("GAMING", "RU-GAMING"),
  cpu: t.cpu.replace("7950X3D", "5950X"),
}));

// ─── Particles ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 4,
}));



// ─── Component ────────────────────────────────────────────────────────────────
export default function Index() {
  const [region, setRegion] = useState<"DE" | "RU">("DE");
  const [showRegModal, setShowRegModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [promoUnlocked, setPromoUnlocked] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [regForm, setRegForm] = useState({ login: "", email: "", pass: "" });
  const [appForm, setAppForm] = useState({ username: "", email: "", name: "", tg: "" });
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const rates = region === "DE" ? deRates : ruRates;

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);



  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegister = () => {
    if (!regForm.login || !regForm.email || !regForm.pass) return;
    setIsRegistered(true);
    setShowRegModal(false);
    showNotif("Регистрация успешна! Добро пожаловать, " + regForm.login);
  };

  const handleAppSubmit = () => {
    if (!appForm.username || !appForm.email || !appForm.name || !appForm.tg) return;
    const newApp: Application = {
      id: Date.now(),
      username: appForm.username,
      email: appForm.email,
      name: appForm.name,
      tg: appForm.tg.startsWith("@") ? appForm.tg : "@" + appForm.tg,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem("astrix_applications", JSON.stringify(updated));
    setAppSubmitted(true);
    showNotif("Заявка отправлена! Мы свяжемся с вами.");
    setTimeout(() => {
      setShowAppModal(false);
      setAppSubmitted(false);
      setAppForm({ username: "", email: "", name: "", tg: "" });
    }, 2000);
  };

  const handlePromo = () => {
    if (promoCode.trim() === "HellwayYT2012s") {
      const saved = localStorage.getItem("astrix_applications");
      if (saved) setApplications(JSON.parse(saved));
      setPromoUnlocked(true);
      setShowPromoModal(false);
      setPromoError("");
      showNotif("Промокод активирован! Доступ к заявкам открыт.");
    } else {
      setPromoError("Неверный промокод. Попробуйте ещё раз.");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(168,85,247,${0.3 + Math.random() * 0.4})`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              boxShadow: `0 0 ${p.size * 3}px rgba(168,85,247,0.5)`,
            }}
          />
        ))}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Notification */}
      {notification && (
        <div
          className="fixed top-6 right-6 z-50 toast-notify gaming-card px-5 py-3 rounded-xl flex items-center gap-3"
          style={{ borderColor: "rgba(168,85,247,0.6)", boxShadow: "0 0 25px rgba(168,85,247,0.4)" }}
        >
          <div className="live-dot" />
          <span className="font-rajdhani font-semibold text-purple-200">{notification}</span>
        </div>
      )}

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: "rgba(8,8,16,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(168,85,247,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.6)" }}
              >
                <span className="text-white font-orbitron font-bold text-xs">A</span>
              </div>
              <div
                className="absolute -inset-1 rounded-lg opacity-30 animate-ping-slow"
                style={{ background: "rgba(168,85,247,0.4)" }}
              />
            </div>
            <span className="font-orbitron font-bold text-xl text-white" style={{ textShadow: "0 0 20px rgba(168,85,247,0.5)" }}>
              ASTRIX<span className="text-purple-400">.SU</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Тарифы", "О нас", "Контакты"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-rajdhani font-semibold text-sm tracking-wider text-gray-400 hover:text-purple-400 transition-colors uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPromoModal(true)}
              className="btn-outline-neon px-4 py-2 rounded-lg text-sm hidden sm:block"
            >
              Промокод
            </button>
            <button onClick={() => setShowAppModal(true)} className="btn-outline-neon px-4 py-2 rounded-lg text-sm">
              Заявка
            </button>
            {isRegistered ? (
              <a
                href="http://2.26.80.222"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon px-5 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Icon name="LayoutDashboard" size={14} />
                Панель
              </a>
            ) : (
              <button onClick={() => setShowRegModal(true)} className="btn-neon px-5 py-2 rounded-lg text-sm">
                Регистрация
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center hero-bg grid-pattern pt-16">
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(168,85,247,0.4)",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease",
            }}
          >
            <div className="live-dot" />
            <span className="font-rajdhani font-semibold text-purple-300 text-sm tracking-widest uppercase">
              Игровой хостинг нового уровня
            </span>
          </div>

          <h1
            className="font-orbitron font-black mb-6 leading-none"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease 0.2s",
            }}
          >
            <span className="text-white">ASTRIX</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.5))",
              }}
            >
              HOSTING
            </span>
          </h1>

          <p
            className="font-exo text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease 0.4s",
            }}
          >
            Мощные серверы с AMD Ryzen 9 7950X3D для Minecraft, CS2 и любых игровых проектов. Низкий пинг, максимальная надёжность.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease 0.6s",
            }}
          >
            <button
              onClick={() => document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-neon px-8 py-4 rounded-xl text-base flex items-center gap-3"
            >
              <Icon name="Zap" size={18} />
              Выбрать тариф
            </button>
            <button
              onClick={() => setShowRegModal(true)}
              className="btn-outline-neon px-8 py-4 rounded-xl text-base flex items-center gap-3"
            >
              <Icon name="UserPlus" size={18} />
              Зарегистрироваться
            </button>
          </div>

          <div
            className="flex flex-wrap justify-center gap-8 mt-16"
            style={{ opacity: heroVisible ? 1 : 0, transition: "all 0.8s ease 0.8s" }}
          >
            {[
              { val: "99.9%", label: "Uptime" },
              { val: "<2мс", label: "Пинг EU" },
              { val: "1000+", label: "Клиентов" },
              { val: "24/7", label: "Поддержка" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-orbitron font-bold text-3xl glow-purple-text" style={{ color: "#c084fc" }}>
                  {s.val}
                </div>
                <div className="font-rajdhani text-gray-500 text-sm uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float2">
          <span className="font-rajdhani text-xs text-purple-600 tracking-widest uppercase">Scroll</span>
          <Icon name="ChevronDown" size={20} className="text-purple-600" />
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────────────────────── */}
      <div
        className="py-3 overflow-hidden"
        style={{
          background: "rgba(124,58,237,0.15)",
          borderTop: "1px solid rgba(168,85,247,0.2)",
          borderBottom: "1px solid rgba(168,85,247,0.2)",
        }}
      >
        <div className="ticker-content gap-16">
          {Array.from({ length: 4 }, (_, i) =>
            ["AMD Ryzen 9 7950X3D", "NVMe SSD", "DDoS-защита", "Minecraft", "CS2", "Rust", "ARK", "Terraria", "99.9% Uptime", "Мгновенное развёртывание"].map(
              (item) => (
                <span
                  key={`${i}-${item}`}
                  className="font-rajdhani font-semibold text-purple-400 text-sm tracking-widest uppercase flex items-center gap-4"
                >
                  <span className="text-purple-600">◆</span> {item}
                </span>
              )
            )
          )}
        </div>
      </div>

      {/* ── TARIFFS ─────────────────────────────────────────────────────────── */}
      <section id="tariffs" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="purple-line mb-4" />
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
              <div>
                <h2 className="section-title text-3xl text-white">
                  Тарифы{" "}
                  <span style={{ color: "#a855f7" }}>({region === "DE" ? "Германия 🇩🇪" : "Россия 🇷🇺"})</span>
                </h2>
                <p className="font-exo text-gray-500 mt-2">Выберите подходящий план для вашего сервера</p>
              </div>
              <div
                className="flex items-center gap-1 p-1 rounded-xl"
                style={{ background: "rgba(19,19,42,0.8)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                {(["DE", "RU"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`px-5 py-2 rounded-lg font-rajdhani font-bold text-sm tracking-wider transition-all duration-300 ${region === r ? "tab-active" : "tab-inactive"}`}
                  >
                    {r === "DE" ? "🇩🇪 Германия" : "🇷🇺 Россия"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {rates.map((rate, idx) => (
              <div
                key={rate.id}
                className={`gaming-card rounded-2xl p-6 flex flex-col glow-border-hover ${rate.featured ? "gaming-card-featured" : ""}`}
                style={{ position: "relative" }}
              >
                {rate.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-rajdhani font-bold tracking-wider uppercase"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      boxShadow: "0 0 15px rgba(168,85,247,0.5)",
                      color: "white",
                    }}
                  >
                    Популярный
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Server" size={14} className="text-purple-500" />
                  <span className="font-rajdhani font-bold text-sm tracking-widest uppercase" style={{ color: "#a855f7" }}>
                    {rate.id}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="font-orbitron font-black text-4xl text-white">{rate.price}</span>
                  <span className="font-exo text-gray-500 text-sm ml-1">₽ / мес.</span>
                </div>

                <div className="flex-1 space-y-1 mb-6">
                  {[
                    { icon: "Cpu", label: "Процессор", val: rate.cpu },
                    { icon: "MemoryStick", label: "Память", val: rate.ram },
                    { icon: "HardDrive", label: "Хранилище", val: rate.ssd },
                    { icon: "Network", label: "Сеть", val: rate.ports },
                    { icon: "RefreshCw", label: "Бэкапы", val: rate.backups },
                    { icon: "Database", label: "Базы данных", val: rate.dbs },
                  ].map((spec) => (
                    <div key={spec.label} className="stat-row">
                      <Icon name={spec.icon as "Cpu"} size={13} className="text-purple-500 flex-shrink-0" fallback="Circle" />
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 font-exo">{spec.label}</div>
                        <div className="text-xs text-purple-200 font-semibold truncate">{spec.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://t.me/HellwayYT?text=${encodeURIComponent(`Привет! Хочу купить тариф ${rate.id} за ${rate.price}₽/мес.\n\nПроцессор: ${rate.cpu}\nПамять: ${rate.ram}\nХранилище: ${rate.ssd}\n\nПодскажи, как оформить?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Icon name="ShoppingCart" size={14} />
                  Перейти к покупке
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative z-10" style={{ background: "rgba(15,15,26,0.5)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="purple-line mb-4" />
          <h2 className="section-title text-3xl text-white mb-12">
            Почему <span style={{ color: "#a855f7" }}>ASTRIX</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "Zap", title: "Мгновённый запуск", desc: "Сервер разворачивается за 30 секунд. Никакого ожидания — сразу в игру." },
              { icon: "Shield", title: "DDoS защита", desc: "Профессиональная защита от атак до 1 Тбит/с без влияния на производительность." },
              { icon: "Clock", title: "99.9% Uptime SLA", desc: "Гарантируем бесперебойную работу. Компенсация при простое." },
              { icon: "Headphones", title: "Поддержка 24/7", desc: "Живые операторы в Telegram всегда готовы помочь с любым вопросом." },
              { icon: "RefreshCw", title: "Автобэкапы", desc: "Регулярные резервные копии вашего сервера. Восстановление в 1 клик." },
              { icon: "Globe", title: "Два региона", desc: "Серверы в Германии и России. Выбирайте оптимальный для ваших игроков." },
            ].map((f) => (
              <div key={f.title} className="gaming-card rounded-2xl p-6 glow-border-hover">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}
                >
                  <Icon name={f.icon as "Zap"} size={22} className="text-purple-400" fallback="Circle" />
                </div>
                <h3 className="font-rajdhani font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="font-exo text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE APPLICATIONS ───────────────────────────────────────────────── */}
      {promoUnlocked && (
        <section className="py-20 px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="purple-line mb-4" />
            <div className="flex items-center gap-4 mb-8">
              <h2 className="section-title text-3xl text-white">
                Заявки <span style={{ color: "#a855f7" }}>в реальном времени</span>
              </h2>
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
              >
                <div className="live-dot" />
                <span className="font-rajdhani text-xs text-green-400 font-semibold uppercase tracking-wider">LIVE</span>
              </div>
            </div>
            <div className="gaming-card rounded-2xl overflow-hidden">
              <div
                className="px-6 py-3 flex items-center justify-between"
                style={{ background: "rgba(124,58,237,0.15)", borderBottom: "1px solid rgba(168,85,247,0.2)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={14} className="text-purple-500" />
                  <span className="font-rajdhani font-semibold text-purple-300 text-sm uppercase tracking-wider">Заявки</span>
                </div>
                <span className="font-orbitron font-bold text-purple-400 text-sm">{applications.length} шт.</span>
              </div>
              {applications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icon name="Inbox" size={32} className="text-purple-800 mx-auto mb-3" />
                  <p className="font-rajdhani text-gray-600 uppercase tracking-wider text-sm">Заявок пока нет</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(168,85,247,0.1)" }}>
                  {applications.map((app, i) => (
                    <div
                      key={app.id}
                      className="px-6 py-4 hover:bg-purple-950/20 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                        >
                          <span className="font-orbitron font-bold text-xs text-white">{app.username[0].toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6 gap-y-1">
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">ID</span>
                            <div className="font-exo text-xs text-gray-400">#{String(app.id).slice(-6)}</div>
                          </div>
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">Время</span>
                            <div className="font-exo text-xs text-gray-400">{app.time}</div>
                          </div>
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">Имя</span>
                            <div className="font-exo text-sm text-white font-semibold">{app.name}</div>
                          </div>
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">Username</span>
                            <div className="font-exo text-sm text-purple-300">{app.username}</div>
                          </div>
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">Email</span>
                            <div className="font-exo text-sm text-gray-300 truncate">{app.email}</div>
                          </div>
                          <div>
                            <span className="font-rajdhani text-xs text-purple-600 uppercase tracking-wider">Telegram</span>
                            <a
                              href={`https://t.me/${app.tg.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-exo text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                            >
                              {app.tg}
                              <Icon name="ExternalLink" size={10} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="gaming-card rounded-3xl p-12"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(15,15,26,0.95) 100%)",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow: "0 0 60px rgba(124,58,237,0.2)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 30px rgba(168,85,247,0.5)" }}
            >
              <Icon name="Rocket" size={28} className="text-white" />
            </div>
            <h2 className="section-title text-3xl text-white mb-4">Готов к запуску?</h2>
            <p className="font-exo text-gray-400 mb-8 text-lg">
              Зарегистрируйтесь и получите доступ к панели управления серверами прямо сейчас.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegModal(true)}
                className="btn-neon px-8 py-4 rounded-xl text-base flex items-center gap-3"
              >
                <Icon name="UserPlus" size={18} />
                Создать аккаунт
              </button>
              <button
                onClick={() => setShowAppModal(true)}
                className="btn-outline-neon px-8 py-4 rounded-xl text-base flex items-center gap-3"
              >
                <Icon name="MessageSquare" size={18} />
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 py-10 px-6"
        style={{ background: "rgba(8,8,16,0.9)", borderTop: "1px solid rgba(168,85,247,0.15)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                <span className="text-white font-orbitron font-bold text-xs">A</span>
              </div>
              <div>
                <div className="font-orbitron font-bold text-white">ASTRIX.SU</div>
                <div className="font-exo text-xs text-gray-600">Игровой хостинг</div>
              </div>
            </div>
            <a
              href="https://t.me/AstrixHosting"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-rajdhani font-semibold text-gray-400 hover:text-purple-400 transition-colors group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}
              >
                <Icon name="Send" size={14} className="text-purple-500" />
              </div>
              @AstrixHosting
            </a>
            <div className="font-exo text-xs text-gray-700">© 2024 Astrix.su — Все права защищены</div>
          </div>
        </div>
      </footer>

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}

      {/* Registration Modal */}
      {showRegModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowRegModal(false)}
        >
          <div
            className="gaming-card rounded-2xl p-8 w-full max-w-md animate-scale-in"
            style={{ border: "1px solid rgba(168,85,247,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white">Регистрация</h3>
                <p className="font-exo text-gray-500 text-sm mt-1">Создайте аккаунт в ASTRIX</p>
              </div>
              <button onClick={() => setShowRegModal(false)} className="text-gray-600 hover:text-purple-400 transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: "login", label: "Логин", placeholder: "Ваш логин", type: "text" },
                { key: "email", label: "Email", placeholder: "email@example.com", type: "email" },
                { key: "pass", label: "Пароль", placeholder: "••••••••", type: "password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="font-rajdhani font-semibold text-sm text-purple-300 uppercase tracking-wider mb-1 block">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={regForm[f.key as keyof typeof regForm]}
                    onChange={(e) => setRegForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="input-gaming w-full px-4 py-3 rounded-xl text-white"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleRegister} className="btn-neon w-full py-3 rounded-xl mt-6 flex items-center justify-center gap-2">
              <Icon name="UserPlus" size={16} />
              Зарегистрироваться
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowAppModal(false)}
        >
          <div
            className="gaming-card rounded-2xl p-8 w-full max-w-md animate-scale-in"
            style={{ border: "1px solid rgba(168,85,247,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white">Оставить заявку</h3>
                <p className="font-exo text-gray-500 text-sm mt-1">Мы свяжемся с вами в течение часа</p>
              </div>
              <button onClick={() => setShowAppModal(false)} className="text-gray-600 hover:text-purple-400 transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            {appSubmitted ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}
                >
                  <Icon name="Check" size={28} className="text-green-400" />
                </div>
                <p className="font-orbitron font-bold text-white text-lg">Заявка отправлена!</p>
                <p className="font-exo text-gray-500 text-sm mt-2">Скоро свяжемся с вами</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {[
                    { key: "name", label: "Имя", placeholder: "Ваше имя", type: "text" },
                    { key: "username", label: "Username (никнейм)", placeholder: "Ваш игровой ник", type: "text" },
                    { key: "email", label: "Email", placeholder: "email@example.com", type: "email" },
                    { key: "tg", label: "Telegram", placeholder: "@username", type: "text" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="font-rajdhani font-semibold text-sm text-purple-300 uppercase tracking-wider mb-1 block">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={appForm[f.key as keyof typeof appForm]}
                        onChange={(e) => setAppForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="input-gaming w-full px-4 py-3 rounded-xl text-white"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAppSubmit}
                  className="btn-neon w-full py-3 rounded-xl mt-6 flex items-center justify-center gap-2"
                >
                  <Icon name="Send" size={16} />
                  Отправить заявку
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {showPromoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowPromoModal(false)}
        >
          <div
            className="gaming-card rounded-2xl p-8 w-full max-w-sm animate-scale-in"
            style={{ border: "1px solid rgba(168,85,247,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white">Промокод</h3>
                <p className="font-exo text-gray-500 text-sm mt-1">Введите код для получения доступа</p>
              </div>
              <button onClick={() => setShowPromoModal(false)} className="text-gray-600 hover:text-purple-400 transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div>
              <label className="font-rajdhani font-semibold text-sm text-purple-300 uppercase tracking-wider mb-1 block">
                Промокод
              </label>
              <input
                type="text"
                placeholder="Введите промокод..."
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                className="input-gaming w-full px-4 py-3 rounded-xl text-white"
              />
              {promoError && <p className="font-exo text-red-400 text-sm mt-2">{promoError}</p>}
            </div>
            <button
              onClick={handlePromo}
              className="btn-neon w-full py-3 rounded-xl mt-5 flex items-center justify-center gap-2"
            >
              <Icon name="Key" size={16} />
              Активировать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Check, Copy, CheckCheck, LogOut, QrCode } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";
import mbankQr from "@/assets/mbank-qr.jpg";

type ActualPlanType = "KIDS" | "ADULT" | "PERSONAL";

const BearSvg = () => (
  <svg
    className="w-6 h-6 text-emerald-400 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="13" r="7" />
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="17" cy="7" r="2.5" />
    <path d="M12 11v3" />
    <circle cx="12" cy="14" r="1" />
  </svg>
);

const BriefcaseSvg = () => (
  <svg
    className="w-6 h-6 text-emerald-400 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CrownSvg = () => (
  <svg
    className="w-6 h-6 text-emerald-400 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const PhoneSvg = () => (
  <svg
    className="w-4 h-4 text-emerald-400 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const InstagramSvg = () => (
  <svg
    className="w-4 h-4 text-emerald-400 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MBankBadge = () => (
  <div className="flex items-center gap-1.5 bg-[#00A651]/15 border border-[#00A651]/40 px-3 py-1 rounded-xl text-[#00A651] font-black tracking-wider text-xs shadow-sm">
    <span className="bg-[#00A651] text-black w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px]">
      M
    </span>
    <span>MBANK</span>
  </div>
);

export function SelectPlanPage() {
  const { logout, user } = useAuthStore();

  const [selectedPlan, setSelectedPlan] = useState<ActualPlanType>("ADULT");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const isSkippedUser = user?.level === "SKIPPED";

  const handleCopyAmount = () => {
    navigator.clipboard.writeText("3000");
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20 font-sans relative">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between border-b border-zinc-900">
        <Logo size="sm" />
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400">
            <span>Статус уровня:</span>
            <span
              className={
                isSkippedUser
                  ? "text-amber-400 font-bold"
                  : "text-emerald-400 font-bold"
              }
            >
              {isSkippedUser ? "Не определен (Пропущен)" : user?.level || "A1"}
            </span>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-rose-400 px-2 py-1 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center max-w-xl mx-auto mb-16 flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Выберите формат обучения
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Выберите актуальный тариф. Оплата производится через ручной перевод
            на MBank.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <div
            onClick={() => setSelectedPlan("KIDS")}
            className={`bg-zinc-950 rounded-3xl p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === "KIDS"
                ? "border-emerald-500 bg-emerald-950/10 shadow-2xl"
                : "border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 w-full">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <BearSvg />
                  <h3 className="text-lg xl:text-xl font-black text-white truncate">
                    Детский
                  </h3>
                </div>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="text-xl xl:text-2xl font-black text-white">
                    3500
                  </span>
                  <span className="text-xs font-bold text-zinc-500">СОМ</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Специальный курс для мягкого и увлекательного старта в
                английском.
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Увлекательные видеоуроки с анимацией и игровым подходом
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Твердая база (алфавит, произношение, базовые слова)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    PDF-материалы для распечатки (красочные прописи, чек-листы)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Пошаговая структура, удобная для контроля родителями
                  </span>
                </li>
              </ul>
            </div>
            <div
              className={`w-full py-3 rounded-2xl font-black text-xs text-center border transition-all ${selectedPlan === "KIDS" ? "bg-emerald-500 text-black border-emerald-500" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}
            >
              {selectedPlan === "KIDS"
                ? "Выбран этот тариф"
                : "Выбрать Детский"}
            </div>
          </div>

          <div
            onClick={() => setSelectedPlan("ADULT")}
            className={`bg-zinc-950 rounded-3xl p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === "ADULT"
                ? "border-emerald-500 bg-emerald-950/10 shadow-2xl"
                : "border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 w-full">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <BriefcaseSvg />
                  <h3 className="text-lg xl:text-xl font-black text-white truncate">
                    Взрослый
                  </h3>
                </div>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="text-xl xl:text-2xl font-black text-white">
                    3000
                  </span>
                  <span className="text-xs font-bold text-zinc-500">СОМ</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Готовая система для самостоятельного изучения: от грамматики до
                уверенного общения.
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Полная программа курса с разбором всех правил</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Практическая лексика для путешествий, работы и диалогов
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Рабочие тетради, шпаргалки и конспекты в PDF формате
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Обучение в своем темпе в любое удобное время</span>
                </li>
              </ul>
            </div>
            <div
              className={`w-full py-3 rounded-2xl font-black text-xs text-center border transition-all ${selectedPlan === "ADULT" ? "bg-emerald-500 text-black border-emerald-500" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}
            >
              {selectedPlan === "ADULT"
                ? "Выбран этот тариф"
                : "Выбрать Взрослый"}
            </div>
          </div>

          <div
            onClick={() => setSelectedPlan("PERSONAL")}
            className={`bg-zinc-950 rounded-3xl p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === "PERSONAL"
                ? "border-emerald-500 bg-emerald-950/10 shadow-2xl"
                : "border-zinc-800/80 hover:border-zinc-700"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-6 w-full">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <CrownSvg />
                  <h3 className="text-lg xl:text-xl font-black text-white truncate">
                    Персональный
                  </h3>
                </div>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="text-xl xl:text-2xl font-black text-white">
                    4500
                  </span>
                  <span className="text-xs font-bold text-zinc-500">СОМ</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Курс с максимальным погружением и личным сопровождением до
                результата.
              </p>
              <ul className="flex flex-col gap-3 text-sm text-zinc-300 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Всё наполнение и материалы тарифа «Взрослый»</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Личный куратор для проверки ДЗ и ответов на вопросы
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Постановка произношения через аудиосообщения</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Точечный фокус на ваши цели (собеседование, переписка)
                  </span>
                </li>
              </ul>
            </div>
            <div
              className={`w-full py-3 rounded-2xl font-black text-xs text-center border transition-all ${selectedPlan === "PERSONAL" ? "bg-emerald-500 text-black border-emerald-500" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}
            >
              {selectedPlan === "PERSONAL"
                ? "Выбран этот тариф"
                : "Выбрать Персональный"}
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black py-4 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-lg"
          >
            Перейти к оплате
          </button>
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900 max-w-3xl mx-auto">
          <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-zinc-800/80 flex flex-col gap-6 text-center shadow-xl">
            <div className="flex flex-col gap-1">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                Остались вопросы по выбору программы?
              </h4>
              <p className="text-xs text-zinc-400">
                Свяжитесь с нами напрямую — поможем подобрать тариф и провести
                оплату
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <a
                href="https://wa.me/393518654592"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 p-3.5 rounded-2xl transition-all text-xs font-mono tracking-tight"
              >
                <PhoneSvg />
                <span>+39 351 865 4592</span>
              </a>
              <a
                href="tel:+996502083426"
                className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 p-3.5 rounded-2xl transition-all text-xs font-mono tracking-tight"
              >
                <PhoneSvg />
                <span>+996 502 08 34 26</span>
              </a>
              <a
                href="https://www.instagram.com/english_tuning?igsh=MTRvMTJvcW9wbDJ2dw=="
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 p-3.5 rounded-2xl transition-all text-xs font-sans font-bold tracking-wide"
              >
                <InstagramSvg />
                <span>@english_tuning</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-md w-full p-8 border border-zinc-800 flex flex-col gap-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Оплата курса
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white text-base leading-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-center flex flex-col gap-1 py-1">
              <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                Сумма к переводу
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  3000
                </span>
                <span className="text-xl font-bold text-emerald-400">СОМ</span>
                <button
                  onClick={handleCopyAmount}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Скопировать сумму"
                >
                  {copiedAmount ? (
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 items-center">
              <div className="flex items-center justify-between w-full">
                <span className="text-zinc-300 text-xs font-medium">
                  Получатель:{" "}
                  <strong className="text-white font-bold">Эмир Ж.</strong>
                </span>
                <MBankBadge />
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-xl w-48 h-48 flex items-center justify-center select-none">
                <img
                  src={mbankQr}
                  alt="MBank QR"
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                Откройте приложение{" "}
                <span className="text-white font-bold">MBank</span>, нажмите на
                сканер QR-кодов и наведите камеру на этот экран.
              </p>
            </div>

            <a
              href="https://wa.me/996502083426?text=Здравствуйте,%20я%20оплатил(а)%20курс%20English%20Tuning.%20Вот%20мой%20чек:"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all text-center shadow-lg block cursor-pointer"
            >
              Я оплатил(а) — Отправить чек
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

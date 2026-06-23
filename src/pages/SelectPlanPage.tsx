import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import {
  paymentApi,
  type CreatePaymentResponse,
} from "@/modules/payment/api/paymentApi";
import { Check, Copy, CheckCheck, Loader2, LogOut } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";

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

export function SelectPlanPage() {
  const { logout, user, token, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<ActualPlanType>("ADULT");
  const [paymentData, setPaymentData] = useState<CreatePaymentResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const isSkippedUser = user?.level === "SKIPPED";

  const { data: profileData } = useQuery({
    queryKey: ["pollingUserProfile"],
    queryFn: () => paymentApi.getProfile(),
    enabled: !!paymentData,
    refetchInterval: 5000,
  });

  const isPaid =
    profileData?.activeTariff !== null &&
    profileData?.activeTariff !== undefined;

  const handleCreateInvoice = async () => {
    try {
      setIsLoading(true);
      const data = await paymentApi.createPayment(selectedPlan);
      setPaymentData(data);
    } catch (err) {
      alert("Ошибка при создании заявки");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, type: "AMOUNT" | "PHONE") => {
    navigator.clipboard.writeText(text);
    if (type === "AMOUNT") {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
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
            onClick={handleCreateInvoice}
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black py-4 rounded-2xl font-black text-sm transition-all cursor-pointer"
          >
            {isLoading ? "Формирование заявки..." : "Перейти к оплате"}
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

      {paymentData && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-3xl max-w-md w-full p-8 border border-zinc-800 flex flex-col gap-6 relative shadow-2xl">
            {isPaid ? (
              <div className="py-8 text-center flex flex-col gap-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black font-black text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">
                  Оплата успешно получена!
                </h3>
                <button
                  onClick={() => {
                    if (user && token)
                      setAuth(token, { ...user, isPaid: true });
                    navigate("/cabinet");
                  }}
                  className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Перейти к обучению
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ожидаем
                    поступления средств...
                  </span>
                  <button
                    onClick={() => setPaymentData(null)}
                    className="text-zinc-500 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center flex flex-col gap-1 py-2">
                  <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                    Сумма перевода
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {paymentData.amount}
                    </span>
                    <span className="text-lg font-bold text-emerald-400">
                      СОМ
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(String(paymentData.amount), "AMOUNT")
                      }
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedAmount ? (
                        <CheckCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest block text-center">
                    Реквизиты MBank
                  </span>
                  <div className="flex items-center justify-between bg-black/50 px-4 py-3 rounded-xl border border-zinc-900">
                    <span className="font-mono font-bold text-zinc-200 select-all">
                      {paymentData.phoneNumber || "+996 555 123 456"}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          paymentData.phoneNumber || "+996 555 123 456",
                          "PHONE",
                        )
                      }
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      {copiedPhone ? (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-4 flex gap-3 items-start text-xs text-rose-200 leading-relaxed">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <div>
                    <strong className="font-bold text-rose-400 uppercase tracking-wide block mb-0.5">
                      Внимание (Критично):
                    </strong>
                    Переведите сумму СТРОГО с копейками. Если вы округлите
                    платеж, система не сможет его распознать, и доступ не
                    откроется.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { testApi, type Question } from "@/modules/testing/api/testApi";
import { useTestSessionStore } from "@/modules/testing/store/useTestSessionStore";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { QuestionCard } from "@/modules/testing/ui/QuestionCard";
import { Loader2, ArrowRight, DoorOpen } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";

export function ActiveTestPage() {
  const { sessionId, setSessionId } = useTestSessionStore();
  const { user, token, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [stage, setStage] = useState<"CHOICE" | "TESTING" | "RESULT">("CHOICE");

  const [batchIndex, setBatchIndex] = useState(1);
  const [qIndexInBatch, setQIndexInBatch] = useState(0);

  const [batchQuestions, setBatchQuestions] = useState<Question[]>([]);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});
  const [confirmedLevel, setConfirmedLevel] = useState<string>("B2");

  const [isStarting, setIsStarting] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBatchFromServer = async (currentSessionId: number) => {
    setIsLoadingBatch(true);
    try {
      const data = await testApi.getNextBatch(currentSessionId);
      setBatchQuestions(data);
      setQIndexInBatch(0);
    } catch (err) {
      alert("Ошибка загрузки следующего блока вопросов");
    } finally {
      setIsLoadingBatch(false);
    }
  };

  const handleTakeTest = async () => {
    setIsStarting(true);
    try {
      const res = await testApi.startTest(user?.id || 100);
      setSessionId(res.id);
      setBatchIndex(1);
      setLocalAnswers({});
      setStage("TESTING");
      await loadBatchFromServer(res.id);
    } catch (err) {
      alert("Сбой запуска сессии тестирования на сервере");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSkipTest = () => {
    if (user && token) {
      setAuth(token, { ...user, level: "SKIPPED" });
    }
    navigate("/plan");
  };

  const handleSaveAnswer = (qId: number, optId: number) => {
    setLocalAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleNextQuestion = async () => {
    if (qIndexInBatch < batchQuestions.length - 1) {
      setQIndexInBatch((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const optionIds = batchQuestions
        .map((q) => localAnswers[q.id])
        .filter(Boolean) as number[];

      const activeSession = sessionId || 1;
      const res = await testApi.submitBatch(activeSession, {
        selectedOptionIds: optionIds,
      });

      if (res.completed || res.finalResultLevel) {
        setConfirmedLevel(res.finalResultLevel || "A1");
        setStage("RESULT");
      } else {
        const nextBatchNum = res.currentBatch
          ? res.currentBatch + 1
          : batchIndex + 1;
        setBatchIndex(nextBatchNum);
        await loadBatchFromServer(activeSession);
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Ошибка при отправке ответов на сервер",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndPay = () => {
    if (user && token) {
      setAuth(token, { ...user, level: confirmedLevel });
    }
    navigate("/plan");
  };

  if (stage === "CHOICE") {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center flex flex-col gap-8 shadow-2xl">
          <div className="flex flex-col gap-3 items-center">
            <Logo size="lg" />
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Определение уровня
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Пройдите адаптивный тест, чтобы алгоритм точно настроил программу
              курса под ваши знания.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleTakeTest}
              disabled={isStarting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-black py-4 rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin border-black" />
                  <span>Инициализация сервера...</span>
                </>
              ) : (
                <>
                  <span>Пройти тест на уровень</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleSkipTest}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-zinc-800 flex items-center justify-center gap-2"
            >
              <DoorOpen className="w-4 h-4 text-emerald-400" />
              <span>Пропустить (Выбрать тариф сразу)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingBatch || isSubmitting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-zinc-400 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs sm:text-sm font-mono animate-pulse text-zinc-500">
          {isSubmitting
            ? "Анализ ответов сервером..."
            : "Загрузка адаптивного блока..."}
        </span>
      </div>
    );
  }

  if (stage === "RESULT") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center flex flex-col gap-8 shadow-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mx-auto text-3xl font-black tracking-wider">
            {confirmedLevel}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-white">
              Тестирование завершено!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Ваш подтвержденный уровень:{" "}
              <strong className="text-emerald-400 font-bold">
                {confirmedLevel}
              </strong>
              . Программа успешно откалибрована.
            </p>
          </div>
          <button
            onClick={handleFinishAndPay}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
          >
            Перейти к выбору тарифа
          </button>
        </div>
      </div>
    );
  }

  const activeQuestion = batchQuestions[qIndexInBatch];
  const activeOptId = localAnswers[activeQuestion?.id];
  const globalProgressNum = (batchIndex - 1) * 3 + qIndexInBatch + 1;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-20">
      <header className="max-w-4xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 text-xs font-mono text-zinc-500">
        <Logo size="sm" />
        <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl">
          <span className="text-emerald-400 font-bold">Адаптивный режим</span>
          <span>Вопрос: {globalProgressNum}/30</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-12 flex flex-col gap-8">
        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(globalProgressNum / 30) * 100}%` }}
          ></div>
        </div>

        {activeQuestion && (
          <QuestionCard
            question={activeQuestion}
            selectedOptionId={activeOptId}
            onSelectOption={(optId) =>
              handleSaveAnswer(activeQuestion.id, optId)
            }
          />
        )}

        <button
          onClick={handleNextQuestion}
          disabled={!activeOptId}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-black py-4 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-lg active:scale-[0.99]"
        >
          {qIndexInBatch === 2 ? "Отправить ответы блока" : "Следующий вопрос"}
        </button>
      </main>
    </div>
  );
}

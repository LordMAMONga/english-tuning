import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { testApi, type Question } from "@/modules/testing/api/testApi";
import { useTestSessionStore } from "@/modules/testing/store/useTestSessionStore";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { QuestionCard } from "@/modules/testing/ui/QuestionCard";
import { Loader2, ArrowRight, DoorOpen } from "lucide-react";
import { Logo } from "@/shared/ui/Logo";

const LEVELS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function ActiveTestPage() {
  const { sessionId, setSessionId } = useTestSessionStore();
  const { user, token, setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [stage, setStage] = useState<"CHOICE" | "TESTING" | "RESULT">("CHOICE");

  const [batchIndex, setBatchIndex] = useState(1);
  const [qIndexInBatch, setQIndexInBatch] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const [batchQuestions, setBatchQuestions] = useState<Question[]>([]);
  const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});

  const [isStarting, setIsStarting] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentLevelStr = LEVELS_ORDER[currentLevelIndex];

  const loadBatchFromServer = async (lvl: string) => {
    setIsLoadingBatch(true);
    try {
      const data = await testApi.getNextBatch(sessionId || 1, lvl);
      setBatchQuestions(data);
      setQIndexInBatch(0);
    } catch (err) {
      alert("Ошибка загрузки вопросов");
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
      setCurrentLevelIndex(0);
      setLocalAnswers({});
      setStage("TESTING");
      await loadBatchFromServer("A1");
    } catch (err) {
      alert("Сбой запуска теста");
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
    await new Promise((r) => setTimeout(r, 600));

    let correctCount = 0;
    batchQuestions.forEach((q) => {
      const chosenOptId = localAnswers[q.id];
      if (q.options[0] && chosenOptId === q.options[0].id) {
        correctCount++;
      }
    });

    let nextLvlIdx = currentLevelIndex;
    if (correctCount >= 2 && currentLevelIndex < LEVELS_ORDER.length - 1) {
      nextLvlIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextLvlIdx);
    }

    if (batchIndex >= 10) {
      setStage("RESULT");
      setIsSubmitting(false);
    } else {
      const nextBatchNum = batchIndex + 1;
      setBatchIndex(nextBatchNum);
      await loadBatchFromServer(LEVELS_ORDER[nextLvlIdx]);
      setIsSubmitting(false);
    }
  };

  const handleFinishAndPay = () => {
    if (user && token) {
      setAuth(token, { ...user, level: currentLevelStr });
    }
    navigate("/plan");
  };

  if (stage === "CHOICE") {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800/80 rounded-[2rem] sm:rounded-3xl p-6 sm:p-10 text-center flex flex-col gap-6 sm:gap-8 shadow-2xl">
          <div className="flex flex-col gap-2 sm:gap-3 items-center">
            <Logo size="lg" />
            <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
              Определение уровня
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Пройдите адаптивный тест (30 вопросов), чтобы система точно
              настроила программу курса, или пропустите его.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <button
              onClick={handleTakeTest}
              disabled={isStarting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin border-black" />
                  <span>Загрузка...</span>
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
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer border border-zinc-800 flex items-center justify-center gap-2"
            >
              <DoorOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="truncate">Пропустить (Выбрать тариф)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingBatch || isSubmitting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 text-center text-zinc-400 font-sans">
        <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-emerald-500" />
        <span className="text-xs sm:text-sm font-mono animate-pulse text-zinc-400">
          {isSubmitting
            ? "Проверка блока..."
            : `Генерация вопросов: ${currentLevelStr}...`}
        </span>
      </div>
    );
  }

  if (stage === "RESULT") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800/80 rounded-[2rem] sm:rounded-3xl p-6 sm:p-10 text-center flex flex-col gap-6 sm:gap-8 shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mx-auto text-2xl sm:text-3xl font-black tracking-wider">
            {currentLevelStr}
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Тестирование завершено!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Ваш подтвержденный уровень:{" "}
              <strong className="text-emerald-400 font-bold">
                {currentLevelStr}
              </strong>
              . Программа курса успешно перекалибрована.
            </p>
          </div>
          <button
            onClick={handleFinishAndPay}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
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
      <header className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-zinc-900 text-xs font-mono text-zinc-500">
        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
          <Logo size="sm" />
        </div>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 sm:gap-4 bg-zinc-950 border border-zinc-800/80 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs">
          <span className="text-emerald-400 font-bold">
            Lvl: {currentLevelStr}
          </span>
          <span className="text-zinc-600">|</span>
          <span>Блок: {batchIndex}/10</span>
          <span className="text-zinc-600">|</span>
          <span>{globalProgressNum}/30</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-12 flex flex-col gap-6 sm:gap-8">
        <div className="w-full bg-zinc-900 rounded-full h-1 sm:h-1.5 overflow-hidden">
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
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-900 disabled:text-zinc-600 text-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-[0.99]"
        >
          {qIndexInBatch === 2 && batchIndex === 10
            ? "Завершить тестирование"
            : qIndexInBatch === 2
              ? "Отправить ответы блока"
              : "Следующий вопрос"}
        </button>
      </main>
    </div>
  );
}

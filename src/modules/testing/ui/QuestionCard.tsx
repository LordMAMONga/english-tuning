import React from "react";
import { type Question } from "../api/testApi";

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: number;
  onSelectOption: (optionId: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col gap-6">
      <h3 className="text-lg sm:text-xl font-bold text-zinc-100 leading-relaxed">
        {question.text}
      </h3>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <label
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full p-5 rounded-2xl border text-sm sm:text-base font-medium transition-all cursor-pointer flex items-center justify-between select-none ${
                isSelected
                  ? "border-emerald-500 bg-emerald-950/20 text-emerald-300"
                  : "border-zinc-800/80 hover:border-zinc-700 text-zinc-400 bg-zinc-900/30"
              }`}
            >
              <span className="pr-4">{option.text}</span>
              <div className="w-5 h-5 rounded-full border border-zinc-600 bg-zinc-900 flex items-center justify-center flex-shrink-0">
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

import { GoogleAuthButton } from "@/modules/auth/ui/GoogleAuthButton";
import { Logo } from "@/shared/ui/Logo";

export function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none -top-10 -left-10 sm:-top-20 sm:-left-20"></div>

      <div className="w-full max-w-md bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col gap-6 sm:gap-8 relative z-10">
        <div className="flex flex-col gap-2 items-center text-center">
          <Logo size="lg" />
          <p className="text-xs text-zinc-400 max-w-[17rem] leading-relaxed mt-1 sm:mt-2">
            Вход в систему точной настройки английского языка
          </p>
        </div>

        <div className="w-full">
          <GoogleAuthButton />
        </div>
      </div>
    </div>
  );
}

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "../api/useGoogleLogin";

export function GoogleAuthButton() {
  const { mutate, isPending, isError, error } = useGoogleAuthMutation();

  return (
    <div className="flex flex-col gap-3 w-full items-center">
      {isPending ? (
        <div className="text-sm font-mono text-emerald-400 animate-pulse py-2">
          Обмен токена с сервером...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              mutate(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error("Google Sign-In Error");
          }}
          theme="filled_black"
          shape="rectangular"
        />
      )}

      {isError && (
        <div className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-800/50 w-full text-center">
          {error?.message || "Не удалось авторизоваться"}
        </div>
      )}
    </div>
  );
}

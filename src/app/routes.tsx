import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

import { LoginPage } from "@/pages/LoginPage";
import { SelectPlanPage } from "@/pages/SelectPlanPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ActiveTestPage } from "@/pages/ActiveTestPage";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.level === null && location.pathname !== "/test") {
    return <Navigate to="/test" replace />;
  }

  if (
    user?.level !== null &&
    !user?.isPaid &&
    location.pathname !== "/plan" &&
    location.pathname !== "/checkout"
  ) {
    return <Navigate to="/plan" replace />;
  }

  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (user?.level === null) return <Navigate to="/test" replace />;
  if (!user?.isPaid) return <Navigate to="/plan" replace />;
  return <Navigate to="/cabinet" replace />;
};

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/plan" element={<SelectPlanPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/test" element={<ActiveTestPage />} />

          <Route path="/" element={<Navigate to="/plan" replace />} />

          <Route
            path="/cabinet"
            element={
              <div className="min-h-screen bg-black text-emerald-400 flex flex-col gap-4 items-center justify-center font-mono">
                <div className="p-8 bg-zinc-950 rounded-3xl border border-zinc-800 text-center">
                  <span className="text-3xl">🚀</span>
                  <h2 className="text-white text-xl font-bold mt-2">
                    Личный кабинет English Tuning
                  </h2>
                  <p className="text-zinc-500 text-xs mt-1">
                    Доступ к материалам открыт. Оплата подтверждена.
                  </p>
                </div>
              </div>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

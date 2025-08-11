import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { setGlobal401Handler } from "../utils/api";

export const useGlobalAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: showErrorToast } = useToast();
  const lastErrorTime = useRef(0);

  useEffect(() => {
    const handle401 = () => {
      const now = Date.now();
      // Prevent multiple rapid 401 errors (within 2 seconds)
      if (now - lastErrorTime.current < 2000) {
        return;
      }
      lastErrorTime.current = now;

      // Only show error and redirect if not already on login/signup pages
      if (
        !location.pathname.includes("/login") &&
        !location.pathname.includes("/signup")
      ) {
        showErrorToast("Session expired. Please log in.");
        const returnTo = location.pathname + location.search + location.hash;
        navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
          replace: true,
        });
      }
    };

    setGlobal401Handler(handle401);

    // Cleanup
    return () => {
      setGlobal401Handler(null);
    };
  }, [navigate, location, showErrorToast]);
};

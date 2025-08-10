import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { setGlobal401Handler } from '../utils/api';

export const useGlobalAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: showErrorToast } = useToast();

  useEffect(() => {
    const handle401 = () => {
      showErrorToast('Session expired. Please log in.');
      const returnTo = location.pathname + location.search + location.hash;
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
    };

    setGlobal401Handler(handle401);

    // Cleanup
    return () => {
      setGlobal401Handler(null);
    };
  }, [navigate, location, showErrorToast]);
};

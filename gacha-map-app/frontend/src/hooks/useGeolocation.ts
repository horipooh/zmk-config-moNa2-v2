import { useState, useCallback } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: '位置情報が利用できません' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({ lat: coords.latitude, lng: coords.longitude, error: null, loading: false });
      },
      (err) => {
        setState((s) => ({ ...s, error: err.message, loading: false }));
      },
      { timeout: 10000 }
    );
  }, []);

  return { ...state, locate };
}

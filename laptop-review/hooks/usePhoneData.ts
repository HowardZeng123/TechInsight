import { useState, useEffect } from 'react';
import { smartphoneService } from '@/services/firebaseServices';
import { Smartphone } from '@/types/smartphone';

export function usePhoneData(id: string) {
  const [phone, setPhone] = useState<Smartphone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchPhone() {
      try {
        setLoading(true);
        const data = await smartphoneService.getById(id);
        setPhone(data as Smartphone);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPhone();
    }
  }, [id]);

  return { phone, loading, error };
}

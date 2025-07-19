import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useTextileStorage() {
  const [materials, setMaterials] = useLocalStorage('textile-materials', []);
  const [processes, setProcesses] = useLocalStorage('textile-processes', []);
  const [laborRates, setLaborRates] = useLocalStorage('textile-labor-rates', []);
  const [products, setProducts] = useLocalStorage('textile-products', []);
  const [costingSessions, setCostingSessions] = useLocalStorage('textile-sessions', []);

  return {
    materials,
    setMaterials,
    processes,
    setProcesses,
    laborRates,
    setLaborRates,
    products,
    setProducts,
    costingSessions,
    setCostingSessions,
  };
}
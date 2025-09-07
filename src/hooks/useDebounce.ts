import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that provides debounced value updates
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced input handling with immediate UI updates
 * @param initialValue - Initial input value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with displayValue, debouncedValue, and setValue function
 */
export const useDebouncedInput = <T>(
  initialValue: T, 
  delay: number = 300
): {
  displayValue: T;
  debouncedValue: T;
  setValue: (value: T) => void;
} => {
  const [displayValue, setDisplayValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(displayValue, delay);

  const setValue = useCallback((value: T) => {
    setDisplayValue(value);
  }, []);

  return {
    displayValue,
    debouncedValue,
    setValue
  };
};

/**
 * Custom hook for throttled function calls
 * @param callback - Function to throttle
 * @param delay - Throttle delay in milliseconds (default: 300ms)
 * @returns Throttled function
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const [lastCall, setLastCall] = useState<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      setLastCall(now);
      return callback(...args);
    }
  }, [callback, delay, lastCall]) as T;
};
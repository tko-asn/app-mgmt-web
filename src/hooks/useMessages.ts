import { useCallback, useState } from 'react';

export const useMessages = () => {
  type Messages = {
    errors: string[];
    info: string[];
  };
  const initialState = {
    errors: [],
    info: [],
  };
  const [messages, setMessages] = useState<Messages>(initialState);

  const initializeErrorMessages = useCallback(
    () => setMessages({ ...messages, errors: [] }),
    [messages],
  );

  const initializeInfoMessages = useCallback(
    () => setMessages({ ...messages, info: [] }),
    [messages],
  );

  const addErrorMessage = useCallback(
    (error: string) =>
      setMessages({ ...messages, errors: [...messages.errors, error] }),
    [messages],
  );

  const addInfoMessage = useCallback(
    (info: string) =>
      setMessages({ ...messages, info: [...messages.info, info] }),
    [messages],
  );

  const setErrorMessages = useCallback(
    (errors: string[]) => setMessages({ ...messages, errors }),
    [messages],
  );

  const setInfoMessages = useCallback(
    (info: string[]) => setMessages({ ...messages, info }),
    [messages],
  );

  return {
    messages,
    initializeErrorMessages,
    initializeInfoMessages,
    addErrorMessage,
    addInfoMessage,
    setErrorMessages,
    setInfoMessages,
  };
};

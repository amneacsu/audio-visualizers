import * as React from 'react';

const AppAudioContext = React.createContext<{
  audioContext: AudioContext;
  state: AudioContextState;
}>(null!);

type AudioContextProviderProps = { children: React.ReactNode };

const initCtx = () => {
  return new window.AudioContext();
};

export const AudioContextProvider = ({ children }: AudioContextProviderProps) => {
  const [audioContext] = React.useState(initCtx);
  const [audioContextState, setAudioContextState] = React.useState<AudioContextState>('suspended');

  const context = React.useMemo(() => {
    return {
      audioContext,
      state: audioContextState,
    };
  }, [audioContext, audioContextState]);

  React.useEffect(() => {
    const handleStateChange = (event: Event) => {
      const target = event.target as AudioContext;
      const newState = target.state;
      setAudioContextState(newState);
    };

    context.audioContext.addEventListener('statechange', handleStateChange);
    return () => context.audioContext.removeEventListener('statechange', handleStateChange);
  }, [context]);

  return (
    <AppAudioContext.Provider value={context}>
      {children}
    </AppAudioContext.Provider>
  );
};

export const useAudioContext = () => React.useContext(AppAudioContext);

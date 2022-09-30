import { createContext, ReactNode, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const defaultSettings = {
  themeMode: 'light',
}
const initialState = {
  ...defaultSettings,
  onToggleMode: () => { },
  onResetSetting: () => { },
};

const SettingsContext = createContext(initialState);

type Props = {
  children: ReactNode;
};

function SettingsProvider({ children }: Props) {
  const [settings, setSettings] = useLocalStorage('settings', {
    ...defaultSettings,
  });

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onResetSetting = () => {
    setSettings({
      ...defaultSettings,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        onToggleMode,
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };


export const useSettings = () => useContext(SettingsContext);

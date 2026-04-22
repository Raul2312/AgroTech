import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../theme/colors";

export const ThemeContext = createContext<any>(null);

// 👇 ESTE FALTABA
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: any) => {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem("modoOscuro");

      if (saved !== null) {
        const isDark = JSON.parse(saved);
        setModoOscuro(isDark);
        setTheme(isDark ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.log("Error cargando tema", error);
    }
  };

  const toggleTheme = async (value: boolean) => {
    try {
      setModoOscuro(value);
      setTheme(value ? darkTheme : lightTheme);
      await AsyncStorage.setItem("modoOscuro", JSON.stringify(value));
    } catch (error) {
      console.log("Error guardando tema", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ modoOscuro, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
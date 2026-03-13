import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../context/CartContext';
import { Ionicons } from "@expo/vector-icons";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const colorScheme = useColorScheme();

  return (

    <CartProvider>

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        <Stack>

          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal'
            }}
          />

          <Stack.Screen
            name="carrito"
            options={{
              title: "Carrito",
              headerStyle: { backgroundColor: "#0f172a" },
              headerTintColor: "#fff",
              headerTitleAlign: "center"
            }}
          />

        </Stack>

        <StatusBar style="auto" />

      </ThemeProvider>

    </CartProvider>
  );
}
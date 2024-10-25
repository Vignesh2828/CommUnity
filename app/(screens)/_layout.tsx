import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ScreenLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
        <Stack.Screen name="add-service" options={{ headerShown: true }} />
      </Stack>
  );
}

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { UserDetailProvider } from "../context/UserDetailContext";

/**
 * Root layout component that provides context providers
 * and sets up the stack navigator
 */
export default function RootLayout() {
  return (
    <UserDetailProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#D0F3DA' },
          animation: 'slide_from_right',
        }}
      />
    </UserDetailProvider>
  );
}
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#E0E7ED',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          width: '85%',
          maxWidth: 350,
          elevation: 0,
          backgroundColor: '#709DBA',
          borderRadius: 50,
          height: 65,
          paddingBottom: 0,
          paddingTop: 0,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          height: 65,
          flex: 1,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarBackground: () => (
          <View style={{
            flex: 1,
            backgroundColor: '#709DBA',
            borderRadius: 50,
            overflow: 'hidden',
          }} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol
                size={24}
                name="house.fill"
                color={focused ? '#709DBA' : '#FFFFFF'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Fontisto name="plane-ticket" size={24} color={focused ? '#709DBA' : '#FFFFFF'} />

            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <FontAwesome name="user" size={24} color={focused ? '#709DBA' : '#FFFFFF'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
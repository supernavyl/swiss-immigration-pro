import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../lib/colors';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Chat: '💬',
    Learn: '📚',
    Upgrade: '⭐',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[name] || '●'}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 56,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ focused }) => <TabIcon name="Chat" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="modules"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => <TabIcon name="Learn" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Upgrade',
          tabBarIcon: ({ focused }) => <TabIcon name="Upgrade" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
      <Tabs.Screen name="modules/[id]" options={{ href: null }} />
    </Tabs>
  );
}

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/colors';

interface Props {
  requiredPack: string;
  currentPack: string;
}

const PACK_NAMES: Record<string, string> = {
  immigration: 'Immigration Pack',
  advanced: 'Advanced Pack',
  citizenship: 'Citizenship Pro',
};

export function PaywallGate({ requiredPack, currentPack }: Props) {
  const router = useRouter();
  const packName = PACK_NAMES[requiredPack] || requiredPack;

  return (
    <View style={styles.container}>
      <Text style={styles.lock}>🔒</Text>
      <Text style={styles.title}>Premium Content</Text>
      <Text style={styles.message}>
        This content requires the {packName}.
        {currentPack === 'free'
          ? ' Start your 7-day free trial to unlock it.'
          : ' Upgrade your plan to access it.'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/pricing')}
      >
        <Text style={styles.buttonText}>
          {currentPack === 'free' ? 'Start Free Trial' : 'Upgrade Plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.surface,
  },
  lock: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

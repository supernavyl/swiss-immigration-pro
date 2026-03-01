import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { colors } from '@/lib/colors';
import { CONTENT_URL } from '@/lib/config';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const isFree = !user?.packId || user.packId === 'free';

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user?.name || user?.email || '?')[0].toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user?.name || 'User'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {/* Plan info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Plan</Text>
          <Text style={[styles.infoValue, !isFree && styles.proPlan]}>
            {isFree ? 'Free' : user?.packId}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>
            {user?.isAdmin ? 'Admin' : 'Member'}
          </Text>
        </View>
      </View>

      {/* Upgrade CTA for free users */}
      {isFree && (
        <TouchableOpacity
          style={styles.upgradeCard}
          onPress={() => router.push('/(tabs)/pricing')}
          activeOpacity={0.8}
        >
          <Text style={styles.upgradeEmoji}>⭐</Text>
          <View style={styles.upgradeTextWrap}>
            <Text style={styles.upgradeTitle}>Upgrade Your Plan</Text>
            <Text style={styles.upgradeSubtitle}>
              Unlock unlimited AI, CV templates & more
            </Text>
          </View>
          <Text style={styles.upgradeArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Links */}
      <View style={styles.linksCard}>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL(`${CONTENT_URL}/faq`)}
        >
          <Text style={styles.linkEmoji}>❓</Text>
          <Text style={styles.linkText}>FAQ</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL(`${CONTENT_URL}/contact`)}
        >
          <Text style={styles.linkEmoji}>📧</Text>
          <Text style={styles.linkText}>Contact Support</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL(`${CONTENT_URL}/privacy`)}
        >
          <Text style={styles.linkEmoji}>🔒</Text>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL(`${CONTENT_URL}/terms`)}
        >
          <Text style={styles.linkEmoji}>📋</Text>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { alignItems: 'center', paddingTop: 32, paddingBottom: 40, paddingHorizontal: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  infoCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 15, color: colors.textSecondary },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  proPlan: { color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border },
  upgradeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  upgradeEmoji: { fontSize: 24, marginRight: 12 },
  upgradeTextWrap: { flex: 1 },
  upgradeTitle: { fontSize: 15, fontWeight: '700', color: '#92400E' },
  upgradeSubtitle: { fontSize: 12, color: '#A16207', marginTop: 2 },
  upgradeArrow: { fontSize: 18, fontWeight: '700', color: '#92400E' },
  linksCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 4,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
  },
  linkEmoji: { fontSize: 18 },
  linkText: { fontSize: 15, color: colors.text },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
    width: '100%',
    alignItems: 'center',
  },
  signOutText: { color: colors.error, fontSize: 16, fontWeight: '600' },
  version: {
    marginTop: 16,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

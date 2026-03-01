import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { colors } from '@/lib/colors';
import { CONTENT_URL } from '@/lib/config';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface DashboardStats {
  modules_completed?: number;
  total_modules?: number;
  chat_messages_today?: number;
  chat_limit?: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats() {
    try {
      const data = await api.get<DashboardStats>('/api/user/limits');
      setStats(data);
    } catch {
      // Fallback — show defaults
      setStats({});
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }

  const greeting = user?.name ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome';
  const isFree = !user?.packId || user.packId === 'free';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>{greeting} 👋</Text>
        <View style={styles.packRow}>
          <View style={[styles.packBadge, !isFree && styles.packBadgePro]}>
            <Text style={[styles.packBadgeText, !isFree && styles.packBadgeTextPro]}>
              {isFree ? 'Free Plan' : `${user?.packId} Plan`}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      {stats === null ? (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LoadingSkeleton height={28} width={60} />
            <LoadingSkeleton height={12} width={80} style={{ marginTop: 6 }} />
          </View>
          <View style={styles.statCard}>
            <LoadingSkeleton height={28} width={60} />
            <LoadingSkeleton height={12} width={80} style={{ marginTop: 6 }} />
          </View>
        </View>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.modules_completed ?? 0}</Text>
            <Text style={styles.statLabel}>Modules Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {stats.chat_messages_today ?? 0}/{stats.chat_limit ?? 10}
            </Text>
            <Text style={styles.statLabel}>AI Questions</Text>
          </View>
        </View>
      )}

      {/* Upgrade CTA for free users */}
      {isFree && (
        <TouchableOpacity
          style={styles.upgradeBanner}
          onPress={() => router.push('/(tabs)/pricing')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.upgradeTitle}>⭐ Unlock Full Access</Text>
            <Text style={styles.upgradeSubtitle}>
              Unlimited AI chat, 25+ CV templates, and expert modules from CHF 9/mo
            </Text>
          </View>
          <Text style={styles.upgradeArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <Text style={styles.actionEmoji}>💬</Text>
          <Text style={styles.actionText}>Ask AI</Text>
          <Text style={styles.actionHint}>Immigration questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/modules')}
        >
          <Text style={styles.actionEmoji}>📚</Text>
          <Text style={styles.actionText}>Learn</Text>
          <Text style={styles.actionHint}>Study modules</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => Linking.openURL(`${CONTENT_URL}/tools/cv-editor`)}
        >
          <Text style={styles.actionEmoji}>📝</Text>
          <Text style={styles.actionText}>CV Builder</Text>
          <Text style={styles.actionHint}>Swiss format</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => Linking.openURL(`${CONTENT_URL}/consultation`)}
        >
          <Text style={styles.actionEmoji}>📅</Text>
          <Text style={styles.actionText}>Consultation</Text>
          <Text style={styles.actionHint}>Book expert call</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Tips */}
      <Text style={styles.sectionTitle}>Getting Started</Text>
      <View style={styles.tipsList}>
        {[
          { step: '1', text: 'Ask our AI about your specific situation' },
          { step: '2', text: 'Complete the permit eligibility quiz' },
          { step: '3', text: 'Study the recommended learning modules' },
          { step: '4', text: 'Build your Swiss-format CV' },
        ].map((tip) => (
          <View key={tip.step} style={styles.tipRow}>
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>{tip.step}</Text>
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  hero: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: { fontSize: 24, fontWeight: '700', color: '#fff' },
  packRow: { marginTop: 8 },
  packBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  packBadgePro: { backgroundColor: '#FFD700' },
  packBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'capitalize',
  },
  packBadgeTextPro: { color: '#1E293B' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    marginTop: -16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: { fontSize: 24, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  upgradeTitle: { fontSize: 15, fontWeight: '700', color: '#92400E' },
  upgradeSubtitle: {
    fontSize: 12,
    color: '#A16207',
    marginTop: 2,
    maxWidth: 260,
    lineHeight: 17,
  },
  upgradeArrow: {
    fontSize: 20,
    color: '#92400E',
    fontWeight: '700',
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionEmoji: { fontSize: 28, marginBottom: 6 },
  actionText: { fontSize: 15, fontWeight: '600', color: colors.text },
  actionHint: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  tipsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 14,
  },
  tipBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  tipText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 19 },
});

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useAuth } from '@/lib/auth';
import { api, ApiError } from '@/lib/api';
import { colors } from '@/lib/colors';
import { CONTENT_URL } from '@/lib/config';

const PLANS = [
  {
    id: 'immigration',
    name: 'Immigration Pack',
    price: 9,
    badge: 'Most Popular',
    features: [
      'Unlimited AI chatbot access',
      '25+ Swiss CV templates',
      'Complete permit checklists',
      'Salary benchmarking',
      '5 core immigration modules',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced Pack',
    price: 29,
    badge: 'Best Value',
    features: [
      'Everything in Immigration Pack',
      '10 advanced learning modules',
      'AI tutor & progress tracking',
      'Cantonal optimization strategies',
      'Tax & financial calculator',
    ],
  },
  {
    id: 'citizenship',
    name: 'Citizenship Pro',
    price: 79,
    badge: 'Complete Solution',
    features: [
      'Everything in Advanced Pack',
      '10-year citizenship roadmap',
      'Language test preparation',
      'Lifetime access',
      'Personalized coaching sessions',
    ],
  },
] as const;

export default function PricingScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(packId: string) {
    setLoading(packId);
    try {
      const data = await api.post<{ checkoutUrl?: string; checkout_url?: string }>(
        '/api/checkout',
        { packId, cycle: 'monthly' },
      );
      const url = data.checkoutUrl || data.checkout_url;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not start checkout. Please try again.');
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        Alert.alert('Sign In Required', 'Please sign in to subscribe.');
        return;
      }
      Alert.alert('Error', err instanceof ApiError ? err.detail : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  }

  const currentPack = user?.packId || 'free';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade Your Plan</Text>
        <Text style={styles.subtitle}>
          Get unlimited access to AI tools, learning modules, and expert guidance.
        </Text>
      </View>

      {currentPack !== 'free' && (
        <View style={styles.currentPlan}>
          <Text style={styles.currentPlanText}>
            Current plan: <Text style={styles.bold}>{currentPack}</Text>
          </Text>
        </View>
      )}

      {PLANS.map((plan) => {
        const isCurrent = currentPack === plan.id;
        const isHigher =
          ['immigration', 'advanced', 'citizenship'].indexOf(plan.id) >
          ['immigration', 'advanced', 'citizenship'].indexOf(currentPack);

        return (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.id === 'advanced' && styles.planCardHighlighted,
            ]}
          >
            {plan.badge && (
              <View
                style={[
                  styles.badge,
                  plan.id === 'advanced' && styles.badgeHighlighted,
                ]}
              >
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>CHF {plan.price}</Text>
              <Text style={styles.period}>/month</Text>
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                isCurrent && styles.currentButton,
                plan.id === 'advanced' && !isCurrent && styles.highlightedButton,
              ]}
              onPress={() => handleSubscribe(plan.id)}
              disabled={isCurrent || loading !== null}
            >
              <Text
                style={[
                  styles.subscribeText,
                  isCurrent && styles.currentButtonText,
                ]}
              >
                {loading === plan.id
                  ? 'Opening...'
                  : isCurrent
                    ? 'Current Plan'
                    : isHigher
                      ? 'Upgrade'
                      : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          7-day free trial included. Cancel anytime.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(`${CONTENT_URL}/terms`)}
        >
          <Text style={styles.footerLink}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    lineHeight: 20,
  },
  currentPlan: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanText: { fontSize: 14, color: colors.primary },
  bold: { fontWeight: '700' },
  planCard: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardHighlighted: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeHighlighted: { backgroundColor: colors.primaryLight },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    marginBottom: 16,
  },
  price: { fontSize: 32, fontWeight: '800', color: colors.text },
  period: { fontSize: 14, color: colors.textSecondary, marginLeft: 4 },
  featuresList: { gap: 8, marginBottom: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkmark: { color: colors.success, fontSize: 16, fontWeight: '700' },
  featureText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20 },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  highlightedButton: {
    backgroundColor: colors.primary,
  },
  currentButton: {
    backgroundColor: colors.border,
  },
  subscribeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  currentButtonText: { color: colors.textSecondary },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerText: { fontSize: 12, color: colors.textSecondary },
  footerLink: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});

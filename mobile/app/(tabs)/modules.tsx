import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '../../lib/api';
import { colors } from '../../lib/colors';

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  progress?: number;
  is_free: boolean;
}

export default function ModulesScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  async function loadModules() {
    try {
      const data = await api.get<Module[]>('/api/modules/progress');
      setModules(data);
    } catch {
      // Fallback with static module categories
      setModules([
        { id: 'free-01', title: 'Complete Guide to the Swiss Immigration System', description: 'Full overview of Swiss immigration tracks, permits, and timelines', category: 'immigration', is_free: true },
        { id: 'imm-01', title: 'Swiss CV Template and Formatting', description: 'Swiss-specific CV standards with templates', category: 'immigration', is_free: false },
        { id: 'imm-02', title: 'Swiss Cover Letter Mastery', description: 'Write cover letters that pass Swiss HR screening', category: 'immigration', is_free: false },
        { id: 'imm-04', title: 'Salary Benchmarks and Negotiation', description: 'Swiss salary data and negotiation tactics', category: 'immigration', is_free: false },
        { id: 'adv-01', title: 'Beat the Non-EU Quota System', description: 'Strategies to navigate annual permit quotas', category: 'advanced', is_free: false },
        { id: 'adv-03', title: 'Cantonal Immigration Variations', description: 'How rules differ across Switzerland\'s 26 cantons', category: 'advanced', is_free: false },
        { id: 'cit-01', title: '10-Year Path to Swiss Citizenship', description: 'Step-by-step guide to ordinary naturalization', category: 'citizenship', is_free: false },
        { id: 'cit-02', title: 'Spouse Route — 5 Years Faster', description: 'Facilitated naturalization via Swiss spouse', category: 'citizenship', is_free: false },
      ]);
    }
  }

  useEffect(() => { loadModules(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadModules();
    setRefreshing(false);
  }

  const categories = ['all', 'immigration', 'advanced', 'citizenship'];
  const filtered = filter === 'all' ? modules : modules.filter((m) => m.category === filter);

  function renderModule({ item }: { item: Module }) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => router.push(`/modules/${item.id}`)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {!item.is_free && <Text style={styles.proBadge}>PRO</Text>}
        </View>
        <Text style={styles.cardDesc}>{item.description}</Text>
        {item.progress != null && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, filter === cat && styles.filterActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderModule}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
    paddingTop: 4,
    gap: 12,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  proBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
});

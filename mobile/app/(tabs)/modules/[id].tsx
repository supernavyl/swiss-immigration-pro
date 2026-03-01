import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../../lib/api';
import { colors } from '../../../lib/colors';


interface Section {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface ModuleContent {
  id: string;
  title: string;
  description: string;
  estimatedReadTime: string | null;
  sections: Section[];
  quiz: { questions: QuizQuestion[] } | null;
}

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [module, setModule] = useState<ModuleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    loadModule();
    loadProgress();
  }, [id]);

  async function loadModule() {
    try {
      const data = await api.get<ModuleContent>(`/api/modules/${id}/content`);
      setModule(data);
      // Auto-expand first section
      if (data.sections?.length > 0) {
        setExpandedSections(new Set([data.sections[0].id]));
      }
    } catch (e: unknown) {
      const status = (e as { status?: number }).status;
      if (status === 403) {
        setError('This module requires a premium plan. Upgrade to unlock it.');
      } else {
        setError('Could not load module. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress() {
    try {
      const data = await api.get<{ sections: string[] }>(`/api/modules/progress?moduleId=${id}`);
      if (data?.sections?.length) {
        setCompletedSections(new Set(data.sections));
      }
    } catch {}
  }

  async function markSectionComplete(sectionId: string) {
    if (completedSections.has(sectionId)) return;
    setCompletedSections(prev => new Set([...prev, sectionId]));
    try {
      await api.post('/api/modules/progress', { moduleId: id, sectionId, completed: true });
    } catch {}
  }

  function toggleSection(sectionId: string) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function submitQuiz() {
    if (!module?.quiz) return;
    const questions = module.quiz.questions;
    const correct = questions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const pct = Math.round((correct / questions.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
    if (pct >= 60) {
      api.post('/api/modules/progress', { moduleId: id, completed: true }).catch(() => {});
    }
  }

  const progress = module ? Math.round((completedSections.size / Math.max(module.sections.length, 1)) * 100) : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !module) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Module not found'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{completedSections.size}/{module.sections.length} sections</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Module header */}
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDesc}>{module.description}</Text>
          {module.estimatedReadTime && (
            <Text style={styles.readTime}>⏱ {module.estimatedReadTime}</Text>
          )}
        </View>

        {/* Sections */}
        {module.sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isComplete = completedSections.has(section.id);
          return (
            <View key={section.id} style={[styles.sectionCard, isComplete && styles.sectionComplete]}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionTitleRow}>
                  {isComplete && <Text style={styles.checkmark}>✓ </Text>}
                  <Text style={[styles.sectionTitle, isComplete && styles.sectionTitleDone]}>
                    {section.title}
                  </Text>
                </View>
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.sectionBody}>
                  <Text style={styles.sectionContent}>{section.content}</Text>

                  {section.keyPoints.length > 0 && (
                    <View style={styles.keyPoints}>
                      <Text style={styles.keyPointsTitle}>Key Takeaways</Text>
                      {section.keyPoints.map((pt, i) => (
                        <Text key={i} style={styles.keyPoint}>• {pt}</Text>
                      ))}
                    </View>
                  )}

                  {!isComplete && (
                    <TouchableOpacity
                      style={styles.markReadBtn}
                      onPress={() => markSectionComplete(section.id)}
                    >
                      <Text style={styles.markReadText}>✓ Mark as read</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Quiz */}
        {module.quiz && module.quiz.questions.length > 0 && (
          <View style={styles.quiz}>
            <Text style={styles.quizTitle}>🎯 Knowledge Check</Text>
            <Text style={styles.quizSubtitle}>{module.quiz.questions.length} questions · Pass with 60%</Text>

            {module.quiz.questions.map((q, qi) => (
              <View key={qi} style={styles.question}>
                <Text style={styles.questionText}>{qi + 1}. {q.question}</Text>
                {q.options.map((opt, oi) => {
                  let optStyle = styles.option;
                  let textStyle = styles.optionText;
                  if (quizSubmitted) {
                    if (oi === q.correct) { optStyle = styles.optionCorrect; textStyle = styles.optionTextCorrect; }
                    else if (oi === quizAnswers[qi]) { optStyle = styles.optionWrong; }
                  } else if (quizAnswers[qi] === oi) {
                    optStyle = styles.optionSelected;
                  }
                  return (
                    <TouchableOpacity
                      key={oi}
                      style={optStyle}
                      onPress={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      disabled={quizSubmitted}
                    >
                      <Text style={textStyle}>{String.fromCharCode(65 + oi)}. {opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {!quizSubmitted ? (
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  Object.keys(quizAnswers).length < module.quiz.questions.length && styles.submitBtnDisabled,
                ]}
                onPress={submitQuiz}
                disabled={Object.keys(quizAnswers).length < module.quiz.questions.length}
              >
                <Text style={styles.submitBtnText}>Submit Quiz</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.scoreCard, quizScore! >= 60 ? styles.scorePass : styles.scoreFail]}>
                <Text style={styles.scoreNum}>{quizScore}%</Text>
                <Text style={styles.scoreMsg}>
                  {quizScore! >= 80 ? '🎉 Excellent!' : quizScore! >= 60 ? '✅ Passed!' : '📖 Try again after reviewing'}
                </Text>
                {quizScore! < 60 && (
                  <TouchableOpacity
                    onPress={() => { setQuizAnswers({}); setQuizScore(null); setQuizSubmitted(false); }}
                  >
                    <Text style={styles.retryText}>Retry Quiz</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  header: { backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  backLink: { marginBottom: 8 },
  backLinkText: { color: colors.primary, fontSize: 15, fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.success, borderRadius: 2 },
  progressLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 4, textAlign: 'right' },

  moduleHeader: { backgroundColor: colors.background, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  moduleTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 6 },
  moduleDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  readTime: { fontSize: 12, color: colors.textSecondary },

  sectionCard: { backgroundColor: colors.background, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  sectionComplete: { borderColor: colors.success },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkmark: { color: colors.success, fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  sectionTitleDone: { color: colors.success },
  chevron: { fontSize: 10, color: colors.textSecondary, marginLeft: 8 },
  sectionBody: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.border },
  sectionContent: { fontSize: 14, color: colors.text, lineHeight: 22, marginTop: 10 },

  keyPoints: { marginTop: 12, backgroundColor: '#EFF6FF', borderRadius: 8, padding: 12 },
  keyPointsTitle: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  keyPoint: { fontSize: 13, color: colors.text, lineHeight: 20, marginBottom: 4 },

  markReadBtn: { marginTop: 12, backgroundColor: colors.success, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  markReadText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  quiz: { backgroundColor: colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  quizTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  quizSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  question: { marginBottom: 20 },
  questionText: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, lineHeight: 20 },
  option: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 6 },
  optionSelected: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#EFF6FF', borderRadius: 8, padding: 12, marginBottom: 6 },
  optionCorrect: { borderWidth: 1.5, borderColor: colors.success, backgroundColor: '#F0FDF4', borderRadius: 8, padding: 12, marginBottom: 6 },
  optionWrong: { borderWidth: 1.5, borderColor: colors.error, backgroundColor: '#FEF2F2', borderRadius: 8, padding: 12, marginBottom: 6 },
  optionText: { fontSize: 13, color: colors.text },
  optionTextCorrect: { fontSize: 13, color: colors.success, fontWeight: '600' },
  submitBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  scoreCard: { borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
  scorePass: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: colors.success },
  scoreFail: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: colors.warning },
  scoreNum: { fontSize: 36, fontWeight: '800', color: colors.text },
  scoreMsg: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  retryText: { marginTop: 10, color: colors.primary, fontWeight: '600', fontSize: 14 },

  errorText: { fontSize: 15, color: colors.error, textAlign: 'center', marginBottom: 16 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 8 },
  backBtnText: { color: '#fff', fontWeight: '600' },
});

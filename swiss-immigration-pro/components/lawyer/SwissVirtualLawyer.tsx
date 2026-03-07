"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  ArrowLeft,
  Plus,
  MessageSquare,
  FileText,
  Link2,
  Search,
  Upload,
  Trash2,
  Send,
  Copy,
  Check,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Download,
  FolderOpen,
  AlertTriangle,
  Clock,
  DollarSign,
  BookOpen,
  WifiOff,
  LogIn,
  X,
  Briefcase,
  Menu,
  Keyboard,
  PhoneCall,
} from "lucide-react";
import { useT } from "@/lib/i18n/useTranslation";
import {
  useLawyerChat,
  type LawyerMessage,
  type LawyerCaseData,
} from "@/lib/useLawyerChat";
import { TypewriterMarkdown } from "./TypewriterMarkdown";
import { analytics } from "@/lib/analytics";
import { useVoiceChat } from "@/lib/hooks/useVoiceChat";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { VoiceModeOverlay } from "@/components/voice/VoiceModeOverlay";
import ConsultationUpsellModal from "./ConsultationUpsellModal";

// ---------------------------------------------------------------------------
// Quick-start prompt tiles
// ---------------------------------------------------------------------------

const QUICK_PROMPTS = [
  {
    key: "workPermit",
    icon: Briefcase,
    question:
      "I need a work permit for Switzerland. What are the requirements and process for a third-country national?",
  },
  {
    key: "appeal",
    icon: AlertTriangle,
    question:
      "My permit application was rejected. What are my legal options to appeal this decision?",
  },
  {
    key: "citizenship",
    icon: BookOpen,
    question:
      "I want to apply for Swiss citizenship through ordinary naturalization. What are the requirements?",
  },
  {
    key: "family",
    icon: FolderOpen,
    question:
      "I have a B permit and want to bring my spouse and children to Switzerland. What is the family reunification process?",
  },
  {
    key: "bPermit",
    icon: FileText,
    question:
      "What are my rights and obligations as a B permit holder in Switzerland?",
  },
  {
    key: "employer",
    icon: Scale,
    question:
      "Can I change employers while on a work permit in Switzerland? What is the process?",
  },
] as const;

// ---------------------------------------------------------------------------
// Complexity badge
// ---------------------------------------------------------------------------

function ComplexityBadge({
  complexity,
  t,
}: {
  complexity?: string;
  t: (key: string) => string;
}) {
  if (!complexity || complexity === "simple") return null;
  const config = {
    moderate: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      label: t("lawyer.complexity.moderate"),
    },
    complex: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-400",
      label: t("lawyer.complexity.complex"),
    },
    "requires-lawyer": {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      label: t("lawyer.complexity.requiresLawyer"),
    },
  }[complexity];
  if (!config) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <AlertTriangle className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  color = "blue",
  onCopy,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
  onCopy?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    violet:
      "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
    slate:
      "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700",
  };

  return (
    <div
      className={`mt-3 rounded-lg border ${colorMap[color] || colorMap.blue}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          {title}
        </span>
        <span className="flex items-center gap-1">
          {onCopy && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onCopy?.();
                }
              }}
              className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded"
              aria-label="Copy section"
            >
              <Copy className="w-3 h-3" />
            </span>
          )}
          {open ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 text-xs text-gray-700 dark:text-gray-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SwissVirtualLawyer() {
  const router = useRouter();
  const { t } = useT();
  const chat = useLawyerChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<
    "history" | "documents" | "resources" | "cases"
  >("history");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseCategory, setNewCaseCategory] = useState("other");
  const [showNewCase, setShowNewCase] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceResponseText, setVoiceResponseText] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const voice = useVoiceChat({
    mode: "lawyer",
    language: t("__lang") || "en",
    conversationId: chat.activeConversationId ?? undefined,
    onTranscription: (text) => {
      // Add user's transcription to chat history as visible text
      chat.sendMessage(text);
    },
    onSpeakingStart: (text) => {
      setVoiceResponseText(text);
    },
    onSpeakingEnd: () => {
      setVoiceResponseText("");
    },
    onMetadata: (_metadata) => {
      // Metadata is already captured in the chat response from the backend
    },
    onError: (error) => {
      setVoiceError(error);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  // Desktop sidebar default open
  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "n") {
        e.preventDefault();
        chat.newConversation();
      }
      if (mod && e.key === "k") {
        e.preventDefault();
        setSidebarOpen(true);
        setSidebarTab("history");
        setTimeout(
          () => document.getElementById("lawyer-search")?.focus(),
          100,
        );
      }
      if (mod && e.key === "e") {
        e.preventDefault();
        if (chat.activeConversationId && chat.isAuthenticated)
          chat.exportPdf(chat.activeConversationId);
      }
      if (e.key === "Escape") {
        if (sidebarOpen && window.innerWidth < 1024) setSidebarOpen(false);
        setShowShortcuts(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.activeConversationId, chat.isAuthenticated, sidebarOpen]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || chat.isLoading) return;
    chat.sendMessage(inputValue);
    setInputValue("");
  }, [inputValue, chat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleCopy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadProgress(file.name);
      await chat.uploadDocument(file);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [chat],
  );

  // Voice call toggle
  const toggleVoiceCall = useCallback(async () => {
    if (voice.isConnected) {
      voice.disconnect();
      setVoiceMode(false);
      setVoiceResponseText("");
      setVoiceError(null);
    } else {
      setVoiceError(null);
      await voice.connect();
      setVoiceMode(true);
    }
  }, [voice]);

  const handleCreateCase = useCallback(async () => {
    if (!newCaseTitle.trim()) return;
    await chat.createCase(newCaseTitle.trim(), newCaseCategory);
    setNewCaseTitle("");
    setNewCaseCategory("other");
    setShowNewCase(false);
  }, [newCaseTitle, newCaseCategory, chat]);

  // Filter conversations
  const filteredConversations = searchQuery
    ? chat.conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chat.conversations;

  const showQuickPrompts = chat.messages.length <= 1;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="relative flex h-screen bg-[#030614] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(61,127,255,0.16),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_84%,rgba(139,92,246,0.14),transparent_42%)]" />
      </div>
      {/* ─── Sidebar ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed lg:relative z-40 w-[280px] h-full bg-[#0b1326]/90 border-r border-white/10 backdrop-blur-md flex flex-col"
            >
              {/* New chat button */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    chat.newConversation();
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors border border-white/10"
                  aria-label={t("lawyer.newChat")}
                >
                  <Plus className="w-4 h-4" />
                  {t("lawyer.newChat")}
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {(["history", "cases", "documents", "resources"] as const).map(
                  (tab) => {
                    const icons = {
                      history: MessageSquare,
                      cases: FolderOpen,
                      documents: FileText,
                      resources: Link2,
                    };
                    const labels = {
                      history: t("lawyer.sidebarHistory"),
                      cases: t("lawyer.sidebarCases"),
                      documents: t("lawyer.sidebarDocuments"),
                      resources: t("lawyer.sidebarResources"),
                    };
                    const Icon = icons[tab];
                    return (
                      <button
                        key={tab}
                        onClick={() => setSidebarTab(tab)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                          sidebarTab === tab
                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        }`}
                        aria-selected={sidebarTab === tab}
                        role="tab"
                      >
                        <Icon className="w-4 h-4" />
                        {labels[tab]}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto">
                {/* History tab */}
                {sidebarTab === "history" && (
                  <div className="p-2">
                    <div className="mb-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                        <input
                          id="lawyer-search"
                          type="text"
                          placeholder={t("lawyer.searchConversations")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label={t("lawyer.searchConversations")}
                        />
                      </div>
                    </div>
                    {filteredConversations.length === 0 && (
                      <p className="text-xs text-white/40 text-center py-4">
                        {t("lawyer.noConversations")}
                      </p>
                    )}
                    {filteredConversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => {
                          chat.switchConversation(convo.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`group w-full text-left px-3 py-2 mb-1 rounded-lg text-xs transition-colors ${
                          chat.activeConversationId === convo.id
                            ? "bg-blue-500/20 text-blue-200 border border-blue-300/20"
                            : "hover:bg-white/8 text-white/65"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate flex-1">{convo.title}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              chat.deleteConversation(convo.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.stopPropagation();
                                chat.deleteConversation(convo.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                            aria-label={t("lawyer.deleteConversation")}
                          >
                            <Trash2 className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(
                            convo.updatedAt || convo.createdAt,
                          ).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cases tab */}
                {sidebarTab === "cases" && (
                  <div className="p-2">
                    {!chat.isAuthenticated ? (
                      <p className="text-xs text-gray-400 text-center py-4">
                        {t("lawyer.loginRequired")}
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowNewCase(!showNewCase)}
                          className="flex items-center gap-2 w-full px-3 py-2 mb-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Plus className="w-3.5 h-3.5" /> {t("lawyer.caseNew")}
                        </button>
                        <AnimatePresence>
                          {showNewCase && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mb-2"
                            >
                              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                                <input
                                  type="text"
                                  placeholder={t("lawyer.caseTitle")}
                                  value={newCaseTitle}
                                  onChange={(e) =>
                                    setNewCaseTitle(e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                                />
                                <select
                                  value={newCaseCategory}
                                  onChange={(e) =>
                                    setNewCaseCategory(e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                                  aria-label={t("lawyer.caseCategory")}
                                >
                                  {[
                                    "permits",
                                    "citizenship",
                                    "employment",
                                    "family",
                                    "appeals",
                                    "other",
                                  ].map((cat) => (
                                    <option key={cat} value={cat}>
                                      {t(
                                        `lawyer.caseCategory${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
                                      )}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={handleCreateCase}
                                  className="w-full py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                                >
                                  {t("lawyer.caseNew")}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {chat.cases.length === 0 && !showNewCase && (
                          <p className="text-xs text-gray-400 text-center py-4">
                            {t("lawyer.noCases")}
                          </p>
                        )}
                        {chat.cases.map((c) => {
                          const statusColors: Record<string, string> = {
                            open: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            in_progress:
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            resolved:
                              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                            archived:
                              "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
                          };
                          return (
                            <div
                              key={c.id}
                              className="group px-3 py-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                                  {c.title}
                                </span>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => chat.deleteCase(c.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      chat.deleteCase(c.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"
                                  aria-label={t("lawyer.deleteCase")}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[c.status] || statusColors.open}`}
                                >
                                  {t(
                                    `lawyer.caseStatus${c.status.charAt(0).toUpperCase() + c.status.slice(1).replace("_p", "P")}`,
                                  )}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {c.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

                {/* Documents tab */}
                {sidebarTab === "documents" && (
                  <div className="p-2">
                    {!chat.isAuthenticated ? (
                      <p className="text-xs text-gray-400 text-center py-4">
                        {t("lawyer.loginRequired")}
                      </p>
                    ) : (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!!uploadProgress}
                          className="flex items-center gap-2 w-full px-3 py-2 mb-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {uploadProgress
                            ? t("lawyer.uploading")
                            : t("lawyer.uploadDocument")}
                        </button>
                        <p className="text-[10px] text-gray-400 mb-2 px-1">
                          {t("lawyer.uploadHint")}
                        </p>
                        {chat.uploadedDocs.length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-4">
                            {t("lawyer.noDocuments")}
                          </p>
                        )}
                        {chat.uploadedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="group flex items-center gap-2 px-3 py-2 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                {doc.filename}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {(doc.file_size / 1024).toFixed(0)} KB ·{" "}
                                {doc.extracted_length} chars
                              </p>
                            </div>
                            <button
                              onClick={() => chat.removeDocument(doc.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"
                              aria-label={t("lawyer.removeDocument")}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Resources tab */}
                {sidebarTab === "resources" && (
                  <div className="p-2 space-y-1">
                    {[
                      {
                        href: "/visas",
                        label: t("lawyer.resourceVisas"),
                        icon: FileText,
                      },
                      {
                        href: "/marketplace",
                        label: t("lawyer.resourceMarketplace"),
                        icon: Scale,
                      },
                      {
                        href: "/faq",
                        label: t("lawyer.resourceFaq"),
                        icon: MessageSquare,
                      },
                      {
                        href: "/resources",
                        label: t("lawyer.resourceResources"),
                        icon: Link2,
                      },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Shortcuts hint */}
              <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="flex items-center gap-1.5 w-full px-2 py-1 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Keyboard className="w-3 h-3" /> {t("lawyer.shortcuts")}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main area ─── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0b1326]/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-white/10 rounded-lg"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">
                  {t("lawyer.title")}
                </h1>
                <p className="text-[10px] text-blue-300 font-medium">
                  {t("lawyer.subtitle")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!chat.isOnline && (
              <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <WifiOff className="w-3.5 h-3.5" /> {t("lawyer.offline")}
              </span>
            )}
            {chat.isAuthenticated && chat.activeConversationId && (
              <button
                onClick={() => chat.exportPdf(chat.activeConversationId!)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 rounded-lg"
                aria-label={t("lawyer.exportPdf")}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {t("lawyer.exportPdf")}
                </span>
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("lawyer.exit")}
            </button>
          </div>
        </header>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          role="log"
          aria-label="Chat messages"
        >
          {/* Auth gate for anonymous users */}
          {!chat.isAuthenticated && chat.limitReached && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <LogIn className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t("lawyer.loginRequired")}
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {t("lawyer.loginPrompt")}
              </p>
              <div className="flex gap-2">
                <a
                  href="/auth/login"
                  className="flex-1 py-2 text-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {t("lawyer.signIn")}
                </a>
                <a
                  href="/auth/register"
                  className="flex-1 py-2 text-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 rounded-lg"
                >
                  {t("lawyer.register")}
                </a>
              </div>
            </motion.div>
          )}

          {/* Rate limit upsell for authenticated free users */}
          {chat.isAuthenticated && chat.limitReached && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Daily message limit reached
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Free plan includes 5 AI messages per day. Upgrade for unlimited access
                or book a consultation for personalized expert advice.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUpsellModal(true)}
                  className="flex-1 py-2 text-center text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                >
                  Book Consultation
                </button>
                <a
                  href="/pricing"
                  className="flex-1 py-2 text-center text-xs font-medium text-amber-700 dark:text-amber-400 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 rounded-lg"
                >
                  Upgrade Plan
                </a>
              </div>
            </motion.div>
          )}

          {/* Quick prompts */}
          {showQuickPrompts && !chat.limitReached && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.key}
                    onClick={() => {
                      setInputValue("");
                      chat.sendMessage(prompt.question);
                    }}
                    className="group p-3 text-left bg-white/[0.04] border border-white/10 rounded-xl hover:border-blue-300/30 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <prompt.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-white">
                        {t(
                          `lawyer.quick${prompt.key.charAt(0).toUpperCase() + prompt.key.slice(1)}`,
                        )}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/55">
                      {t(
                        `lawyer.quick${prompt.key.charAt(0).toUpperCase() + prompt.key.slice(1)}Desc`,
                      )}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="max-w-3xl mx-auto space-y-4">
            {chat.messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isLatest={
                  idx === chat.messages.length - 1 && msg.role === "assistant"
                }
                copiedId={copiedId}
                onCopy={handleCopy}
                onTogglePin={chat.togglePin}
                t={t}
              />
            ))}

            {/* Loading indicator */}
            {chat.isLoading && !chat.messages.some((m) => m.isStreaming) && (
              <div className="flex items-center gap-2 text-sm text-white/45">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}

            {/* Follow-ups */}
            {chat.followUps.length > 0 && !chat.isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {chat.followUps.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => chat.sendMessage(q)}
                    className="px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Consultation upsell — appears after 5 user messages */}
            {chat.messages.filter((m) => m.role === "user").length >= 5 &&
              !chat.isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-full shrink-0">
                    <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Need a definitive answer?
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Speak directly with a Swiss immigration lawyer — get
                      personalised legal advice in 30 minutes.
                    </p>
                  </div>
                  <a
                    href="/consultation"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                    onClick={() =>
                      analytics.checkoutStarted("consultation_quick")
                    }
                  >
                    Book — CHF 80
                  </a>
                </motion.div>
              )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-white/10 bg-[#0b1326]/75 backdrop-blur-md px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              {chat.isAuthenticated && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-white/50 hover:text-white/80 hover:bg-white/10 rounded-lg shrink-0"
                  aria-label={t("lawyer.uploadDocument")}
                >
                  <Upload className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("lawyer.placeholder")}
                  disabled={chat.limitReached && !chat.isAuthenticated}
                  rows={1}
                  className="w-full resize-none px-4 py-2.5 text-sm text-white bg-white/[0.06] border border-white/12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-white/40 disabled:opacity-50"
                  aria-label={t("lawyer.placeholder")}
                />
              </div>
              <VoiceButton
                isActive={voice.isConnected}
                isSpeaking={voice.isSpeaking}
                onClick={toggleVoiceCall}
                disabled={!voice.isSupported}
              />
              <button
                onClick={handleSend}
                disabled={
                  !inputValue.trim() ||
                  chat.isLoading ||
                  (chat.limitReached && !chat.isAuthenticated)
                }
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-colors"
                aria-label={t("lawyer.send")}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-white/45 mt-1.5 text-center">
              {t("lawyer.disclaimer")}{" "}
              <a href="/marketplace" className="text-blue-400 hover:underline">
                {t("lawyer.findRealLawyer")}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Voice mode overlay */}
      <VoiceModeOverlay
        isOpen={voiceMode && voice.isConnected}
        isListening={voice.isListening}
        isSpeaking={voice.isSpeaking}
        isProcessing={voice.isProcessing}
        isConnected={voice.isConnected}
        transcript={voice.transcript}
        responseText={voiceResponseText}
        onEndCall={() => {
          voice.disconnect();
          setVoiceMode(false);
          setVoiceResponseText("");
        }}
        onInterrupt={voice.interrupt}
        mode="lawyer"
      />

      {/* Voice error toast */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
            onClick={() => setVoiceError(null)}
          >
            {t(voiceError) || voiceError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  {t("lawyer.shortcuts")}
                </h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { keys: "⌘/Ctrl + N", desc: t("lawyer.shortcutNewChat") },
                  { keys: "⌘/Ctrl + K", desc: t("lawyer.shortcutSearch") },
                  { keys: "⌘/Ctrl + E", desc: t("lawyer.shortcutExport") },
                  { keys: "Escape", desc: "Close sidebar / modal" },
                  { keys: "Enter", desc: t("lawyer.send") },
                  { keys: "Shift + Enter", desc: "New line" },
                ].map((s) => (
                  <div
                    key={s.keys}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {s.desc}
                    </span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consultation upsell modal for rate-limited users */}
      <ConsultationUpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble (extracted for readability)
// ---------------------------------------------------------------------------

function MessageBubble({
  msg,
  isLatest,
  copiedId,
  onCopy,
  onTogglePin,
  t,
}: {
  msg: LawyerMessage;
  isLatest: boolean;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onTogglePin: (id: string) => void;
  t: (key: string) => string;
}) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
        <Scale className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            SIP-AI Legal
          </span>
          <ComplexityBadge complexity={msg.complexity} t={t} />
          {msg.pinned && <Pin className="w-3 h-3 text-blue-500" />}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-md px-4 py-3">
          <TypewriterMarkdown
            content={msg.content}
            isStreaming={msg.isStreaming}
            enabled={isLatest}
            charsPerTick={2}
            speed={10}
          />

          {/* Legal basis */}
          {msg.legalBasis && msg.legalBasis.length > 0 && (
            <CollapsibleSection
              title={t("lawyer.legalBasis")}
              icon={BookOpen}
              color="blue"
              onCopy={() =>
                onCopy(msg.legalBasis!.join("\n"), `basis-${msg.id}`)
              }
            >
              <ul className="space-y-1">
                {msg.legalBasis.map((basis, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">§</span>
                    <span>{basis}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Next steps */}
          {msg.nextSteps && msg.nextSteps.length > 0 && (
            <CollapsibleSection
              title={t("lawyer.nextSteps")}
              icon={ChevronRight}
              color="emerald"
              onCopy={() =>
                onCopy(
                  msg.nextSteps!.map((s, i) => `${i + 1}. ${s}`).join("\n"),
                  `steps-${msg.id}`,
                )
              }
            >
              <ol className="space-y-1">
                {msg.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0">
                      {i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CollapsibleSection>
          )}

          {/* Deadlines */}
          {msg.deadlines && msg.deadlines.length > 0 && (
            <CollapsibleSection
              title={t("lawyer.deadlines")}
              icon={Clock}
              color="amber"
            >
              <ul className="space-y-1">
                {msg.deadlines.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Clock className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Costs */}
          {msg.costs && msg.costs.length > 0 && (
            <CollapsibleSection
              title={t("lawyer.costs")}
              icon={DollarSign}
              color="violet"
            >
              <ul className="space-y-1">
                {msg.costs.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <DollarSign className="w-3 h-3 text-violet-500 mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Sources */}
          {msg.sources && msg.sources.length > 0 && (
            <CollapsibleSection
              title={t("lawyer.sources")}
              icon={FileText}
              color="slate"
              defaultOpen={false}
            >
              <ul className="space-y-1">
                {msg.sources.map((s, i) => (
                  <li key={i} className="text-[10px]">
                    <span className="font-medium">{s.file}</span>
                    {s.article && (
                      <span className="text-gray-400"> · {s.article}</span>
                    )}
                    <span className="text-gray-400">
                      {" "}
                      · {(s.score * 100).toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}
        </div>

        {/* Action buttons */}
        {!msg.isStreaming && msg.id !== "welcome" && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCopy(msg.content, msg.id)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              aria-label={t("lawyer.copy")}
            >
              {copiedId === msg.id ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => onTogglePin(msg.id)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              aria-label={
                msg.pinned ? t("lawyer.unpinMessage") : t("lawyer.pinMessage")
              }
            >
              {msg.pinned ? (
                <PinOff className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Pin className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

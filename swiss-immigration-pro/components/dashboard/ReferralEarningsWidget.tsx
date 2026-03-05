"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Copy, Check, Gift } from "lucide-react";
import { api } from "@/lib/api";

interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  referralCode?: string;
}

export default function ReferralEarningsWidget() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const data = await api.get<ReferralStats>("/api/referral/stats");
        if (!cancelled) setStats(data);
      } catch {
        /* non-critical */
      }

      try {
        const codeData = await api.get<{ code?: string; referral_code?: string }>("/api/referral/code");
        const code = codeData.code ?? codeData.referral_code ?? "";
        if (!cancelled && code) {
          setReferralLink(`${window.location.origin}/?ref=${code}`);
        }
      } catch {
        /* non-critical */
      }
    }

    loadStats();
    return () => { cancelled = true; };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked */
    }
  }, [referralLink]);

  if (!stats) return null;

  return (
    <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <Gift className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Referrals</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {stats.totalReferrals} referred
              {stats.convertedReferrals > 0 && (
                <span className="text-green-600 dark:text-green-400 ml-1">
                  ({stats.convertedReferrals} converted)
                </span>
              )}
            </p>
          </div>
        </div>
        {referralLink && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-700 dark:text-orange-300 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Share Link
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

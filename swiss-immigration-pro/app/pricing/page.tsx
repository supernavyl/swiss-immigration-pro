"use client";

import { useSearchParams } from "next/navigation";
import PricingContent from "@/components/pricing/PricingContent";
import ExitIntentPopup from "@/components/marketing/ExitIntentPopup";

export default function PricingPage() {
  const searchParams = useSearchParams();
  const discountCode = searchParams.get("code") || undefined;

  return (
    <div className="min-h-screen bg-white">
      <PricingContent layer="default" discountCode={discountCode} />
      <ExitIntentPopup enabled discountCode="SAVE15" discountPercent={15} />
    </div>
  );
}

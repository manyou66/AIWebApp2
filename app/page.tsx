import { AppHeader } from "@/components/AppHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { DetectionPanel } from "@/components/DetectionPanel";
import { ApiStatus } from "@/components/ApiStatus";
import Link from "next/link";
export default function Home() {
  return (
    <main className="ux-shell">
      <AppHeader />
      <div className="ux-grid">
        <FeatureCard
          title="Object Detection"
          description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
        />
        <FeatureCard
          title="AI Chat"
          description="สนทนากับ Generative AI"
        />
      </div>
      <section className="ux-card">
        <p className="ux-eyebrow">
          NEW IN WEEK 6
        </p>
        <h2>Saved Prompts</h2>
        <p className="ux-muted">
          Save and manage prompt templates
          for future AI Chat features.
        </p>
        <Link
          href="/saved-prompts"
          className="ux-button ux-link-button"
        >
          Open Saved Prompts
        </Link>
      </section>
      <DetectionPanel />
      <ApiStatus />
    </main>
  );
}

"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Download,
  ExternalLink,
  Eye,
  Gamepad2,
  MessageCircle,
  Package,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 8 个模块锚点，与 Tools Grid 卡片及下方 8 个 <section> 一一对应
const SECTION_IDS = [
  "codes",
  "beginner-guide",
  "game-link",
  "map-rooms",
  "monsters-survival",
  "furniture-items",
  "discord-updates",
  "stats-popularity",
] as const;

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.complex-furnishings.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Complex Furnishings Wiki",
        description:
          "Complete Complex Furnishings Wiki covering Roblox codes, items, rooms, entities, selling furniture, beginner tips, updates, and survival routes for Backrooms players.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Complex Furnishings - Backrooms Furniture Survival",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Complex Furnishings Wiki",
        alternateName: "Complex Furnishings",
        url: siteUrl,
        description:
          "Complete Complex Furnishings Wiki resource hub for codes, items, rooms, entities, selling furniture, and survival guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Complex Furnishings Wiki - Backrooms Furniture Survival",
        },
        sameAs: [
          "https://www.roblox.com/games/140202088182537/Complex-Furnishings",
          "https://discord.gg/complexfurnishings",
          "https://www.youtube.com/watch?v=u8mXBIVhNwk",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Complex Furnishings",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Survival", "Exploration", "Horror", "Backrooms"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/140202088182537/Complex-Furnishings",
        },
      },
      {
        "@type": "VideoObject",
        name: "Teaser | Complex Furnishings",
        description:
          "Complex Furnishings teaser trailer showcasing the Backrooms furniture survival gameplay on Roblox.",
        uploadDate: "2026-07-07",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/u8mXBIVhNwk",
        url: "https://www.youtube.com/watch?v=u8mXBIVhNwk",
      },
    ],
  };

  // Module 4 (Map and Rooms) accordion state
  const [mapExpanded, setMapExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/140202088182537/Complex-Furnishings"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="u8mXBIVhNwk"
              title="Teaser | Complex Furnishings"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（前半屏顺序：Hero → 视频 → 模块导航区） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = SECTION_IDS[index] || SECTION_IDS[0];
              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(sectionId);
                  }}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（模板1 Latest Updates 模块，禁止修改/删除） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Complex Furnishings Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Download className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsCodes.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsCodes.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsCodes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {t.modules.complexFurnishingsCodes.cards.map(
              (card: any, index: number) => {
                const isSources = card.status === "official-sources";
                return (
                  <div
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl flex flex-col hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {isSources ? (
                        <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      ) : (
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${card.codes && card.codes.length > 0 ? "bg-[hsl(var(--nav-theme-light))]" : "bg-muted-foreground/50"}`}
                        />
                      )}
                      <h3 className="font-bold text-lg">{card.label}</h3>
                    </div>

                    {isSources ? (
                      <ul className="space-y-3">
                        {card.sources.map((s: any, i: number) => (
                          <li key={i} className="text-sm">
                            <p className="font-semibold text-[hsl(var(--nav-theme-light))]">
                              {s.name}
                            </p>
                            <p className="text-muted-foreground">{s.use}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1">
                        {card.codes && card.codes.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {card.codes.map((code: string, i: number) => (
                              <code
                                key={i}
                                className="px-3 py-1 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-mono"
                              >
                                {code}
                              </code>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-3 italic">
                            No active Complex Furnishings codes published yet.
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {card.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Complex Furnishings Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsBeginnerGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.complexFurnishingsBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Complex Furnishings Game Link */}
      <section id="game-link" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Gamepad2 className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsGameLink.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsGameLink.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsGameLink.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.complexFurnishingsGameLink.cards.map(
              (card: any, index: number) => (
                <a
                  key={index}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors ${index === 0 ? "md:col-span-2 bg-[hsl(var(--nav-theme)/0.05)] border-[hsl(var(--nav-theme)/0.3)]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {card.title}
                      </p>
                      <p className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {card.value}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(var(--nav-theme-light))] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Complex Furnishings Map and Rooms */}
      <section
        id="map-rooms"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Eye className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsMapAndRooms.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsMapAndRooms.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsMapAndRooms.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.complexFurnishingsMapAndRooms.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() =>
                      setMapExpanded(mapExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold">{item.title}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${mapExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mapExpanded === index && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground">
                      {item.content}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Complex Furnishings Monsters and Survival */}
      <section
        id="monsters-survival"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <AlertTriangle className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsMonstersAndSurvival.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsMonstersAndSurvival.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsMonstersAndSurvival.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.complexFurnishingsMonstersAndSurvival.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] font-medium mb-1">
                      Goal: {step.goal}
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Complex Furnishings Furniture and Item */}
      <section
        id="furniture-items"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <Package className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsFurnitureAndItem.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsFurnitureAndItem.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsFurnitureAndItem.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr>
                  {t.modules.complexFurnishingsFurnitureAndItem.columns.map(
                    (col: string, i: number) => (
                      <th key={i} className="text-left p-4 font-semibold">
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.complexFurnishingsFurnitureAndItem.rows.map(
                  (row: any, i: number) => (
                    <tr key={i} className="border-t border-border hover:bg-white/5">
                      <td className="p-4 font-semibold text-[hsl(var(--nav-theme-light))]">
                        {row.type}
                      </td>
                      <td className="p-4 text-muted-foreground">{row.location}</td>
                      <td className="p-4 text-muted-foreground">{row.use}</td>
                      <td className="p-4 text-muted-foreground">{row.tip}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* 移动端堆叠卡片 */}
          <div className="md:hidden space-y-3">
            {t.modules.complexFurnishingsFurnitureAndItem.rows.map(
              (row: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <p className="font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                    {row.type}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">
                      {t.modules.complexFurnishingsFurnitureAndItem.columns[1]}:
                    </span>{" "}
                    {row.location}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">
                      {t.modules.complexFurnishingsFurnitureAndItem.columns[2]}:
                    </span>{" "}
                    {row.use}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {t.modules.complexFurnishingsFurnitureAndItem.columns[3]}:
                    </span>{" "}
                    {row.tip}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Complex Furnishings Discord and Updates */}
      <section
        id="discord-updates"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <MessageCircle className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsDiscordAndUpdates.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsDiscordAndUpdates.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsDiscordAndUpdates.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.complexFurnishingsDiscordAndUpdates.cards.map(
              (card: any, index: number) => (
                <a
                  key={index}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {card.type}
                      </span>
                      <h3 className="font-bold text-lg mt-2">{card.name}</h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(var(--nav-theme-light))] transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium text-foreground">Best for:</span>{" "}
                      {card.bestFor}
                    </span>
                  </p>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Complex Furnishings Stats and Popularity */}
      <section
        id="stats-popularity"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
              <TrendingUp className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.complexFurnishingsStatsAndPopularity.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto mb-3">
              {t.modules.complexFurnishingsStatsAndPopularity.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.complexFurnishingsStatsAndPopularity.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr>
                  {t.modules.complexFurnishingsStatsAndPopularity.columns.map(
                    (col: string, i: number) => (
                      <th key={i} className="text-left p-4 font-semibold">
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {t.modules.complexFurnishingsStatsAndPopularity.rows.map(
                  (row: any, i: number) => (
                    <tr key={i} className="border-t border-border hover:bg-white/5">
                      <td className="p-4 font-semibold">{row.metric}</td>
                      <td className="p-4 text-[hsl(var(--nav-theme-light))] font-medium">
                        {row.value}
                      </td>
                      <td className="p-4 text-muted-foreground">{row.source}</td>
                      <td className="p-4 text-muted-foreground">{row.meaning}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* 移动端堆叠卡片 */}
          <div className="md:hidden space-y-3">
            {t.modules.complexFurnishingsStatsAndPopularity.rows.map(
              (row: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <p className="font-semibold mb-1">{row.metric}</p>
                  <p className="text-[hsl(var(--nav-theme-light))] font-medium text-sm mb-1">
                    {row.value}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">
                      {t.modules.complexFurnishingsStatsAndPopularity.columns[2]}:
                    </span>{" "}
                    {row.source}
                  </p>
                  <p className="text-xs text-muted-foreground">{row.meaning}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner (bottom) */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/complexfurnishings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/140202088182537/Complex-Furnishings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=u8mXBIVhNwk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChurchWebsiteData } from '@/lib/supabase';
import { getTemplateConfig } from '@/lib/templates';

export const revalidate = 60; // Auto-refresh cached pages every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}): Promise<Metadata> {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);

  if (!data) {
    return { title: 'Church Not Found' };
  }

  const { church } = data;
  const locationText = [church.city, church.state].filter(Boolean).join(', ');
  const title = locationText
    ? `${church.name} | Church in ${locationText}`
    : church.name;
  const description =
    church.church_description ||
    church.church_motto ||
    `Welcome to ${church.name}${locationText ? ` in ${locationText}` : ''}. Join us for worship, community events, and ministries.`;

  return {
    title: {
      default: title,
      template: `%s | ${church.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: church.hero_image
        ? [{ url: church.hero_image, alt: church.name }]
        : church.logo_url
        ? [{ url: church.logo_url, alt: church.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);

  if (!data) {
    notFound();
  }

  const { church, weekly_services } = data;
  const theme = getTemplateConfig(church.website_template);
  const brandColor = church.primary_color || '#2563EB';
  const fullAddress =
    church.address ||
    [church.street, church.city, church.state, church.zip_code]
      .filter(Boolean)
      .join(', ');

  // Schema.org Church LocalBusiness Structured Data for Google Local SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: church.name,
    description: church.church_description || church.church_motto || '',
    telephone: church.phone || undefined,
    email: church.email || undefined,
    logo: church.logo_url || undefined,
    image: church.hero_image || church.logo_url || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: church.street || church.address || undefined,
      addressLocality: church.city || undefined,
      addressRegion: church.state || undefined,
      postalCode: church.zip_code || undefined,
    },
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${theme.pageBg} ${theme.bodyClass}`}
      style={{ '--brand-color': brandColor } as React.CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Navigation Bar */}
      <header className={`sticky top-0 z-50 ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link href={`/${site}`} className="flex items-center gap-3">
            {church.logo_url && (
              <img
                src={church.logo_url}
                alt={`${church.name} Logo`}
                className="h-11 w-11 rounded-full object-cover"
              />
            )}
            <span className={`text-xl ${theme.headingClass} ${theme.navText}`}>
              {church.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href={`/${site}`} className={`${theme.navText} hover:opacity-75`}>
              Home
            </Link>
            <Link href={`/${site}/about`} className={`${theme.navText} hover:opacity-75`}>
              About Us
            </Link>
            <Link href={`/${site}/ministries`} className={`${theme.navText} hover:opacity-75`}>
              Ministries
            </Link>
            <Link href={`/${site}/calendar`} className={`${theme.navText} hover:opacity-75`}>
              Calendar
            </Link>
            <Link href={`/${site}/media`} className={`${theme.navText} hover:opacity-75`}>
              Media
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {church.give_link && (
              <a
                href={church.give_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.buttonRadius} text-white transition-transform hover:scale-105`}
                style={{ backgroundColor: brandColor }}
              >
                Give Online
              </a>
            )}
          </div>
        </div>

        {/* Mobile Quick-Nav Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-current/10 py-2.5 px-4 text-xs font-semibold">
          <Link href={`/${site}`}>Home</Link>
          <Link href={`/${site}/about`}>About</Link>
          <Link href={`/${site}/ministries`}>Ministries</Link>
          <Link href={`/${site}/calendar`}>Calendar</Link>
          <Link href={`/${site}/media`}>Media</Link>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* SEO-Rich Footer */}
      <footer className="border-t border-current/10 py-14 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className={`text-lg mb-3 ${theme.headingClass}`}>{church.name}</h3>
            {church.church_motto && (
              <p className={`text-sm mb-4 ${theme.textSecondary}`}>
                {church.church_motto}
              </p>
            )}
            {fullAddress && (
              <p className={`text-sm ${theme.textSecondary}`}>{fullAddress}</p>
            )}
            {church.phone && (
              <p className={`text-sm mt-1 ${theme.textSecondary}`}>{church.phone}</p>
            )}
            {church.email && (
              <p className={`text-sm mt-1 ${theme.textSecondary}`}>{church.email}</p>
            )}
          </div>

          <div>
            <h4 className={`text-base mb-3 ${theme.headingClass}`}>Service Times</h4>
            {weekly_services.length === 0 ? (
              <p className={`text-sm ${theme.textSecondary}`}>
                Contact us for weekly worship times.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {weekly_services.map((s) => (
                  <li key={s.id} className={theme.textSecondary}>
                    <strong className={theme.textPrimary}>{s.day_of_week}:</strong>{' '}
                    {s.service_name} at {s.service_time}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h4 className={`text-base mb-3 ${theme.headingClass}`}>
              Connect on My Fold
            </h4>
            <p className={`text-sm mb-4 ${theme.textSecondary}`}>
              Stay connected with our church directory, groups, and volunteer schedules in the My Fold app.
            </p>
            {church.join_code && (
              <a
                href={`https://eoxrjxejtazpccxjxosh.supabase.co/functions/v1/smart-invite?urlJoinCode=${encodeURIComponent(
                  church.join_code
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block ${theme.buttonRadius} text-white`}
                style={{ backgroundColor: brandColor }}
              >
                Join Code: {church.join_code}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

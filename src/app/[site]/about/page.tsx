import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChurchWebsiteData } from '@/lib/supabase';
import { getTemplateConfig } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'About Us',
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);
  if (!data) notFound();

  const { church, weekly_services } = data;
  const theme = getTemplateConfig(church.website_template);
  const brandColor = church.primary_color || '#2563EB';

  return (
    <div className={`max-w-5xl mx-auto ${theme.sectionPadding}`}>
      <h1 className={`text-4xl md:text-5xl mb-4 ${theme.headingClass}`}>
        About {church.name}
      </h1>
      {church.church_motto && (
        <p className={`text-xl mb-8 ${theme.textSecondary}`}>{church.church_motto}</p>
      )}

      <div className={`p-8 mb-10 ${theme.cardClass}`}>
        <h2 className={`text-2xl mb-4 ${theme.headingClass}`}>Who We Are</h2>
        <p className={`leading-relaxed whitespace-pre-line ${theme.textSecondary}`}>
          {church.church_description ||
            `Welcome to ${church.name}. We are a community committed to worship, fellowship, and serving our neighbors.`}
        </p>
      </div>

      {church.beliefs_text && (
        <div className={`p-8 mb-10 ${theme.cardClass}`}>
          <h2 className={`text-2xl mb-4 ${theme.headingClass}`}>What We Believe</h2>
          <p className={`leading-relaxed whitespace-pre-line ${theme.textSecondary}`}>
            {church.beliefs_text}
          </p>
        </div>
      )}

      {church.pastor_name && (
        <div className={`p-8 mb-10 flex flex-col md:flex-row gap-8 items-center ${theme.cardClass}`}>
          {church.pastor_photo_url && (
            <img
              src={church.pastor_photo_url}
              alt={church.pastor_name}
              className="w-36 h-36 rounded-full object-cover shrink-0"
            />
          )}
          <div>
            <span className={theme.badgeClass}>Leadership</span>
            <h2 className={`text-2xl mt-2 mb-2 ${theme.headingClass}`}>
              {church.pastor_name}
            </h2>
            {church.pastor_bio && (
              <p className={`leading-relaxed whitespace-pre-line ${theme.textSecondary}`}>
                {church.pastor_bio}
              </p>
            )}
          </div>
        </div>
      )}

      <div className={`p-8 ${theme.cardClass}`}>
        <h2 className={`text-2xl mb-4 ${theme.headingClass}`}>
          Location &amp; Service Times
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Address &amp; Contact</h3>
            <p className={theme.textSecondary}>
              {church.address ||
                [church.street, church.city, church.state, church.zip_code]
                  .filter(Boolean)
                  .join(', ')}
            </p>
            {church.phone && <p className={`mt-2 ${theme.textSecondary}`}>Phone: {church.phone}</p>}
            {church.email && <p className={`mt-1 ${theme.textSecondary}`}>Email: {church.email}</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Weekly Gatherings</h3>
            <ul className="space-y-2">
              {weekly_services.map((s) => (
                <li key={s.id} className={theme.textSecondary}>
                  <strong style={{ color: brandColor }}>{s.day_of_week}:</strong>{' '}
                  {s.service_name} ({s.service_time})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

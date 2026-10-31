import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChurchWebsiteData } from '@/lib/supabase';
import { getTemplateConfig } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Events Calendar',
};

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);
  if (!data) notFound();

  const { church, events } = data;
  const theme = getTemplateConfig(church.website_template);

  return (
    <div className={`max-w-6xl mx-auto ${theme.sectionPadding}`}>
      <h1 className={`text-4xl md:text-5xl mb-4 ${theme.headingClass}`}>
        Upcoming Events
      </h1>
      <p className={`text-lg mb-12 ${theme.textSecondary}`}>
        Stay up to date with what is happening at {church.name}.
      </p>

      {events.length === 0 ? (
        <div className={`p-12 text-center ${theme.cardClass}`}>
          <p className={theme.textSecondary}>No upcoming events scheduled right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`p-6 flex flex-col md:flex-row gap-6 items-start md:items-center ${theme.cardClass}`}
            >
              {ev.image_url && (
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="w-full md:w-48 h-36 object-cover rounded-xl shrink-0"
                />
              )}
              <div className="flex-1">
                <span className={theme.badgeClass}>{ev.event_date}</span>
                <h2 className={`text-2xl mt-2 mb-1 ${theme.headingClass}`}>
                  {ev.title}
                </h2>
                {ev.start_time_formatted && (
                  <p className={`text-sm font-medium mb-2 ${theme.textSecondary}`}>
                    {ev.start_time_formatted}
                    {ev.end_time_formatted ? ` – ${ev.end_time_formatted}` : ''}
                  </p>
                )}
                {ev.description && (
                  <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
                    {ev.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

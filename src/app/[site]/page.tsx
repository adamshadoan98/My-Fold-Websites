import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChurchWebsiteData } from '@/lib/supabase';
import { getTemplateConfig } from '@/lib/templates';

export default async function ChurchHomePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);
  if (!data) notFound();

  const { church, weekly_services, events, ministries, videos } = data;
  const theme = getTemplateConfig(church.website_template);
  const brandColor = church.primary_color || '#2563EB';
  const latestVideo = videos[0] || null;
  const featuredEvents = events.slice(0, 3);
  const featuredMinistries = ministries.slice(0, 3);

  return (
    <div>
      {/* PROGRESSIVE HERO SECTION (Changes layout across the 4 templates) */}
      {theme.heroLayout === 'modern-split' && (
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className={theme.badgeClass}>Welcome Home</span>
            <h1 className={`text-5xl md:text-6xl mt-4 mb-6 leading-tight ${theme.headingClass}`}>
              {church.church_motto || `Welcome to ${church.name}`}
            </h1>
            <p className={`text-lg mb-8 ${theme.textSecondary}`}>
              {church.church_description ||
                `Join us this week in ${[church.city, church.state].filter(Boolean).join(', ')}.`}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${site}/about`}
                className={`${theme.buttonRadius} text-white`}
                style={{ backgroundColor: brandColor }}
              >
                Plan Your Visit
              </Link>
              <Link
                href={`/${site}/media`}
                className={`${theme.buttonRadius} border border-zinc-700 text-zinc-100`}
              >
                Watch Sermons
              </Link>
            </div>
          </div>
          {church.hero_image && (
            <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl aspect-[4/3]">
              <img
                src={church.hero_image}
                alt={church.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </section>
      )}

      {theme.heroLayout === 'warm-overlay' && (
        <section className="relative overflow-hidden py-28 px-6 text-white bg-slate-900">
          {church.hero_image && (
            <img
              src={church.hero_image}
              alt={church.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-6xl mb-6 ${theme.headingClass}`}>
              {church.church_motto || `Welcome to ${church.name}`}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              {church.church_description}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href={`/${site}/about`}
                className={`${theme.buttonRadius} text-white`}
                style={{ backgroundColor: brandColor }}
              >
                About Our Church
              </Link>
              <Link
                href={`/${site}/calendar`}
                className={`${theme.buttonRadius} bg-white text-slate-900`}
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {(theme.heroLayout === 'classic-banner' ||
        theme.heroLayout === 'traditional-centered') && (
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs uppercase tracking-widest mb-3 opacity-75">
            {church.city && church.state ? `${church.city}, ${church.state}` : 'Welcome'}
          </p>
          <h1 className={`text-4xl md:text-6xl mb-6 ${theme.headingClass}`}>
            {church.name}
          </h1>
          {church.church_motto && (
            <p className={`text-xl italic mb-8 ${theme.textSecondary}`}>
              &ldquo;{church.church_motto}&rdquo;
            </p>
          )}
          {church.hero_image && (
            <div className="my-8 overflow-hidden rounded-lg border border-current/15 max-h-[460px]">
              <img
                src={church.hero_image}
                alt={church.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className={`max-w-2xl mx-auto text-base leading-relaxed mb-8 ${theme.textSecondary}`}>
            {church.church_description}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/${site}/about`}
              className={`${theme.buttonRadius} text-white`}
              style={{ backgroundColor: brandColor }}
            >
              Learn More About Us
            </Link>
          </div>
        </section>
      )}

      {/* WEEKLY SERVICE TIMES BAR */}
      {weekly_services.length > 0 && (
        <section className={theme.sectionPadding}>
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-2xl md:text-3xl mb-8 text-center ${theme.headingClass}`}>
              Join Us for Worship
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {weekly_services.map((service) => (
                <div key={service.id} className={`p-6 ${theme.cardClass}`}>
                  <span className={theme.badgeClass}>{service.day_of_week}</span>
                  <h3 className={`text-xl mt-3 ${theme.headingClass}`}>
                    {service.service_name}
                  </h3>
                  <p className={`text-lg font-semibold mt-1`} style={{ color: brandColor }}>
                    {service.service_time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS PREVIEW */}
      {featuredEvents.length > 0 && (
        <section className={theme.sectionPadding}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl md:text-3xl ${theme.headingClass}`}>
                Upcoming Events
              </h2>
              <Link
                href={`/${site}/calendar`}
                className="text-sm font-semibold underline"
                style={{ color: brandColor }}
              >
                View Full Calendar
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((ev) => (
                <div key={ev.id} className={`overflow-hidden flex flex-col ${theme.cardClass}`}>
                  {ev.image_url && (
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className={theme.badgeClass}>{ev.event_date}</span>
                    <h3 className={`text-xl mt-3 mb-2 ${theme.headingClass}`}>
                      {ev.title}
                    </h3>
                    {ev.start_time_formatted && (
                      <p className={`text-xs mb-3 ${theme.textSecondary}`}>
                        {ev.start_time_formatted}
                        {ev.end_time_formatted ? ` - ${ev.end_time_formatted}` : ''}
                      </p>
                    )}
                    {ev.description && (
                      <p className={`text-sm line-clamp-3 ${theme.textSecondary}`}>
                        {ev.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MINISTRIES PREVIEW */}
      {featuredMinistries.length > 0 && (
        <section className={theme.sectionPadding}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl md:text-3xl ${theme.headingClass}`}>
                Our Ministries
              </h2>
              <Link
                href={`/${site}/ministries`}
                className="text-sm font-semibold underline"
                style={{ color: brandColor }}
              >
                Explore All Ministries
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMinistries.map((ministry) => (
                <div key={ministry.id} className={`p-6 ${theme.cardClass}`}>
                  <h3 className={`text-xl mb-2 ${theme.headingClass}`}>
                    {ministry.name}
                  </h3>
                  {ministry.meeting_schedule && (
                    <p className="text-xs font-semibold mb-2" style={{ color: brandColor }}>
                      {ministry.meeting_schedule}
                    </p>
                  )}
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {ministry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST SERMON VIDEO */}
      {latestVideo && (
        <section className={theme.sectionPadding}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl md:text-3xl ${theme.headingClass}`}>
                Latest Message
              </h2>
              <Link
                href={`/${site}/media`}
                className="text-sm font-semibold underline"
                style={{ color: brandColor }}
              >
                Watch Archive
              </Link>
            </div>
            <div className={`overflow-hidden p-6 ${theme.cardClass}`}>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.youtube_video_id}`}
                  title={latestVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <h3 className={`text-xl ${theme.headingClass}`}>{latestVideo.title}</h3>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

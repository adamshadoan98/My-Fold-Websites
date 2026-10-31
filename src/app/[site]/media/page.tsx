import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChurchWebsiteData } from '@/lib/supabase';
import { getTemplateConfig } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Media & Sermons',
};

export default async function MediaPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const data = await getChurchWebsiteData(site);
  if (!data) notFound();

  const { church, videos } = data;
  const theme = getTemplateConfig(church.website_template);
  const featured = videos[0] || null;
  const archive = videos.slice(1);

  return (
    <div className={`max-w-7xl mx-auto ${theme.sectionPadding}`}>
      <h1 className={`text-4xl md:text-5xl mb-4 ${theme.headingClass}`}>
        Sermons &amp; Media
      </h1>
      <p className={`text-lg mb-12 ${theme.textSecondary}`}>
        Watch recent messages and livestreams from {church.name}.
      </p>

      {!featured ? (
        <div className={`p-12 text-center ${theme.cardClass}`}>
          <p className={theme.textSecondary}>No videos have been published yet.</p>
        </div>
      ) : (
        <>
          <div className={`p-6 mb-12 ${theme.cardClass}`}>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-6">
              <iframe
                src={`https://www.youtube.com/embed/${featured.youtube_video_id}`}
                title={featured.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <span className={theme.badgeClass}>Featured Message</span>
            <h2 className={`text-2xl md:text-3xl mt-3 mb-2 ${theme.headingClass}`}>
              {featured.title}
            </h2>
            {featured.description && (
              <p className={`text-sm line-clamp-3 ${theme.textSecondary}`}>
                {featured.description}
              </p>
            )}
          </div>

          {archive.length > 0 && (
            <div>
              <h3 className={`text-2xl mb-6 ${theme.headingClass}`}>
                Recent Messages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archive.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`overflow-hidden flex flex-col ${theme.cardClass}`}
                  >
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full aspect-video object-cover"
                      />
                    )}
                    <div className="p-5">
                      <h4 className={`text-lg line-clamp-2 ${theme.headingClass}`}>
                        {video.title}
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

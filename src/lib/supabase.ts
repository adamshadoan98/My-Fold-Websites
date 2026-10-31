import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TemplateKey = 'radiant' | 'bridge' | 'cornerstone' | 'heritage';

export interface ChurchProfile {
  id: string;
  name: string;
  primary_color: string;
  give_link: string | null;
  logo_url: string | null;
  hero_image: string | null;
  church_motto: string | null;
  church_description: string | null;
  pastor_name: string | null;
  pastor_bio: string | null;
  pastor_photo_url: string | null;
  beliefs_text: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  youtube_channel_id: string | null;
  join_code: string | null;
  website_template: TemplateKey;
  website_slug: string;
  custom_domain: string | null;
}

export interface WeeklyService {
  id: string;
  day_of_week: string;
  service_time: string;
  service_name: string;
}

export interface ChurchMinistry {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  meeting_schedule: string | null;
  location: string | null;
  leader_name: string | null;
  contact_email: string | null;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string;
  start_time_formatted: string | null;
  end_time_formatted: string | null;
  start_time: string;
  end_time: string;
}

export interface YoutubeVideo {
  id: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
}

export interface ChurchWebsitePayload {
  church: ChurchProfile;
  weekly_services: WeeklyService[];
  ministries: ChurchMinistry[];
  events: ChurchEvent[];
  videos: YoutubeVideo[];
}

export async function getChurchWebsiteData(
  siteIdentifier: string
): Promise<ChurchWebsitePayload | null> {
  const { data, error } = await supabase.rpc('get_public_church_website', {
    p_identifier: decodeURIComponent(siteIdentifier),
  });

  if (error || !data || !data.church) {
    return null;
  }

  return data as ChurchWebsitePayload;
}

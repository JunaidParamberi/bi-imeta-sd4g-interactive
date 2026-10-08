// Site content, edited by hand (see docs/03-content-guide.md); media entries come from `npm run media:add`.
// Media fields hold CDN keys; mediaUrl() turns a key into a full URL on the media host.
import content from './content.json';

export type ImageMedia = {
  type: 'image';
  full: string;
  thumb: string;
  width: number;
  height: number;
};

export type VideoMedia = {
  type: 'video';
  hls: string;
  width: number;
  height: number;
  duration: number;
  levels: string[];
};

export type Video = { src: VideoMedia; thumb: ImageMedia; caption?: string };

export type List = { listHead: string; listPoints: string[] };

export type Article = {
  heading: string;
  coverImage?: ImageMedia;
  images?: ImageMedia[];
  videos?: Video[];
  article: string;
  lists?: List[];
  subArticles?: { heading: string; article: string }[];
};

export type Country = { country: string; articles: Article[] };

// One tab of a story page: the story's own content is the first tab, `tabs` adds more after it
export type StorySection = {
  title: string;
  text: string;
  coverImage: ImageMedia;
  images: ImageMedia[];
  videos?: Video[];
  lists?: List[];
};

export type Story = StorySection & {
  id: number;
  // URL segment under /more/; falls back to the title
  slug?: string;
  coverText: string;
  tabs?: StorySection[];
};

export const storyPath = (story: Story) => story.slug ?? story.title;

export type TeamMember = {
  name: string;
  occupation: string;
  des: string;
  // members without a photo have an empty string
  image: ImageMedia | '';
};

export type Team = { teamName: string; team: TeamMember[] };

const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE_URL ?? '').replace(/\/$/, '');

export const mediaUrl = (key: string) => `${MEDIA_BASE}/${key}`;

export const countries = content.countries as Country[];
export const stories = content.stories as Story[];
export const team1 = content.team1 as TeamMember[];
export const team2 = content.team2 as Team[];

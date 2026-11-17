/**
 * Pexels clips for the landing slides. Each one shows what its slide talks about.
 * 720p keeps them around 2–3 MB so they start quickly on mobile data.
 */
export const VIDEOS = {
  /** Team working on laptops around a table */
  heroOffice: "https://videos.pexels.com/video-files/3255275/3255275-hd_1280_720_25fps.mp4",
  /** Man enjoying music on headphones at his laptop */
  heroSound: "https://videos.pexels.com/video-files/7171086/7171086-hd_1280_720_25fps.mp4",
  /** Couple on the sofa watching a film on a laptop */
  heroHome: "https://videos.pexels.com/video-files/7227115/7227115-hd_1280_720_25fps.mp4",
  /** Code scrolling on a laptop screen (used if another clip fails to load) */
  fallback: "https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4",
} as const;

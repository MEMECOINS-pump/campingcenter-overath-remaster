/** Equirectangular panoramas from the original 360° tour on ccoverath.de (public/tour/). */
const ids = ['0005', '0006', '0009', '0012', '0014', '0017', '0018', '0020', '0022', '0024', '0026', '0028', '0031'];

export interface TourScene {
  id: string;
  title: string;
  src: string;
  thumb: string;
}

export const tourScenes: TourScene[] = ids.map((id, i) => ({
  id: `s${id}`,
  title: `Station ${i + 1}`,
  src: `tour/scene-${id}.jpg`,
  thumb: `tour/thumbs/scene-${id}.jpg`,
}));

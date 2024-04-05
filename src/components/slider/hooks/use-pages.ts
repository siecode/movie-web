/* eslint no-restricted-imports: 0 */

import { useSliderStore } from '@/providers/slider-provider';

import { MEDIA_QUERY } from '@/lib/constants';

export const usePages = () => {
  const TILES = useSliderStore(state => state.TILES);
  const firstPageLength = useSliderStore(state => state.firstPageLength);
  const lastPageLength = useSliderStore(state => state.lastPageLength);

  const getTilesPerPage = () => {
    const windowWidth = typeof window === 'undefined' ? 0 : window.innerWidth;
    if (windowWidth < MEDIA_QUERY.SM) return 2;
    if (windowWidth < MEDIA_QUERY.MD) return 3;
    if (windowWidth < MEDIA_QUERY.LG) return 4;
    if (windowWidth < MEDIA_QUERY.XL) return 5;
    return 6;
  };

  // +2 for the left and right placeholder pages
  const getMaxPages = () => Math.ceil(TILES.length / getTilesPerPage()) + 2;

  // +1 for left/right placeholders
  const getTotalTiles = (num: number) => (Math.ceil(num) + 1) * getTilesPerPage();

  return { getTilesPerPage, getMaxPages, getTotalTiles, firstPageLength, lastPageLength };
};

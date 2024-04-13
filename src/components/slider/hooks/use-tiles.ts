import { v4 as uuid } from 'uuid';

import { getMapItem } from '@/lib/utils';
import { Movie } from '@/lib/zod-types.ts/modelSchema/MovieSchema';
import { usePageUtils } from '@/components/slider/hooks/use-page-utils';
import { usePagination } from '@/components/slider/hooks/use-pagination/use-pagination';

export const useTiles = () => {
  const {
    state: { TILES, pages, currentPage },
  } = usePagination();
  const { hasPaginated, getTilesPerPage } = usePageUtils();
  const { isMounted } = usePageUtils();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pages.size - 2;
  const tilesPerPage = getTilesPerPage();

  // ──────────────────────────────────────────────────────────────
  const getPrevTile = (): [Movie] | [] => {
    if (!isMounted || !hasPaginated) return [];
    if (isFirstPage) return [{ ...TILES[TILES.length - 1 - tilesPerPage], uuid: uuid() }];
    const prevPageMOre = pages.get(currentPage - 2);
    if (!prevPageMOre) return [{ ...TILES[TILES.length - 1], uuid: uuid() }];
    return [prevPageMOre[tilesPerPage - 1]];
  };

  // ──────────────────────────────────────────────────────────────
  const prevPageTiles =
    !isMounted || !hasPaginated
      ? []
      : getMapItem({
          label: 'LeftPlaceholder: prevPage',
          map: pages,
          key: currentPage - 1,
        });

  // ──────────────────────────────────────────────────────────────
  const currentPageTiles = getMapItem({
    label: 'CurrentPage: currentPageTiles',
    map: pages,
    key: currentPage,
  });

  // ──────────────────────────────────────────────────────────────
  const nextPageTiles = !isMounted
    ? []
    : getMapItem({
        label: 'NextPage: nextPageTiles',
        map: pages,
        key: currentPage + 1,
      });

  // ──────────────────────────────────────────────────────────────
  const getNextTile = (): [Movie] | [] => {
    if (!isMounted) return [];
    if (isLastPage) return [{ ...TILES[tilesPerPage], uuid: uuid() }];
    const nextPageMOre = pages.get(currentPage + 2);
    if (!nextPageMOre) return [{ ...TILES[0], uuid: uuid() }];
    return [nextPageMOre[0]];
  };

  const tilesToRender: Movie[] = [
    ...getPrevTile(),
    ...prevPageTiles,
    ...currentPageTiles,
    ...nextPageTiles,
    ...getNextTile(),
  ];

  return { tilesToRender };
};

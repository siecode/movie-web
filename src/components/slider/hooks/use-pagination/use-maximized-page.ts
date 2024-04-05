/* eslint no-restricted-imports: 0 */

import { useSliderStore } from '@/providers/slider-provider';

import { usePaginationLogger } from '@/lib/logger';
import { Pages, Tile } from '@/lib/types';
import { findIndexFromKey, getMapItem } from '@/lib/utils';
import { usePages } from '@/components/slider/hooks/use-pages';
import { useValidators } from '@/components/slider/hooks/use-validators';

export const useMaximizedPage = () => {
  /** ─────────────────────────────────────────────────────────────────
   *     From [3] tiles to [4] tiles per page
   * ──────────────────────────────────────────────────────────────────
   *
   *     page 0: [7, 8, 9] => page 0: [5, 6, 7, 8]
   *     page 1: [1, 2, 3] => page 1: [9, 1, 2, 3]
   *  -> PAGE 2: [4, 5, 6] => PAGE 2: [4, 5, 6, 7] <-
   *     page 3: [7, 8, 9] => page 3: [8, 9, 1, 2]
   *     page 4: [1, 2, 3] => page 4: [3, 4, 5, 6]
   *
   *     continue maximizing...
   *
   *     page 0: [5, 6, 7, 8] => page 0: [3, 4, 5, 6, 7]
   *     page 1: [9, 1, 2, 3] => page 1: [8, 9, 1, 2, 3]
   *  -> PAGE 2: [4, 5, 6, 7] => PAGE 2: [4, 5, 6, 7, 8] <-
   *     page 3: [8, 9, 1, 2] => page 3: [9, 1, 2, 3, 4]
   *     page 4: [3, 4, 5, 6] => page 4: [5, 6, 7, 8, 9]
   *
   *     continue maximizing...
   *
   *     page 0: [3, 4, 5, 6, 7] => page 0: [1, 2, 3, 4, 5, 6]
   *     page 1: [8, 9, 1, 2, 3] => page 1: [7, 8, 9, 1, 2, 3]
   *  -> PAGE 2: [4, 5, 6, 7, 8] => PAGE 2: [4, 5, 6, 7, 8, 9] <-
   *     page 3: [9, 1, 2, 3, 4] => page 3: [1, 2, 3, 4, 5, 6]
   *     page 4: [5, 6, 7, 8, 9]
   *
   * ──────────────────────────────────────────────────────────────────
   *
   *     page 0: [7, 8, 9] => page 0: [3, 4, 5, 6]
   *     page 1: [1, 2, 3] => page 1: [7, 8, 9, 1]
   *     page 2: [4, 5, 6] => page 2: [2, 3, 4, 5]
   *  -> PAGE 3: [7, 8, 9] => PAGE 3: [6, 7, 8, 9] <-
   *     page 4: [1, 2, 3] => page 4: [1, 2, 3, 4]
   *
   *     continue maximizing...
   *
   *     page 0: [3, 4, 5, 6] => page 0: [8, 9, 1, 2, 3]
   *     page 1: [7, 8, 9, 1] => page 1: [4, 5, 6, 7, 8]
   *     page 2: [2, 3, 4, 5] => page 2: [9, 1, 2, 3, 4]
   *  -> PAGE 3: [6, 7, 8, 9] => PAGE 3: [5, 6, 7, 8, 9] <-
   *     page 4: [1, 2, 3, 4] => page 4: [1, 2, 3, 4, 5]
   *
   * ────────────────────────────────────────────────────────────────── */

  const TILES = useSliderStore(state => state.TILES);
  const pages = useSliderStore(state => state.pages);
  const maxPages = useSliderStore(state => state.maxPages);
  const setAllPages = useSliderStore(state => state.setAllPages);
  const currentPage = useSliderStore(state => state.currentPage);
  const { validatePages } = useValidators();
  const { getTilesPerPage, getTotalTiles } = usePages();

  const goToMaximizedPage = () => {
    usePaginationLogger.maximized();

    const firstTileCurrentPage = getMapItem({
      label: 'goToMaximizedPage() - firstTilePrevPage',
      map: pages,
      key: currentPage,
    })[0];

    const firstTileCurrentPageIndex = findIndexFromKey({
      label: 'goToMaximizedPage()',
      array: TILES,
      key: 'id',
      value: firstTileCurrentPage.id,
    });

    // TODO: When we are on last page, we need to minus 1 from the current page index
    const index =
      currentPage === maxPages - 2 ? firstTileCurrentPageIndex - 1 : firstTileCurrentPageIndex;

    const newPages: Pages = new Map<number, Tile[]>();
    const newTilesPerPage = getTilesPerPage();
    let newFirstPageLength = newTilesPerPage;
    const newLastPageLength = newTilesPerPage;

    const leftTilesTotal = getTotalTiles(index / newTilesPerPage);
    const rightTilesTotal = getTotalTiles((TILES.length - index) / newTilesPerPage);

    const newTilesTotal = leftTilesTotal + rightTilesTotal;
    let newCurrentPage = -1;

    let startIndex = (index - leftTilesTotal + TILES.length) % TILES.length;
    let tempTiles: Tile[] = [];
    for (let i = 0; i < newTilesTotal; i++) {
      if (startIndex >= TILES.length) startIndex = 0;

      const pageNumber = Math.floor(i / newTilesPerPage);
      const idMatches = tempTiles.some(tile => tile.id === firstTileCurrentPage.id);
      if (idMatches && pageNumber > 1 && newCurrentPage === -1) newCurrentPage = pageNumber;

      tempTiles.push(TILES[startIndex++]);
      if (tempTiles.length !== newTilesPerPage) continue;

      const firstTileIndex = tempTiles.findIndex(tile => tile.id === TILES.at(0)?.id);
      if (firstTileIndex > 0) {
        const tilesNeeded = tempTiles.slice(0, firstTileIndex).length;
        if (pageNumber === 1) newFirstPageLength = newTilesPerPage - tilesNeeded;
      }

      newPages.set(pageNumber, tempTiles);
      tempTiles = [];
    }

    const newMaxPages = newPages.size;

    console.table({
      startIndex: startIndex,
      firstTileCurrentPage: firstTileCurrentPage.id,
      newCurrentPage: newCurrentPage,
      leftTilesTotal: leftTilesTotal,
      rightTilesTotal: rightTilesTotal,
      totalTiles: leftTilesTotal + rightTilesTotal,
      newTilesPerPage: newTilesPerPage,
      newMaxPages: newMaxPages,
      newFirstPageLength: newFirstPageLength,
      newLastPageLength: newLastPageLength,
    });

    [...newPages.entries()]
      .sort((a, b) => a[0] - b[0])
      .forEach(([pageIndex, tiles]) => {
        console.log(
          `Page ${pageIndex}:`,
          tiles.map(card => (card ? card.id : undefined))
        );
      });

    validatePages({
      label: 'useMinimizedPage()',
      pages: newPages,
      expectedMaxPages: newMaxPages,
      expectedTilesPerPage: newTilesPerPage,
    });

    setAllPages({
      pages: newPages,
      currentPage: newCurrentPage,
      maxPages: newMaxPages,
      tilesPerPage: newTilesPerPage,
      firstPageLength: newFirstPageLength,
      lastPageLength: newLastPageLength,
    });
  };
  return { goToMaximizedPage };
};

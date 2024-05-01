'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useDebounceValue } from 'usehooks-ts';

import { MediaType, TODO } from '@/types/global';
import { Movie, MovieList, SearchResultsSchema, Tv, TvList } from '@/types/tmdb';
import { QUERY } from '@/lib/constants';
import { cn, extractYear, fetcher, isMovie, isNullish } from '@/lib/utils';
import { BodyMedium, BodySmall, HeadingExtraSmall, HeadingSmall } from '@/components/fonts';

const SearchResult = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounceValue(query, 300);

  useEffect(() => setQuery(searchParams.get(QUERY) || ''), [searchParams]);

  const {
    data: swrData,
    error: swrError,
    isLoading,
  } = useSWR(debouncedQuery ? `/api/search?q=${encodeURIComponent(debouncedQuery)}` : null, fetcher);

  if (isLoading || !swrData) return <></>;
  if (swrError) throw new Error('Failed to load search results');

  const { success, data: mediaData, error } = SearchResultsSchema.safeParse(swrData.data);
  if (!success) throw new Error(`SearchResult() Invalid search results schema: ${error.message}`);

  return (
    <div className='flex flex-col gap-8 px-leftRightCustom pt-24'>
      <div className='flex flex-row gap-2'>
        <HeadingSmall className='text-muted-foreground'>Search result for: </HeadingSmall>
        <HeadingSmall>{query}</HeadingSmall>
      </div>

      <div
        className={cn('grid grid-cols-3 gap-x-2 gap-y-6 ', 'sm:gap-x-4', 'lg:grid-cols-4', 'xl:grid-cols-5')}
      >
        <Tiles data={mediaData?.movieData} mediaType='movie' />
        <Tiles data={mediaData?.tvData} mediaType='tv' />
      </div>
    </div>
  );
};

export default SearchResult;

type TilesProps = {
  data: MovieList | TvList;
  mediaType: MediaType;
};

const Tiles = ({ data, mediaType }: TilesProps) => {
  const { results } = data;

  return (
    <>
      {results.map(tile => {
        const title = isMovie<Movie, Tv>(tile, mediaType)
          ? isNullish(tile.title, tile.original_title)
          : isNullish(tile.name, tile.original_name);

        const releaseDate = isMovie<Movie, Tv>(tile, mediaType)
          ? isNullish(tile.release_date)
          : isNullish(tile.first_air_date);

        return (
          <div key={tile.id} className='flex flex-col'>
            <div
              className='relative aspect-poster w-full overflow-hidden rounded-2xl bg-muted/50 shadow-tileShadow sm:aspect-video'
              key={tile.id}
            >
              {tile.backdrop_path || tile.poster_path ? (
                <>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${tile.backdrop_path || tile.poster_path}`}
                    alt={title}
                    priority
                    unoptimized
                    fill
                    className='object-cover max-sm:hidden'
                  />
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${tile.poster_path || tile.backdrop_path}`}
                    alt={title}
                    priority
                    unoptimized
                    fill
                    className='object-cover sm:hidden'
                  />
                </>
              ) : (
                <div className='absolute bottom-0 z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent px-4 py-8'>
                  <HeadingExtraSmall className='line-clamp-2'>{title}</HeadingExtraSmall>
                </div>
              )}
            </div>

            <div className='pt-3 max-sm:hidden'>
              <div className='flex flex-col'>
                <BodyMedium className='line-clamp-1'>{title}</BodyMedium>
                <BodySmall className='line-clamp-1'>{extractYear(releaseDate)}</BodySmall>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
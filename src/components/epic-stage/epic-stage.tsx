import Image from 'next/image';
import { fetchTMDB } from '@/actions/fetch-tmdb';

import { EpicStageCategory, MediaType, MOVIE_GENRES, TV_GENRES } from '@/types/global';
import { Movie, MovieListSchema, Tv, TvListSchema } from '@/types/tmdb';
import { getFirstSentence, isMovie, isNullish } from '@/lib/utils';
import ThumbnailLink from '@/components/epic-stage/thumbnail-link';
import { HeadingLarge } from '@/components/fonts';

type EpicStageProps = {
  mediaType: MediaType;
  category?: EpicStageCategory;
};

const EpicStage = async ({ mediaType, category = 'popular' }: EpicStageProps) => {
  const media = await fetchTMDB({ mediaType, category });
  const schema = mediaType === 'movie' ? MovieListSchema : TvListSchema;

  const { success, data, error } = schema.safeParse(media);
  if (!success) throw new Error(`EpicStage() Invalid ${mediaType} schema: ${error.message}`);

  const firstResult = data.results[0];

  const isMovieType = isMovie<Movie, Tv>(firstResult, mediaType);

  // prettier-ignore
  const genresObject = isMovieType
    ? MOVIE_GENRES
    : TV_GENRES;

  const alt = isMovieType
    ? isNullish(firstResult.title, firstResult.original_title)
    : isNullish(firstResult.name, firstResult.original_name);

  // prettier-ignore
  const title = isMovieType
    ? isNullish(firstResult.title)
    : isNullish(firstResult.name);

  return (
    <ThumbnailLink id={firstResult.id}>
      <div className='relative mb-4 mt-16 aspect-video overflow-hidden min-[1700px]:rounded-b-2xl'>
        <Image
          src={`https://image.tmdb.org/t/p/original${firstResult.backdrop_path || firstResult.poster_path}`}
          alt={alt}
          priority
          fill
          className='object-cover'
        />

        <div className='absolute bottom-0 left-0 right-0 z-10 h-1/2 bg-gradient-to-t from-black' />

        <div className='absolute bottom-0 left-0 z-40 flex w-1/2 flex-col gap-2 p-10'>
          <HeadingLarge>{title}</HeadingLarge>
          <ul className='flex flex-row gap-2'>
            {firstResult?.genre_ids?.map((genreId: number) => (
              <li key={genreId}>
                <p className='text-genre'>{genresObject[genreId]}</p>
              </li>
            ))}
          </ul>
          <p className='text-overview'>{getFirstSentence(isNullish(firstResult.overview))}</p>
        </div>
      </div>
    </ThumbnailLink>
  );
};

export default EpicStage;
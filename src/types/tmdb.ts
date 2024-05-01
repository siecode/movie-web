import { z } from 'zod';

const BaseMediaSchema = z.object({
  id: z.number(),
  backdrop_path: z.string().nullable(),
  poster_path: z.string().nullable(),
  overview: z.string().nullable(),
  genre_ids: z.array(z.number()).nullable(),
  original_language: z.string().nullable(),
  vote_count: z.number().nullable(),
});

const MovieSchema = BaseMediaSchema.merge(
  z.object({
    original_title: z.string().nullable(),
    title: z.string().nullable(),
    release_date: z.string().nullable(),
  })
);

const TvSchema = BaseMediaSchema.merge(
  z.object({
    original_name: z.string().nullable(),
    name: z.string().nullable(),
    first_air_date: z.string().nullable(),
  })
);

const MediaListSchema = z.object({
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  media_type: z.union([z.literal('movie'), z.literal('tv')]).optional(),
});

export const MovieListSchema = MediaListSchema.extend({ results: z.array(MovieSchema) });
export const TvListSchema = MediaListSchema.extend({ results: z.array(TvSchema) });

export type MovieList = z.infer<typeof MovieListSchema>;
export type TvList = z.infer<typeof TvListSchema>;
export type MediaList = MovieList | TvList;
export type Movie = z.infer<typeof MovieSchema>;
export type Tv = z.infer<typeof TvSchema>;

export const CastSchema = z.object({
  id: z.number(),
  cast_id: z.number().optional().nullable(),
  credit_id: z.string().nullable(),
  name: z.string().nullable(),
  original_name: z.string().nullable(),
  profile_path: z.string().nullable(),
  character: z.string().nullable(),
  adult: z.boolean().nullable(),
  gender: z.number().nullable(),
  known_for_department: z.string().nullable(),
});

export const CreditsSchema = z.object({
  id: z.number(),
  cast: z.array(CastSchema),
});

export type Cast = z.infer<typeof CastSchema>;
export type Credits = z.infer<typeof CreditsSchema>;

const VideoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  key: z.string().nullable(),
  site: z.string().nullable(),
  type: z.string().nullable(),
  official: z.boolean().nullable(),
  published_at: z.string().nullable(),
});

export const VideoListSchema = z.object({
  id: z.number(),
  results: z.array(VideoSchema),
});

export type Video = z.infer<typeof VideoSchema>;
export type VideoList = z.infer<typeof VideoListSchema>;

const BaseDetailsSchema = z.object({
  id: z.number(),
  backdrop_path: z.string(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  homepage: z.string().nullable(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  overview: z.string(),
  popularity: z.number().optional(),
  poster_path: z.string(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    })
  ),
  tagline: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const MovieDetailsSchema = BaseDetailsSchema.extend({
  title: z.string(),
  original_title: z.string(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string(),
      backdrop_path: z.string(),
    })
    .nullable(),
  imdb_id: z.string(),
  release_date: z.string(),
  runtime: z.number(),
  budget: z.number(),
  revenue: z.number(),
});

export const TvDetailsSchema = BaseDetailsSchema.extend({
  name: z.string(),
  first_air_date: z.string(),
  languages: z.array(z.string()),
  number_of_episodes: z.number(),
  number_of_seasons: z.number(),
  original_name: z.string(),
  seasons: z.array(
    z.object({
      air_date: z.string(),
      episode_count: z.number(),
      id: z.number(),
      name: z.string(),
      overview: z.string().nullable(),
      poster_path: z.string().nullable(),
      season_number: z.number(),
      vote_average: z.number().nullable(),
    })
  ),
});

export type MovieDetails = z.infer<typeof MovieDetailsSchema>;
export type TvDetails = z.infer<typeof TvDetailsSchema>;

const KeywordSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const KeywordMovieSchema = z.object({
  id: z.number(),
  keywords: z.array(KeywordSchema),
});

export const KeywordTvSchema = z.object({
  id: z.number(),
  results: z.array(KeywordSchema),
});

export type KeywordMovie = z.infer<typeof KeywordMovieSchema>;
export type KeywordTv = z.infer<typeof KeywordTvSchema>;

export const SearchResultsSchema = z.object({
  movieData: MovieListSchema,
  tvData: TvListSchema,
});

export type SearchResults = z.infer<typeof SearchResultsSchema>;
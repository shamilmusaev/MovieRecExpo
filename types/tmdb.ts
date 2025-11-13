// TMDB API Types

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_name: string;
  genre_ids: number[];
  origin_country: string[];
}

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBWatchProvider {
  results: {
    [key: string]: {
      link?: string;
      flatrate?: TMDBProvider[];
      buy?: TMDBProvider[];
      rent?: TMDBProvider[];
    };
  };
}

export interface TMDBProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: TMDBGenre[];
  homepage?: string;
  imdb_id?: string;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  revenue: number;
  runtime?: number;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline?: string;
  videos: TMDBPaginatedResponse<TMDBVideo>;
  similar: TMDBPaginatedResponse<TMDBMovie>;
  watch_providers: TMDBWatchProvider;
}

export interface TMDBProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Internal app types (derived from TMDB)
export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  popularity: number;
  isAdult: boolean;
  originalLanguage: string;
  originalTitle: string;
  genreIds: number[];
  hasVideo: boolean;
  type: 'movie';
}

export interface TVShow {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  popularity: number;
  isAdult: boolean;
  originalLanguage: string;
  originalTitle: string;
  genreIds: number[];
  originCountries: string[];
  type: 'tv';
}

export interface Video {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt: string;
  language: string;
  country: string;
}

export interface Genre {
  id: number;
  name: string;
}

export type ContentItem = Movie | TVShow;
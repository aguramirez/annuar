// Interfaz actualizada para movie.d.ts para que coincida con movies.json
// Recomendado ponerlo en src/types/movie.d.ts

export interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  heroImage: string;
  synopsis: string;
  trailerUrl: string;
  rating: number;
  showtimes: {
    date: string;
    times: string[] | {
      id?: string;
      time: string;
      room?: string;
      available?: number;
      total?: number;
    }[];
  }[];
}

// Interfaz para usar en componentes
export interface ShowTime {
  id?: string;
  time: string;
  room?: string;
  available?: number;
  total?: number;
}

// Interfaz para asegurarnos de que tenemos el formato correcto
export interface ProcessedMovie {
  id: number;
  title: string;
  director: string;
  genre: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  heroImage: string;
  synopsis: string;
  trailerUrl: string;
  rating: number;
  showtimes: {
    date: string;
    times: ShowTime[];
  }[];
}
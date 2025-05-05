// src/apps/website/types/routeParams.ts
// Define these interfaces in a central location for reuse

/**
 * Parameters for movie detail page URL
 */
export interface MovieDetailParams {
    id: string;
    [key: string]: string | undefined; // Required for React Router params
  }
  
  /**
   * Parameters for payment page URL
   */
  export interface PaymentParams {
    reservationId: string;
    [key: string]: string | undefined; // Required for React Router params
  }
  
  /**
   * Parameters for seat selection page URL
   */
  export interface SeatSelectionParams {
    showId: string;
    [key: string]: string | undefined; // Required for React Router params
  }
  
  // Then import and use these in your components:
  // import { MovieDetailParams } from '../types/routeParams';
  // const { id } = useParams<MovieDetailParams>();
export interface ApiResponse<T, E> {
  data: T
  error: E
  ok: boolean
}

export type AuthApiResponse = ApiResponse<string | null, string | null>
export type DeleteApiResponse = ApiResponse<{ rows_affected: number }, string>
export type PutApiResponse = ApiResponse<{ rows_affected: number }, string>

export interface TournamentInfo {
  tournament_id: number
  tournament_name: string
  tournament_year: number
  tournament_location_city: string
  tournament_location_name: string
  tournament_stage: number
  tournament_host: string
}

export interface CountryInfo {
  country_name: string
  country_code: string
}

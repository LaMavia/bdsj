export interface ApiResponse<T, E = string> {
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
  tournament_location_id: number
  tournament_stage: number
  tournament_host_code: string
  tournament_host_name: string
  tournament_participant_count: number
  tournament_country_count: number
  tournament_total_tickets: number
}

export interface CountryInfo {
  country_name: string
  country_code: string
}

export interface LocationInfo {
  location_id: number
  location_name: string
  location_city: string
  location_country_code: string
}

export interface PersonShortInfo {
  person_firstname: string,
  person_lastname: string,
  person_id: number
}

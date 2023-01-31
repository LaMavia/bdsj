type Option<T> = T | undefined
type i32 = number
type i64 = number
type f64 = number

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

export interface CountryEntryInfo {
  country_code: string
  country_name: string
  country_tournaments: number
  country_participants: number
}

export interface CountryDescInfo {
  country_code: string
  country_name: string
  country_tournaments: number
  country_participants: number
  country_nationals: number
  country_points: number
}

export interface LocationInfo {
  location_id: number
  location_name: string
  location_city: string
  location_country_code: string
  location_country_name: string
}

export interface PersonShortInfo {
  person_first_name: string
  person_last_name: string
  person_nationality: string
  person_gender: string
  person_id: number
}

export interface PersonInfo {
  person_id: number
  person_first_name: string
  person_last_name: string
  person_gender: string
  person_nationality_code: string
  person_nationality_name: string
  person_points: i32
  person_participations: i32
}

export interface RoundShort {
  round_id: number
  round_date: string
}

export interface StageInfo {
  stage_nr: number
  stage?: String
  qualifier?: RoundShort
  first?: RoundShort
  second?: RoundShort
}

export interface RoundEntry {
  participant_id: i32
  participant_country_code: String
  position_initial: i32
  position_final: Option<i32>
  person_id: i32
  person_first_name: String
  person_last_name: String
  jump_score: Option<f64>
  jump_distance: Option<f64>
  score: Option<f64>
  disqualification_reason: String
}

export interface PersonEntry {
  person_id: i32
  person_first_name: String
  person_last_name: String
  person_gender: String
  person_nationality: String
  person_points: i32
}

export interface TournamentShortInfo {
  tournament_id: i32
  tournament_name: String
  tournament_year: i32
  tournament_location_city: String
  tournament_location_name: String
  tournament_location_id: i32
  tournament_host: String
}

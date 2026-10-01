export type Role = 'administrador' | 'solicitante';
export type UserType = 'estudiante' | 'docente' | 'administrativo' | 'externo';
export type ReservationStatus = 'confirmada' | 'rechazada' | 'cancelada';
export interface ApiResponse<T> { success: boolean; data: T; message?: string; errors?: Record<string, string[]>; }
export interface AuthUser { id: number; nombre: string; correo?: string; rol: Role; tipo_usuario?: UserType; }
export interface AuthData { token: string; user: AuthUser; }
export interface Court { id_cancha: number; nombre: string; tipo_superficie: string; descripcion?: string; }
export interface Schedule { id_horario: number; id_cancha: number; dia_semana: string; hora_inicio: string; hora_fin: string; estado: string; }
export interface ReservationSchedule { id: number; dia_semana: string; hora_inicio: string; hora_fin: string; }
export interface ReservationCourt { id: number; nombre: string; tipo_superficie: string; }
export interface Reservation { id_reserva: number; id_solicitante: number; id_horario: number; fecha_reserva: string; estado: ReservationStatus; observaciones?: string; horario?: ReservationSchedule; cancha?: ReservationCourt; }

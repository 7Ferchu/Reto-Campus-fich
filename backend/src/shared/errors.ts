export class AppError extends Error {
  constructor(public status: number, message: string, public details?: unknown) { super(message); }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error interno del servidor';
}

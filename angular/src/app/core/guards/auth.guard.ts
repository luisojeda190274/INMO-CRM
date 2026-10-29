import { CanActivateFn } from '@angular/router';

/**
 * Authentication & Role Guard for Nexo Inmobiliario
 * Prepared for Firebase Auth / Cloud SQL Auth integration
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  // Current prototype allows all active authenticated sessions
  return true;
};

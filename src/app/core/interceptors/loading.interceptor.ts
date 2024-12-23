import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService); // Use `inject` to access services

  busyService.busy(); // Indicate loading started

  return next(req).pipe(
    delay(1000), // Simulate delay (optional)
    finalize(() => busyService.idle()) // Indicate loading stopped
  );
};

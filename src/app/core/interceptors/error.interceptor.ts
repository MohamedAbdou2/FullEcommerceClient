import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 401:
            toastr.error(error.error.message, error.status.toString());
            break;
          case 400:
            if (error.error.errors) {
              throw error.error; // rethrow validation errors
            } else {
              toastr.error(error.error.message, error.status.toString());
            }
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toastr.error('An unexpected error occurred', 'Error');
        }
      }
      return throwError(() => new Error(error.message));
    })
  );
};

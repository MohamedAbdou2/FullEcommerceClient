import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { take, switchMap, Observable } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    take(1),
    switchMap(user => {
      const token = user?.token;

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      return next(request);
    })
  );
};

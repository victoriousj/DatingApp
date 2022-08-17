import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private toastr: ToastrService) {}

    private badRequest(error: any) {
        if (error.error.errors) {
            const modalStateErrors = [];
            for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                }
            }
            throw modalStateErrors.flat();
        } else if (typeof error.error === 'object') {
            this.toastr.error(error.statusText, error.status);
        } else {
            this.toastr.error(error.error, error.status);
        }
    }

    private unathorized(error: any) {
        this.toastr.error(error.error.title, error.status);
    }

    private notFound(error: any) {
        this.router.navigateByUrl('/not-found');
    }

    private serverError(error: any) {
        const navigationExtras: NavigationExtras = {
            state: { error: error.error },
        };
        this.router.navigateByUrl('/server-error', navigationExtras);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error) => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            this.badRequest(error);
                            break;

                        case 401:
                            this.unathorized(error);
                            break;

                        case 404:
                            this.notFound(error);
                            break;

                        case 500:
                            this.serverError(error);
                            break;

                        default:
                            this.toastr.error('Something unexpected went wrong');
                            console.log(error);
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }
}

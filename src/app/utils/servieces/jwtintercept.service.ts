import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { TokenService } from './token.service';
import { TOKEN_HEADER_KEY } from '../constants/securityConsts.consts';


@Injectable({
    providedIn: 'root'
})
export class JWTInterceptService implements HttpInterceptor {
    constructor(private readonly tokenService: TokenService) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenService.authorizationToken;
        return token
            ? next.handle(req.clone({
                  headers: req.headers.set(TOKEN_HEADER_KEY, token)
              }))
            : next.handle(req);
    }
}

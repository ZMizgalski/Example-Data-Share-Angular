import { JWTToken } from '../models/JwtToken';
import { untilDestroyed } from '@ngneat/until-destroy';
import { TokenService } from './token.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Data, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';


export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    return inject(PermissionService).canActivate(next, state);
}

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    constructor(private readonly tokenService: TokenService) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return of(this.tokenService.jwtTokenDecodedData)
            .pipe(
                map((decodedToken) => this.authorize(route.data, decodedToken)),
                untilDestroyed(this)
            );
    }

    private authorize(data: Data, token: JWTToken | null): boolean {
        if (!token || this.tokenService.isExpired()) return false;

        return token.roles.some((role) => data['roles']?.includes(role));
    }
}

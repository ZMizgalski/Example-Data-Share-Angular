import { Role } from './../models/roles';

import jwt_decode from 'jwt-decode';
import { JWTToken } from '../models/JwtToken';
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants/securityConsts.consts';


@Injectable({
    providedIn: 'root'
})
export class TokenService {
    public authorizationToken: string | null = null;

    public get jwtTokenDecodedData(): JWTToken | null {
        const token = this.separatedToken;
        return token ? jwt_decode<JWTToken>(token) : null
    }

    private get separatedToken(): string | null {
        return this.authorizationToken?.split(' ')[1] ?? null;
    }

    private get storageToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
    }

    public hasRole(role: Role): boolean {
        return !!this.jwtTokenDecodedData?.roles.includes(role);
    }

    public hasRoles(roles: Role[]): boolean {
        return !!this.jwtTokenDecodedData?.roles.every((role) => roles.includes(role));
    }

    public isExpired(): boolean {
        const decodedToken = this.jwtTokenDecodedData;
        return decodedToken ? decodedToken.exp < new Date().getMilliseconds() : false;
    }

    public logout(): void {
        this.clearTokenStorage();
        this.authorizationToken = null;
    }

    public getToken(): string | null {
        this.authorizationToken = this.storageToken;
        return this.authorizationToken;
    }

    public saveToken(token: string, remember: boolean): void {
        this.updateToken(token, remember);
        this.authorizationToken = token;
    }

    private updateToken(token: string, remember: boolean): void {
        if (remember) {
            this.updateLocalStorage(token);
        } else {
            this.updateSessionStorage(token);
        }
    }

    private clearTokenStorage(): void {
        window.localStorage.clear();
        window.sessionStorage.clear();
    }

    private updateLocalStorage(token: string): void {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
    }

    private updateSessionStorage(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }
}

import { HttpHeaders } from "@angular/common/http";

export const TOKEN_KEY: string = 'auth-token';
export const TOKEN_HEADER_KEY: string = 'Authorization';

export const StaffURL: string = '/api/staff/';
export const AuthURL: string = '/api/auth/';

export const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

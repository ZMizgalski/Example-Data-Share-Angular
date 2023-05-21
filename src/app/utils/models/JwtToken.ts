import { Role } from './roles';


export interface JWTToken {
    id: string
    email: string;
    roles: Role[];
    sub: string;
    iat: number; // generation Time
    exp: number; // expiration Time
}

import { Role, RequestRole } from './roles';


export interface User {
    id: string;
    username: string;
    email: string;
    roles: Role[];
}

export type UserRequest = Omit<User, 'id' | 'roles'> & { roles: RequestRole[], password: string };

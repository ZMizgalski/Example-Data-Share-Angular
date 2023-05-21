import { Role } from './roles';

export interface Route {
    path: string;
    params?: string;
}

export interface NavRoute {
    route?: Route;
    roles: Role[];
    routeName: string;
    onAction?: () => void;
    showOnMobile?: boolean;
}

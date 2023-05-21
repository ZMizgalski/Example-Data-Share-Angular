import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PageSize } from "../constants/routeConsts.consts";
import { AuthURL, httpOptions, StaffURL } from "../constants/securityConsts.consts";
import { MessageResponse } from "../models/response/MessageResponse";
import { UserRequest, User } from "../models/user";
import { RouteByUser } from "../models/routeByUser";
import { LoginRequest } from "../models/request/loginRequest";
import { ContentResponse } from "../models/response/contentResponse";
import { PageResponse, FileResponse } from "../models/response/fileResponse";
import { LoginResponse } from "../models/response/loginResponse";


@Injectable({
    providedIn: 'root'
})
export class EndpointsService {
    constructor(private http: HttpClient) {}

    public register(data: UserRequest): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(AuthURL + 'register', data, httpOptions);
    }

    public login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(AuthURL + 'login', data, httpOptions);
    }

    public getAllUsers(): Observable<RouteByUser[]> {
        return this.http.get<RouteByUser[]>(StaffURL + 'getTeachersNames');
    }

    public getAllUsersAdmin(pageSize?: number | null, pageNumber?: number | null): Observable<PageResponse<User>> {
        return this.http.get<PageResponse<User>>(StaffURL + 'getAllTeachersNames', {
            params: {
                pageSize: pageSize && !isNaN(pageSize) && pageSize > 0 ? pageSize : PageSize,
                pageNumber: pageNumber && !isNaN(pageNumber) && pageNumber >= 1 ? pageNumber : 0
            }
        });
    }

    public getUserContent(id: string): Observable<ContentResponse> {
        return this.http.get<ContentResponse>(StaffURL + 'getTeacherContent/' + id);
    }

    public getAllFilesByName(name: string, pageSize?: number | null, pageNumber?: number | null): Observable<PageResponse<FileResponse>> {
        return this.http.get<PageResponse<FileResponse>>(StaffURL + 'getAllFilesBy/' + name, {
            params: {
                pageSize: pageSize && !isNaN(pageSize) && pageSize > 0 ? pageSize : PageSize,
                pageNumber: pageNumber && !isNaN(pageNumber) && pageNumber >= 1 ? pageNumber : 0
            }
        });
    }

    public updateDescription(id: string, content: string): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(StaffURL + 'updateDescription', { id, content }, httpOptions);
    }

    public deleteFileById(id: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(StaffURL + 'deleteFileById/' + id);
    }

    public pushFileToStorage(id: string, file: File): Observable<HttpEvent<unknown>> {
        const data: FormData = new FormData();
        data.append('file', file);
        const newRequest = new HttpRequest('POST', StaffURL  + 'upload/' + id, data, {
            reportProgress: true,
            responseType: 'text'
        });
        return this.http.request(newRequest);
    }

    public deleteUser(id: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(StaffURL + 'deleteTeacherById/' + id);
    }

    public forgotPassword(email: string): Observable<MessageResponse> {
        return this.http.post<MessageResponse>(StaffURL + 'forgotPassword', { email }, httpOptions );
    }
}

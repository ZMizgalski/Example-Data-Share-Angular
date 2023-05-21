import { Roles } from './../utils/models/roles';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { NavRoute } from './../utils/models/navRoutes';
import { RouteByUser } from '../utils/models/routeByUser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../utils/servieces/token.service';
import { MatSidenav } from '@angular/material/sidenav';
import { LazyGetter } from 'lazy-get-decorator';
import { UntilDestroy } from '@ngneat/until-destroy';
import { retry, tap, finalize, BehaviorSubject } from 'rxjs';
import { EndpointsService } from '../utils/servieces/endpoints.service';
import { ResponsiveService } from '../utils/servieces/responsive.service';


@UntilDestroy()
@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
      public showLoader = new BehaviorSubject<boolean>(true);
      public usersToRoute: RouteByUser[] = [];

      public readonly routes: NavRoute[] = [
        {
            roles: [ Roles.ROLE_ADMIN, Roles.ROLE_USER ],
            routeName: 'Logout',
            onAction: () => this.logout(),
            showOnMobile: true
        },
        {
            route: { path: '/admin-panel' },
            roles: [ Roles.ROLE_ADMIN ],
            routeName: 'Add User'
        },
        {
            route: { path: '/addFile' },
            roles: [ Roles.ROLE_USER ],
            routeName: 'Add File'
        },
        {
            route: { path: '/account' },
            roles: [ Roles.ROLE_ADMIN, Roles.ROLE_USER ],
            routeName: 'Profile'
        },
        {
            route: { path: '/content', params: 'id' },
            roles: [ Roles.ROLE_USER ],
            routeName: 'Content'
        }
    ];

    @ViewChild('drawer') drawer?: MatSidenav;

    constructor(
        public readonly responsiveService: ResponsiveService,
        public readonly endpointsService: EndpointsService,
        public readonly tokenService: TokenService,
        private readonly router: Router
    ) {}

    @LazyGetter()
    public get id(): string | null {
        return this.tokenService.jwtTokenDecodedData?.id ?? null;
    }

    public ngOnInit(): void {
        if (this.tokenService.authorizationToken) {
            this.showLoader.next(false);
        } else {
            this.initRoutes();
        }
    }

    public logout(): void {
        this.tokenService.logout();
        this.router.navigate(['/login']);
        this.showLoader.next(true);
        this.initRoutes();
    }

    private initRoutes(): void {
        this.endpointsService.getAllUsers()
            .pipe(
                finalize(() => this.showLoader.next(false)),
                retry(3),
                tap((response) => this.initializeData(response)),
                untilDestroyed(this)
            )
            .subscribe();
    }

    private initializeData(response: RouteByUser[]): void {
        this.usersToRoute = response;
    }
}

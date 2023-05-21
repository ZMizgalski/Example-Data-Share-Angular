import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/utils/servieces/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { of, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/utils/models/user';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { PageResponse } from '../utils/models/response/fileResponse';
import { AbstractPagingBase } from '../utils/abstractPagingBase';


@UntilDestroy()
@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent extends AbstractPagingBase<User> implements OnInit {
    public columnsNames: string[] = ['Name', 'Email', 'Delete'];

    @ViewChild(MatSort) override sort?: MatSort;

    constructor(
        public responsiveService: ResponsiveService,
        public tokenService: TokenService,
        private matDialog: MatDialog,
        private matSnackBar: MatSnackBar,
        private endpointsService: EndpointsService,
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly router: Router,
        protected override readonly route: ActivatedRoute
    ) {
        super(cdr, router, route);
    }

    override getData(): Observable<PageResponse<User>> {
        return this.endpointsService.getAllUsersAdmin(this.pageSize, this.pageNumber)
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.getDataWrapper().subscribe();
    }

    public addTeacher(): void {
        const dialogRef = this.matDialog.open(AddUserDialogComponent, {
            height: '100dvh',
            width: '100dvw'
        });

        dialogRef.afterClosed().subscribe((update: boolean) => {
            if (update) this.getDataWrapper().subscribe();
        });
    }

    public deleteUser(id: string): void {
        this.endpointsService.deleteUser(id)
            .pipe(
                switchMap(() => this.getDataWrapper()),
                catchError((response: HttpErrorResponse) => of(response.message)
                    .pipe(
                        tap((message) => this.matSnackBar.open(message, 'Close', { verticalPosition: 'top' }))
                    )
                ),
                untilDestroyed(this)
            )
            .subscribe();
    }
}

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService } from '../../utils/servieces/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { untilDestroyed } from '@ngneat/until-destroy';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';
import { FileResponse, PageResponse } from 'src/app/utils/models/response/fileResponse';
import { AbstractPagingBase } from 'src/app/utils/abstractPagingBase';
import { ContentResponse } from 'src/app/utils/models/response/contentResponse';


@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent extends AbstractPagingBase<FileResponse> implements OnInit  {
    public columnsNames: string[] = ['File Name', 'Action'];
    public content: ContentResponse | null = null;
    public processValue = 0;

    public showLoader = new BehaviorSubject<boolean>(true);

    @ViewChild(MatSort) override sort?: MatSort;

    constructor(
        public readonly responsiveService: ResponsiveService,
        public readonly tokenService: TokenService,
        private readonly matSnackBar: MatSnackBar,
        private readonly endpointsService: EndpointsService,
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly router: Router,
        protected override readonly route: ActivatedRoute
    ) {
        super(cdr, router, route);
    }

    override getData(): Observable<PageResponse<FileResponse>> {
        this.tableData.filter = '';

        return this.endpointsService
            .getAllFilesByName(
                this.content?.name ?? '',
                this.pageSize,
                this.pageNumber
            )
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.initRouteParamsSubscription();
    }

    public downloadMyFile(fileName: string, href: string): void {
        const link = document.createElement('a');

        link.setAttribute('target', '_blank');
        link.setAttribute('href', href);
        link.setAttribute('download', fileName);

        document.body.appendChild(link);

        link.click();
        link.remove();
    }

    public deleteFile(id: string): void {
        this.endpointsService.deleteFileById(id)
            .pipe(
                tap((response) => this.matSnackBar.open(response.message, 'Close', { verticalPosition: 'top' })),
                switchMap(() => this.getDataWrapper()),
                catchError((response: HttpErrorResponse) => of(response.message)
                    .pipe(tap((message) => this.matSnackBar.open(message, 'Close', { verticalPosition: 'top' })))
                ),
                untilDestroyed(this)
            )
            .subscribe();
    }

    private initContent(id: string): void {
        this.endpointsService.getUserContent(id)
            .pipe(
                tap((response) => this.content = response),
                switchMap(() => this.getDataWrapper()),
                catchError((response: HttpErrorResponse) => of(response)
                    .pipe(tap(() => {
                        this.processValue = 0;
                        this.router.navigate(['/not-found']);
                    }))
                ),
                finalize(() => {
                    this.processValue = 100;
                    this.showLoader.next(false);
                }),
                untilDestroyed(this)
            )
            .subscribe();
    }

    private initRouteParamsSubscription(): void {
        this.route.paramMap.pipe(untilDestroyed(this)).subscribe(params => {
            const id = params.get('id');

            if (id) {
                this.showLoader.next(true);
                this.processValue = 0;
                this.initContent(id);
            }
        });
    }
}

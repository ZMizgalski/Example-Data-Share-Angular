import { finalize, retry, switchMap } from 'rxjs/operators';
import { PageResponse } from './models/response/fileResponse';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, OnInit, ViewChild, AfterViewInit, Directive } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Observable, filter, tap } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { PageSize } from './constants/routeConsts.consts';


@UntilDestroy()
@Directive()
export abstract class AbstractPagingBase<T> implements OnInit, AfterViewInit {
    public pageNumber = 0;
    public pageSize = 10;

    public data: PageResponse<T> | null = null;
    public tableData: MatTableDataSource<T> = new MatTableDataSource();

    @ViewChild(MatSort) abstract sort?: MatSort;

    constructor(
        protected readonly cdr: ChangeDetectorRef,
        protected readonly router: Router,
        protected readonly route: ActivatedRoute
    ) {}

    abstract getData(): Observable<PageResponse<T>>;

    public ngOnInit(): void {
        this.setPageableFromRouter();
    }

    public ngAfterViewInit(): void {
        this.tableData.sort = this.sort ?? null;
    }

    protected getDataWrapper(): Observable<PageResponse<T>> {
        return this.getData().pipe(
            finalize(() => this.cdr.detectChanges()),
            tap((response) => {
                this.data = response;
                this.updateTableData();
            }),
            retry(3),
            untilDestroyed(this)
        )
    }

    protected applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;

        if (this.tableData) {
            this.tableData.filter = filterValue.trim().toLowerCase();
        }

        if (this.tableData?.paginator) {
            this.tableData.paginator.firstPage();
        }
    }

    protected handlePageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageNumber = event.pageIndex;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber
            },
            queryParamsHandling: 'merge'
        });
    }

    protected updateTableData(): void {
        this.tableData.data = this.data?.content ?? [];
        this.cdr.detectChanges();
    }

    protected setPageableFromRouter(): void {
        this.route.queryParamMap
            .pipe(
                filter(() => !!this.data?.content),
                tap((params) => {
                    this.pageSize = Number(params.get('pageSize')) || PageSize;
                    this.pageNumber = Number(params.get('pageNumber'));
                }),
                switchMap(() => this.getDataWrapper()),
                untilDestroyed(this)
            )
            .subscribe();
  }
}

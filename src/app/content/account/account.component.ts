import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, tap, retry, of, finalize } from 'rxjs';
import { JWTToken } from './../../utils/models/JwtToken';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from 'src/app/utils/servieces/token.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { EditDescDialogComponent } from './edit-desc-dialog/edit-desc-dialog.component';
import { ContentResponse } from 'src/app/utils/models/response/contentResponse';


@UntilDestroy()
@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    public showLoader = new BehaviorSubject(true);
    public jwtToken: JWTToken | null = null;
    public content: ContentResponse | null = null;

    constructor(
        private readonly endpointsService: EndpointsService,
        public readonly tokenService: TokenService,
        private readonly matDialog: MatDialog
    ) {}

    public ngOnInit(): void {
        this.jwtToken = this.tokenService.jwtTokenDecodedData;

        if (this.jwtToken?.id) this.initContent();
    }

    public editDescription(): void {
        const dialogRef = this.matDialog.open(EditDescDialogComponent , {
            data: this.content,
            height: '100dvh',
            width: '100dvw'
        });

        dialogRef.afterClosed().subscribe((update: boolean) => {
            if (this.jwtToken?.id && update) this.initContent();
        });
    }

    private initContent(): void {
        this.showLoader.next(true);

        this.endpointsService.getUserContent(this.jwtToken!.id)
            .pipe(
                finalize(() => this.showLoader.next(false)),
                tap((response) => this.content = response),
                retry(3),
                catchError((response: HttpErrorResponse) => of(response)
                    .pipe(
                        tap(() => this.showLoader.next(false))
                    )
                ),
                untilDestroyed(this)
            )
            .subscribe();
    }
}

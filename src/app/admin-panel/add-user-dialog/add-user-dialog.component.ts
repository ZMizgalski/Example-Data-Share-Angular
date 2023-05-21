import { HttpErrorResponse } from '@angular/common/http';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, finalize, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';


@UntilDestroy()
@Component({
    selector: 'app-add-user-dialog',
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent {
    public showLoader = new BehaviorSubject<boolean>(false);
    public registerForm = this.formBuilder.group({
        username : [ null, Validators.minLength(3) ],
        email : [ null, Validators.email ],
        password : [ null, Validators.minLength(8) ],
        roles: [ ['teacher'] , Validators.required ],
    });

    constructor(
        public readonly dialog: MatDialogRef<AddUserDialogComponent>,
        public readonly responsiveService: ResponsiveService,
        private readonly formBuilder: FormBuilder,
        private readonly matSnackBar: MatSnackBar,
        private readonly endpointsService: EndpointsService
    ) {}


    public onSubmit(): void {
        this.showLoader.next(true);

        this.endpointsService.register({
            username: this.registerForm.controls['username'].value ?? '',
            email: this.registerForm.controls['email'].value ?? '',
            roles: ['user'],
            password: this.registerForm.controls['password'].value ?? ''
        }).pipe(
            finalize(() => this.showLoader.next(false)),
            tap((response) => {
                this.matSnackBar.open(response.message, 'Close', { verticalPosition: 'top' });
                this.dialog.close(true);
            }),
            catchError((response: HttpErrorResponse) => of(response.message).pipe(
                    tap((message) => {
                        this.matSnackBar.open(message, 'Close', { verticalPosition: 'top' });
                    })
                )
            ),
            untilDestroyed(this)
        )
        .subscribe();
    }
}

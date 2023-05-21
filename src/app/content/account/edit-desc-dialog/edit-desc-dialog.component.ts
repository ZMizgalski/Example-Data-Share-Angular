import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, of, tap, finalize } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContentResponse } from 'src/app/utils/models/response/contentResponse';


@UntilDestroy()
@Component({
    selector: 'app-edit-desc-dialog',
    templateUrl: './edit-desc-dialog.component.html',
    styleUrls: ['./edit-desc-dialog.component.scss']
})
export class EditDescDialogComponent {
    public content: ContentResponse | null = null;
    public showLoader = new BehaviorSubject<boolean>(false);

    public registerForm: FormGroup = this.formBuilder.group({
        content: ['', Validators.required]
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: ContentResponse,
        public editDescDialog: MatDialogRef<EditDescDialogComponent>,
        private formBuilder: FormBuilder,
        private matSnackBar: MatSnackBar,
        private endpointsService: EndpointsService,
    ) {
        editDescDialog.disableClose = true;
        this.content = this.dialogData;
        this.registerForm.controls['content'].patchValue(this.content.content);
    }

    public onSubmit() {
      const content = this.registerForm.controls['content'].value;

      this.endpointsService.updateDescription(this.content!.id, content)
          .pipe(
              finalize(() => this.editDescDialog.close(true)),
              tap((response) => this.matSnackBar.open(response.message, 'Close', { verticalPosition: 'top' })),
              catchError((error: HttpErrorResponse) => of(error.message).pipe(
                  tap((message) => this.matSnackBar.open(message, 'Close', { verticalPosition: 'top' })))
              ),
              untilDestroyed(this)
          )
          .subscribe();
    }
}

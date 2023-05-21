import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    public registerForm = this.formBuilder.group({
        email: [ '', {
              validators: [
                    Validators.email,
                    Validators.required,
                    Validators.minLength(3)
                ]
            }
        ]
    });

    constructor(
        public readonly responsiveService: ResponsiveService,
        private readonly formBuilder: FormBuilder,
        private readonly endpointsService: EndpointsService,
        private readonly router: Router,
        private readonly matSnackBar: MatSnackBar,
    ) {}

    public onSubmit(): void {
      this.endpointsService.forgotPassword(this.registerForm.controls.email.value!)
          .subscribe({
              next: () => {
                  this.matSnackBar.open('Email has been sent', 'Close', { verticalPosition: 'top' });
                  this.router.navigate(['/login']);
              },
              error: () => {
                  this.matSnackBar.open('Wrong email or not exists', 'Close', { verticalPosition: 'top' });
              }
          });
    }
}

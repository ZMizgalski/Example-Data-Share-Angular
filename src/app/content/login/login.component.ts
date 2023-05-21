import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { tap, finalize, of } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from 'src/app/utils/servieces/token.service';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public registerForm: FormGroup = this.formBuilder.group({
        username: [ null, Validators.minLength(3) ],
        password: [ null, Validators.minLength(8) ],
        remember: [ false, Validators.required ]
    });

    constructor(
        private readonly matSnackBar: MatSnackBar,
        private readonly formBuilder: FormBuilder,
        private readonly endpointsService: EndpointsService,
        private readonly tokenService: TokenService,
        private readonly router: Router
    ) {}

    public onSubmit(): void {
      const username = this.registerForm?.controls['username'].value;
      const password = this.registerForm?.controls['password'].value;
      const remember = this.registerForm?.controls['remember'].value;

      this.endpointsService.login({ username, password })
          .pipe(
              finalize(() => this.router.navigate(['/account'])),
              tap((response) => this.tokenService.saveToken(`${response.type} ${response.token}`, remember)),
              catchError((error: HttpErrorResponse) => of(error.message).pipe(
                  tap((message) => this.matSnackBar.open(message, 'Close', { verticalPosition: 'top' })))
              ),
              untilDestroyed(this)
          )
          .subscribe();
    }
}

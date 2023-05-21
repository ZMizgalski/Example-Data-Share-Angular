import { TokenService } from './utils/servieces/token.service';
import { ObtainToken } from './utils/servieces/utils/obtainToken.initializer';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ContentComponent } from './content/content/content.component';
import { LoginComponent } from './content/login/login.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageNotFoundComponent } from './content/page-not-found/page-not-found.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AccountComponent } from './content/account/account.component';
import { AddFileComponent } from './content/add-file/add-file.component';
import { DndDirective } from './content/add-file/dnd.directive';
import { ForgotPasswordComponent } from './content/forgot-password/forgot-password.component';
import { JWTInterceptService } from './utils/servieces/jwtintercept.service';
import { MatTableModule } from '@angular/material/table';
import { EditDescDialogComponent } from './content/account/edit-desc-dialog/edit-desc-dialog.component';
import { AddUserDialogComponent } from './admin-panel/add-user-dialog/add-user-dialog.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';


@NgModule({
    declarations: [
        AppComponent,
        MainNavComponent,
        ContentComponent,
        LoginComponent,
        PageNotFoundComponent,
        AccountComponent,
        AddFileComponent,
        EditDescDialogComponent,
        DndDirective,
        AdminPanelComponent,
        AddUserDialogComponent,
        ForgotPasswordComponent,
    ],
    imports: [
        BrowserModule,
        MatTableModule,
        HttpClientModule,
        MatSnackBarModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatDialogModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatCheckboxModule
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: ObtainToken, deps: [ TokenService ], multi: true },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
        { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptService, multi: true }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}

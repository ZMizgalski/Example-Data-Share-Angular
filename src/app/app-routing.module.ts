import { Roles } from './utils/models/roles';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content/content/content.component';
import { LoginComponent } from './content/login/login.component';
import { PageNotFoundComponent } from './content/page-not-found/page-not-found.component';
import { AccountComponent } from './content/account/account.component';
import { AuthGuard } from './utils/servieces/auth-guard.service';
import { AddFileComponent } from './content/add-file/add-file.component';
import { ForgotPasswordComponent } from './content/forgot-password/forgot-password.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';


const routes: Routes = [
    {
        path: 'admin-panel',
        component: AdminPanelComponent,
        canActivate: [ AuthGuard ],
        data: {
            roles: [ Roles.ROLE_ADMIN ]
        }
    },
    {
        path: 'addFile',
        component: AddFileComponent,
        canActivate: [ AuthGuard ],
        data: {
            roles: [ Roles.ROLE_USER ]
        }
    },
    {
        path: 'account',
        component: AccountComponent,
        canActivate: [ AuthGuard ],
        data: {
            roles: [
                Roles.ROLE_USER,
                Roles.ROLE_ADMIN
            ]
        }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'reset-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'content/:id',
        component: ContentComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'not-found',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {}

import { Component } from '@angular/core';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';


@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
    constructor(public readonly responsiveService: ResponsiveService) {}
}

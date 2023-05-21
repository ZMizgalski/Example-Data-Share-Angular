import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Observable, map, shareReplay } from "rxjs";


@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
    public isHandset: Observable<boolean> = this.observeBreakpoint(Breakpoints.Handset);

    constructor(private readonly breakpointObserver: BreakpointObserver) {}

    private observeBreakpoint(breakpoint: string): Observable<boolean> {
        return this.breakpointObserver
            .observe(breakpoint)
            .pipe(
                map(result => result.matches),
                shareReplay(),
                untilDestroyed(this)
            );
    }
}

import { concatMap, mergeMap, scan, tap, toArray, catchError } from 'rxjs/operators';
import { FileModel } from './../../utils/models/FileModel';
import { Component } from '@angular/core';
import { TokenService } from '../../utils/servieces/token.service';
import { LazyGetter } from 'lazy-get-decorator';
import { of, BehaviorSubject, map, filter, from } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PageEvent } from '@angular/material/paginator';
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EndpointsService } from 'src/app/utils/servieces/endpoints.service';
import { ResponsiveService } from 'src/app/utils/servieces/responsive.service';


interface Upload {
    progress: number
}

const isHttpResponse = <T>(event: HttpEvent<T>): event is HttpResponse<T> => {
    return event.type === HttpEventType.Response
}

const isHttpProgressEvent = (
    event: HttpEvent<unknown>
): event is HttpProgressEvent => {
  return (
      event.type === HttpEventType.DownloadProgress ||
      event.type === HttpEventType.UploadProgress
  )
}

const calculateState = (
    upload: Upload,
    event: HttpEvent<unknown>
): Upload => {
    if (isHttpProgressEvent(event)) {
      return {
        progress: event.total
          ? Math.round((100 * event.loaded) / event.total)
          : upload.progress
      }
    }

    if (isHttpResponse(event)) {
      return {
        progress: 100
      }
    }

    return upload;
}

@UntilDestroy()
@Component({
    selector: 'app-add-file',
    templateUrl: './add-file.component.html',
    styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent {
    public files = new BehaviorSubject<FileModel[] | null>(null);

    public pageIndex = 0;
    public pageSize = 5;

    constructor(
      public responsiveService: ResponsiveService,
      private endpointsService: EndpointsService,
      private tokenService: TokenService
    ) {}

    @LazyGetter()
    public get id(): string | null {
        return this.tokenService.jwtTokenDecodedData?.id ?? null;
    }

    public get paginatedFiles(): FileModel[] {
        return this.files.getValue()?.slice(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize
        ) ?? [];
    }

    public color(file: FileModel): string {
        return file.error
            ? 'warn'
            : file?.progress === 100
                ? 'accent'
                : 'primary';
    }

    public fileBrowseHandler(event: Event): void {
        const files = (event.target as HTMLInputElement).files;

        if (files && files.length > 0) {
            this.prepareFilesList(Array.from(files));
        }
    }

    public deleteFile(index: number): void {
        this.files.getValue()?.splice(index, 1);
    }

    public handlePageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
    }

    public prepareFilesList(files: File[]): void {
        if (this.id) {
            this.files.next(null);
            this.uploadFilesToDatabase(files.map((file) => ({ file, progress: 0, error: false })));
        }
    }

    private uploadFilesToDatabase(files: FileModel[]): void {
        of(files).pipe(
            filter((files) => !!files),
            mergeMap((files) =>
                from(files!).pipe(
                    concatMap((file) =>
                        this.endpointsService.pushFileToStorage(this.id!, file.file).pipe(
                            scan(calculateState, { progress: 0 }),
                            map((uploadProgress) => {
                                file.progress = uploadProgress.progress;
                                return file;
                            }),
                            tap(() => this.files.next(files)),
                            catchError((error: HttpErrorResponse) => of(error).pipe(
                                tap(() => file.error = true)
                            ))
                        )
                    ),
                    toArray()
                )
            ),
            untilDestroyed(this)
        )
        .subscribe();
    }
}

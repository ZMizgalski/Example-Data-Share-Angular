import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';


@Directive({
    selector: '[appDnd]'
})
export class DndDirective {
    @HostBinding('class.fileover') fileOver = false;
    @Output() fileDropped = new EventEmitter<File[]>();

    @HostListener('dragover', ['$event'])
    public onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = true;
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = false;
    }

    @HostListener('drop', ['$event'])
    public ondrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = false;
        const files = event.dataTransfer?.files;

        if (files && files.length > 0) {
            this.fileDropped.emit(Array.from(files));
        }
    }
}

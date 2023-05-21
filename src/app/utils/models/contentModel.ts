import { ContentResponse } from "./response/contentResponse";
import { PageResponse, FileResponse } from "./response/fileResponse";


export class ContentModel {
    public content?: ContentResponse;
    public pageable?: PageResponse<FileResponse>;

    constructor(content?: ContentResponse, pageable?: PageResponse<FileResponse>) {
        this.content = content;
        this.pageable = pageable;
    }

    public get files(): FileResponse[] {
        return this.pageable?.content ?? [];
    }
}

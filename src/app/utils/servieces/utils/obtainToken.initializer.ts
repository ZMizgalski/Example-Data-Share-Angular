import { Observable, of } from 'rxjs';
import { TokenService } from "../token.service";


export const ObtainToken = (tokenService: TokenService): () => Observable<string | null> => {
    return () => of(tokenService.getToken());
};

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, finalize, Observable } from "rxjs";
import { BusyService } from "../services/busy.service";


@Injectable({
    providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor{


    constructor(private busyService: BusyService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.method === 'POST' && req.url.includes('order')){
            return next.handle(req);
        }
        if(req.method === 'DELETE'){
            return next.handle(req);
        }
        if(req.url.includes('emailexists')){
            this.busyService.busy();
        }
        this.busyService.busy();
        return next.handle(req).pipe(
            finalize(() =>{
                this.busyService.idle();
            })
        )
    }
    
}
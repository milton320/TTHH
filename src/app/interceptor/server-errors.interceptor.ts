import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, retry, tap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ToastModule } from 'primeng/toast';
import { MessageService } from "primeng/api";
import { Injectable } from "@angular/core";

 @Injectable({
    providedIn: 'root'
 })

export class ServerErrorsInterceptor implements HttpInterceptor
{
    constructor(private router:Router,
        
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(retry(environment.RETRY))
        .pipe(tap(event =>{
            if(event instanceof HttpResponse){
                if(event.body && event.body.console.error == true && event.body.errorMessage){
                    throw new Error(event.body.errorMessage)
                }
            }
        })).pipe(catchError(err =>{
           /*  if(err.status === 400){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
            }
            else if(err.status === 404){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
            }
            else if(err.status == 403 || err.status === 401 ){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
            }
            else if(err.status === 500){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
            }
            else{
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
            } */

            return EMPTY
        }))
    }
}
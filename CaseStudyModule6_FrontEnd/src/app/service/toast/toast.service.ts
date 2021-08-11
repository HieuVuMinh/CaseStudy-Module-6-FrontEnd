import { Injectable } from '@angular/core';
import {toast} from "bulma-toast";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  showMessageSuccess(message: string, type: any){
    toast({
      message: message,
      type: type,
      position: 'top-right',
      closeOnClick: true,
      pauseOnHover: true,
      opacity: 0.8,
    })
  }
}

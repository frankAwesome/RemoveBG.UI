import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForegroundService{
  private messageSource = new BehaviorSubject('../../assets/img/image2.png');
  currentMessage = this.messageSource.asObservable();

  myString = '';

  constructor() 
  {
   }


   changeMessage(message: string) {
    this.messageSource.next(message)
  }

  getString(): string {
    return this.myString;
  }
}

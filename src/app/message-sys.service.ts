import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageSysService {
  messages: string[] = [];

  addMess(message: string) {
    this.messages.unshift(message);
  }
  clear() {
    this.messages = [];
  }
  constructor() {}
}

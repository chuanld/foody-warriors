import { Component, OnInit, OnChanges } from '@angular/core';
import { MessageSysService } from '../message-sys.service';

@Component({
  selector: 'app-message-sys',
  templateUrl: './message-sys.component.html',
  styleUrls: ['./message-sys.component.css'],
})
export class MessageSysComponent implements OnInit, OnChanges {
  timeInfo: number = 5;
  constructor(public messageSysService: MessageSysService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    const dueTime = setInterval(() => {
      this.timeInfo = this.timeInfo - 1;
      if (this.timeInfo == -1) {
        clearInterval(dueTime);
        return;
      }
    }, 1000);

    setTimeout(() => {
      this.messageSysService.messages.splice(
        this.messageSysService.messages.length - 2,
        this.messageSysService.messages.length
      );
    }, 5000);
  }
}

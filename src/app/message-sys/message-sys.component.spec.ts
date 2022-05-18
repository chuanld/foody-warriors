import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSysComponent } from './message-sys.component';

describe('MessageSysComponent', () => {
  let component: MessageSysComponent;
  let fixture: ComponentFixture<MessageSysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageSysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

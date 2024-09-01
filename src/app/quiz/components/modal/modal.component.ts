import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() public show = false;

  @Input() public title = '';

  @Output() public buttonEmitter = new EventEmitter();

  public buttonClick(): void {
    this.buttonEmitter.emit();
  }
}

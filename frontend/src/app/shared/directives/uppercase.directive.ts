import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[uppercase]',
  standalone: true
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.toUpperCase();
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

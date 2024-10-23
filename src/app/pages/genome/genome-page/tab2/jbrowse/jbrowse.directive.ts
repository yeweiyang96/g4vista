import { Directive, ElementRef, Input, inject } from '@angular/core';
import { ComponentProps, ElementType, createElement } from 'react';
import { Root, createRoot } from 'react-dom/client';

@Directive({
  selector: '[reactComponent]',
  standalone: true,
})
export class ReactComponentDirective<Comp extends ElementType> {
  @Input() reactComponent!: Comp;
  @Input() props!: ComponentProps<Comp>;

  private root = createRoot(inject(ElementRef).nativeElement);

  ngOnChanges() {
    this.root.render(createElement(this.reactComponent, this.props));
  }

  ngOnDestroy() {
    this.root.unmount();
  }
}

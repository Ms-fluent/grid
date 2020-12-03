import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsGridItemDef} from './grid-item-def';

export class MsGridItemContext<T> {
  odd: boolean;
  even: boolean;
  first: boolean;
  last: boolean;

  constructor(public $implicit: T,
              public index: number, total: number) {
    this.odd = index % 2 === 1;
    this.even = !this.odd;
    this.first = index === 0;
    this.last = index === total - 1;
  }

  setData(index: number, total: number) {
    this.index = index;
    this.odd = index % 2 === 1;
    this.even = !this.odd;
    this.first = index === 0;
    this.last = index === total - 1;
  }
}




let _gridItemUniqueId = 0;

@Component({
  template: `
      <ng-container #view></ng-container>`,
  selector: 'msGridItem, [msGridItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ms-gridItem'
  }
})
export class MsGridItem<T> implements AfterViewInit {
  public _uniqueId = `ms-gridItem-${_gridItemUniqueId++}`;

  @ViewChild('view', {read: ViewContainerRef})
  viewContainer: ViewContainerRef;

  constructor(private elementRef: ElementRef<HTMLElement>,
              public changeDetectorRef: ChangeDetectorRef,
              private gridItemDef: MsGridItemDef<T>, public context: MsGridItemContext<T>) {
  }

  ngAfterViewInit(): void {
    const viewRef = this.viewContainer.createEmbeddedView(this.gridItemDef.template, this.context);
    viewRef.detectChanges();
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get value(): T {
    return this.context.$implicit;
  }

}



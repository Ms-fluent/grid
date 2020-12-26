import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChild,
  DoCheck,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsGridItem, MsGridItemContext} from './grid-item';
import {MsGridJustify} from './grid-options';
import {MsGridItemDef} from './grid-item-def';
import * as gsap from 'gsap';

@Component({
  selector: 'ms-grid',
  templateUrl: 'grid.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-grid'
  }
})
export class MsGrid<T> implements AfterContentInit, AfterViewInit, DoCheck {
  @ContentChild(forwardRef(() => MsGridItemDef))
  gridItemDef: MsGridItemDef<T>;

  @ViewChild('viewContainer', {read: ViewContainerRef})
  viewContainer: ViewContainerRef;

  @Input()
  private _justify: MsGridJustify;

  @Input()
  itemHeight: number = 100;

  @Input()
  itemWidth: number = 100;

  @Input()
  xGap: number | 'justify' = 10;

  @Input()
  yGap: number = 10;

  @Input()
  get filterFn(): (x: T) => boolean {
    return this._filterFn;
  }

  set filterFn(value: (x: T) => boolean) {
    this._filterFn = value;
    this.filter(value);
  }

  private _filterFn: (x: T) => boolean = (x: T) => true;

  @Input()
  get sortFn(): (a: T, b: T) => number {
    return this._sortFn;
  }

  set sortFn(value: (a: T, b: T) => number) {
    this._sortFn = value;
    this.sort(value);
  }

  private _sortFn: (a: T, b: T) => number = () => 0;


  get sortBy(): [string, 'string' | 'number' | 'date'] {
    return this._sortBy;
  }

  set sortBy(value: [string, 'string' | 'number' | 'date']) {
    if (this.sortBy && value[0] === this.sortBy[0] && value[1] === this.sortBy[1]) {
      this._sortBy = value;
      this.reverse();
      return;
    }
    if (value[1] === 'number') {
      this.sortFn = (a: T, b: T) => +a[value[0]] - +b[value[0]];
    } else if (value[1] === 'string') {
      this.sortFn = (a: T, b: T) => a[value[0]].toString().localeCompare(b[value[0]].toString());
    } else if (value[1] === 'date') {
      this.sortFn = (a: T, b: T) => new Date(a[value[0]]).getDate() - new Date(b[value[0]]).getDate();
    }
    this._sortBy = value;
  }

  private _sortBy: [string, 'string' | 'number' | 'date'];

  /** Initial array of data! */
  private data: Array<T> = [];
  private items: Array<T> = [];
  private _itemViews: Map<any, ComponentRef<MsGridItem<T>>> = new Map<any, ComponentRef<MsGridItem<T>>>();
  private differ: IterableDiffer<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private container: ViewContainerRef,
              private _elementRef: ElementRef<HTMLElement>,
              private _differs: IterableDiffers,
              private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterContentInit(): void {

  }

  ngDoCheck(): void {
  }

  ngAfterViewInit(): void {
    this.viewContainer.clear();
    this.differ = this._differs.find(this.items).create();
    this.data = this.gridItemDef.data;
    this.items = this.data.slice();
    this.applyChanges();
  }

  async applyChanges() {
    const changes = this.differ.diff(this.items);
    if (changes == null) {
      return;
    }
    changes.forEachAddedItem(this.forEachAddedItem);
    changes.forEachRemovedItem(this.forEachRemovedItem);
    changes.forEachMovedItem(this.forEachMovedItem);
    this.updateGridTemplate();
    let index = 0;
    for (const ref of this._itemViews.values()) {
      ref.instance.context.setData(index++, this._itemViews.size);
      this.animateItem(ref.instance);
    }
  }

  animateItem(item: MsGridItem<T>): Promise<void> {
    return new Promise<void>(resolve => {
      if (!item.coord) {
        resolve();
        return;
      }
      const x = item.coord.x - item.host.getBoundingClientRect().x;
      const y = item.coord.y - item.host.getBoundingClientRect().y;
      item.host.animate([
        {'transform': `translate(${x}px, ${y}px)`},
        {'transform': `translate(0)`}
      ], {fill: 'both', duration: 200, easing: 'ease-in-out'})
        .onfinish = () => resolve();

    });
  }

  forEachAddedItem = (record: IterableChangeRecord<any>) => {
    const ref = this.createItemView(record.item, record.currentIndex);
    this._itemViews.set(record.trackById, ref);
  };

  forEachRemovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.viewContainer.remove(this.viewContainer.indexOf(ref.hostView));
      this._itemViews.delete(record.trackById);
    }
  };

  forEachMovedItem = (record: IterableChangeRecord<any>) => {
    const ref = this._itemViews.get(record.trackById);
    if (ref != null) {
      this.viewContainer.move(ref.hostView, record.currentIndex);
    }
  };

  sort(compareFn?: (a: T, b: T) => number) {
    if (!compareFn) {
      return;
    }
    this.items = this.data.sort(compareFn);
    this.applyChanges();
  }

  filter(value: (x: T) => boolean) {
    if (!value) {
      return;
    }
    this.items = this.data.filter(value);
    this.applyChanges();
  }

  updateGridTemplate() {
    this.host.style.gridRowGap = `${this.yGap}px`;
    const xGap = this.getXGap();
    this.host.style.gridColumnGap = `${xGap}px`;
    this.host.style.gridTemplateColumns = this.getGridRowTemplate();
  }

  createItemView(item: T, index: number): ComponentRef<MsGridItem<T>> {
    const context = new MsGridItemContext(item, index, this.items.length);
    const injector = this._createGridItemInjector(context);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<MsGridItem<T>>(MsGridItem);

    const componentRef = this.viewContainer.createComponent<MsGridItem<T>>(componentFactory, index, injector);
    const node = componentRef.location.nativeElement as HTMLDivElement;
    node.classList.add('ms-gridItem');
    node.style.height = this.itemHeight + 'px';
    gsap.gsap.from(node, {opacity: 0, y: this.itemHeight, duration: 0.5});
    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  _createGridItemInjector(context: MsGridItemContext<any>): Injector {
    return {
      get: (token: any, notFoundValue?: any): any => {
        const customTokens = new WeakMap<any, any>([
          [MsGridItemContext, context],
          [MsGridItemDef, this.gridItemDef]]);

        const value = customTokens.get(token);

        if (typeof value !== 'undefined') {
          return value;
        }

        return this.injector.get<any>(token, notFoundValue);
      }
    };
  }

  getItemPerLine(): number {
    if (this.xGap === 'justify') {
      const count = this.width / this.itemWidth;
      console.log(count, Math.floor(count));
      return Math.floor(count);
    }

    return Math.floor((this.width - this.itemWidth) / (this.itemWidth + +this.xGap)) + 1;
  }

  getGridRowTemplate(): string {
    const itemCount = this.getItemPerLine();
    const template = [];

    for (let i = 0; i < itemCount; i++) {
      template.push(this.itemWidth + 'px');
    }
    return template.join(' ');
  }


  getXGap(): number {
    if (this.xGap === 'justify') {
      // if (this.items.length < this.getItemPerLine()) {
      //   return ((this.width - this.itemWidth) - (this.items.length - 1) * this.itemWidth) / (this.items.length - 1);
      // } else {
      //   return ((this.width - this.itemWidth) - (this.getItemPerLine() - 1) * this.itemWidth) / (this.getItemPerLine() - 1);
      // }
      return ((this.width - this.itemWidth) - (this.getItemPerLine() - 1) * this.itemWidth) / (this.getItemPerLine() - 1);
    }
    return this.xGap;
  }


  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get width(): number {
    return this.host.getBoundingClientRect().width;
  }

  get length(): number {
    return this.items.length;
  };

  pop() {
    this.items.pop();
    this.applyChanges();
  }

  shift() {
    this.items.shift();
    this.applyChanges();
  }

  push(...items: T[]) {
    this.data.push(...items);
    this.items.push(...items);
    this.applyChanges();
  }

  reverse() {
    this.items.reverse();
    this.applyChanges();
  }

  unshift(...items: T[]) {
    this.data.unshift(...items);
    this.items.unshift(...items);
    this.applyChanges();
  }

  unshiftRange(items: T[]) {
    this.data.unshift(...items);
    this.items.unshift(...items);
    this.applyChanges();
  }

  remove(...items: T[]) {
    this.data = this.data.filter(item => items.indexOf(item) < 0);
    this.items = this.items.filter(item => items.indexOf(item) < 0);
    this.applyChanges();
  }

  clear() {
    this.data = [];
    this.items = [];
    this.applyChanges();
  }
}

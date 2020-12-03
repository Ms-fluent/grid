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
  IterableChangeRecord, IterableDiffer, IterableDiffers,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ViewRef
} from '@angular/core';
import {MsGridItem, MsGridItemContext } from './grid-item';
import {MsGridJustify} from './grid-options';
import {MsGridItemDef} from './grid-item-def';

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
    this.applyFilter(value);
  }

  private _filterFn: (x: T) => boolean;


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
    if (this.gridItemDef) {
      console.log('items change');
    }
  }

  ngAfterViewInit(): void {
    console.log('View init');
    this.viewContainer.clear();
    // this.addInitialItem();
    this.updateGridTemplate();
    this.gridItemDef.doCheckEvent.subscribe((changes) => {
      console.log('event change');
      changes.forEachAddedItem(this.forEachAddedItem);
      changes.forEachRemovedItem(this.forEachRemovedItem);
      changes.forEachMovedItem(this.forEachMovedItem);

      let index = 0;
      this._itemViews.forEach(ref => {
        ref.instance.context.setData(index++, this._itemViews.size);
      });

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

  addInitialItem() {
    this.data.forEach((item, index) => {
      const view = this.createItemView(item, index);
    });
  }

  updateGridTemplate() {
    this.host.style.gridRowGap = `${this.yGap}px`;
    const xGap = this.getXGap();
    this.host.style.gridColumnGap = `${xGap}px`;
    this.host.style.gridTemplateColumns = this.getGridRowTemplate();
  }

  createItemView(item: T, index: number): ComponentRef<MsGridItem<T>> {
    const context = new MsGridItemContext(item, index, this.data.length);
    const injector = this._createGridItemInjector(context);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<MsGridItem<T>>(MsGridItem);

    const componentRef = this.viewContainer.createComponent<MsGridItem<T>>(componentFactory, index, injector);
    const node = componentRef.location.nativeElement as HTMLDivElement;
    node.classList.add('ms-gridItem');
    node.style.height = this.itemHeight + 'px';
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

  applyFilter(value: (x: T) => boolean) {
    const itemValues = this.data.filter(value);

  }

  getItemPerLine(): number {
    if (this.xGap === 'justify') {
      return Math.floor(this.width / this.itemWidth);
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
      return (this.width - this.getItemPerLine() * this.itemWidth) / (this.getItemPerLine() - 1);
    }
    return this.xGap;
  }

  get data(): Array<T> {
    return this.gridItemDef.data;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get width(): number {
    return this.host.getBoundingClientRect().width;
  }
}

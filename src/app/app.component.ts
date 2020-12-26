import {Component, OnInit, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../element';
import {MsGrid} from '../grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fluent-grid';
  data = ELEMENT_DATA.slice();
  elements: PeriodicElement[] = ELEMENT_DATA;
  of: any;

  @ViewChild('msGrid')
  msGrid: MsGrid<PeriodicElement>;

  ngOnInit(): void {
  }

  getFilterFn(type: string): (x: PeriodicElement) => boolean {
    return (x: PeriodicElement) => x.type === type;
  }

  filter(category: string) {
    this.msGrid.filter(this.getFilterFn(category))
  }
}

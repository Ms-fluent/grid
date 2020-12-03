import {Component, OnInit} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fluent-grid';
  elements: PeriodicElement[] = ELEMENT_DATA.slice(0, 10);
  of: any;

  ngOnInit(): void {
  }

  filter(category: string) {
    this.elements = ELEMENT_DATA.filter(e => e.type === category);
  }
}

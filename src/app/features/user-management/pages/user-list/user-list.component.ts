import { Component, OnInit, Input } from '@angular/core';

import {
  IconService,
  TableModel,
  TableHeaderItem,
  TableItem,
  TableModule,
  ButtonModule,
  TableRowSize,
  CheckboxModule,
} from 'carbon-components-angular';

//@ts-expect-error Fixme: No types for carbon icons
import Add16 from '@carbon/icons/es/add/16';
//@ts-expect-error Fixme: No types for carbon icons
import Filter16 from '@carbon/icons/es/filter/16';

@Component({
  selector: 'app-model-filter-table',
  standalone: true,
  imports: [TableModule, ButtonModule, CheckboxModule],
  template: `
    <cds-table-container>
      <cds-table-header>
        <h4 cdsTableHeaderTitle>Filter table</h4>
        <p cdsTableHeaderDescription>
          Use the toolbar's search functionality to filter node names or click
          the filter icon to filter country names
        </p>
      </cds-table-header>
      <cds-table-toolbar>
        <cds-table-toolbar-content>
          <cds-table-toolbar-search
            [expandable]="true"
            (valueChange)="filterNodeNames($event)"
            (clear)="filterNodeNames('')"
          >
          </cds-table-toolbar-search>
          <button cdsButton="ghost" class="toolbar-action" placement="bottom">
            <svg
              cdsIcon="filter"
              size="16"
              class="cds--toolbar-action__icon"
            ></svg>
          </button>
          <button cdsButton="primary" size="sm">
            Primary Button<svg
              cdsIcon="add"
              size="20"
              class="cds--btn__icon"
            ></svg>
          </button>
        </cds-table-toolbar-content>
      </cds-table-toolbar>
      <cds-table
        [model]="model"
        [sortable]="false"
        [size]="size"
        [skeleton]="skeleton"
        [showSelectionColumn]="showSelectionColumn"
        [enableSingleSelect]="enableSingleSelect"
        [stickyHeader]="stickyHeader"
        [striped]="striped"
        [isDataGrid]="isDataGrid"
      >
        <ng-content></ng-content>
      </cds-table>
    </cds-table-container>

    <ng-template #templateRef>
      <div style="padding: 0 1rem;" (click)="overflowOnClick($event)">
        <div style="padding-top: 0.5rem; color: grey;">Countries shown</div>
        <cds-checkbox
          [checked]="displayedCountries.includes('US')"
          (checkedChange)="filterCountries('US', $event)"
        >
          US
        </cds-checkbox>
        <cds-checkbox
          [checked]="displayedCountries.includes('France')"
          (checkedChange)="filterCountries('France', $event)"
        >
          France
        </cds-checkbox>
        <cds-checkbox
          [checked]="displayedCountries.includes('Argentina')"
          (checkedChange)="filterCountries('Argentina', $event)"
        >
          Argentina
        </cds-checkbox>
        <cds-checkbox
          [checked]="displayedCountries.includes('Japan')"
          (checkedChange)="filterCountries('Japan', $event)"
        >
          Japan
        </cds-checkbox>
      </div>
    </ng-template>
  `,
})
export class UserListComponent implements OnInit {
  @Input() size: TableRowSize = 'md';
  @Input() showSelectionColumn = true;
  @Input() enableSingleSelect = false;
  @Input() striped = true;
  @Input() isDataGrid = false;
  @Input() noData = false;
  @Input() stickyHeader = false;
  @Input() skeleton = false;

  model = new TableModel();
  displayedCountries = ['US', 'France', 'Argentina', 'Japan'];

  dataset = [
    [
      new TableItem({ data: '800' }),
      new TableItem({ data: 'East Sadye' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'US' }),
    ],
    [
      new TableItem({ data: '500' }),
      new TableItem({ data: 'Lueilwitzview' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'US' }),
    ],
    [
      new TableItem({ data: '120' }),
      new TableItem({ data: 'East Arcelyside' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'France' }),
    ],
    [
      new TableItem({ data: '119' }),
      new TableItem({ data: 'West Dylan' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'Argentina' }),
    ],
    [
      new TableItem({ data: '54' }),
      new TableItem({ data: 'Brandynberg' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'Japan' }),
    ],
    [
      new TableItem({ data: '15' }),
      new TableItem({ data: 'Stoltenbergport' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'Canada' }),
    ],
    [
      new TableItem({ data: '12' }),
      new TableItem({ data: 'Rheabury' }),
      new TableItem({ data: 'Store' }),
      new TableItem({ data: 'US' }),
    ],
  ];

  constructor(protected iconService: IconService) {
    this.iconService.registerAll([Add16, Filter16]);
  }

  filterNodeNames(searchString: string) {
    this.model.data = this.dataset.filter((row: TableItem[]) =>
      row[1].data.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  filterCountries(countryName: string, checked: boolean) {
    if (checked) {
      this.displayedCountries.push(countryName);
    } else {
      this.displayedCountries.splice(
        this.displayedCountries.indexOf(countryName),
        1
      );
    }

    this.model.data = this.dataset.filter((row: TableItem[]) =>
      this.displayedCountries.includes(row[3].data)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overflowOnClick = (event: any) => {
    event.stopPropagation();
  };

  ngOnInit() {
    this.model.header = [
      new TableHeaderItem({
        data: 'Node ID',
      }),
      new TableHeaderItem({
        data: 'Node name',
      }),
      new TableHeaderItem({
        data: 'Node type',
      }),
      new TableHeaderItem({
        data: 'Country',
      }),
    ];

    this.model.data = this.dataset;
  }
}

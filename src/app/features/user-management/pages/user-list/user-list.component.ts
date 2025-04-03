import { Component, OnInit, Input } from '@angular/core';
import {
  TableModel,
  TableHeaderItem,
  TableItem,
  TableModule,
  ButtonModule,
  TableRowSize,
  CheckboxModule,
  IconModule,
  DialogModule,
  InputModule,
  PaginationModule,
} from 'carbon-components-angular';
import { IconService } from '@app/core/services/icon.service';

//@ts-expect-error Fixme: No types for carbon icons
import Add16 from '@carbon/icons/es/add/16';
//@ts-expect-error Fixme: No types for carbon icons
import Settings16 from '@carbon/icons/es/settings/16';
//@ts-expect-error Fixme: No types for carbon icons
import Search16 from '@carbon/icons/es/search/16';
//@ts-expect-error Fixme: No types for carbon icons
import Close16 from '@carbon/icons/es/close/16';

@Component({
  selector: 'app-user-list', // Changed from app-model-filter-table
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CheckboxModule,
    IconModule,
    DialogModule,
    InputModule,
    PaginationModule,
  ],

  templateUrl: './user-list.component.html',
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
    // this.initializeTable();
    // Register icons after ensuring service is available
    setTimeout(() => {
      this.iconService.registerAll([Settings16, Add16, Search16, Close16]);
    });
  }

  ngOnInit() {
    this.initializeTable();
  }

  private initializeTable() {
    this.model.header = [
      new TableHeaderItem({ data: 'Node ID' }),
      new TableHeaderItem({ data: 'Node name' }),
      new TableHeaderItem({ data: 'Node type' }),
      new TableHeaderItem({ data: 'Country' }),
    ];
    this.model.data = this.dataset;
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

  getPage(page: number) {
		const line = line => [`Item ${line}:1!`, { name: "Item", surname: `${line}:2` }];

		const fullPage = [];

		for (let i = (page - 1) * this.model.pageLength; i < page * this.model.pageLength && i < this.model.totalDataLength; i++) {
			fullPage.push(line(i + 1));
		}

		return new Promise(resolve => {
			setTimeout(() => resolve(fullPage), 150);
		});
	}

  selectPage(page: number) {
    this.getPage(page).then((data: Array<Array<any>>) => {
      // set the data and update page
      this.model.data = this.prepareData(data);
      this.model.currentPage = page;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overflowOnClick = (event: any) => {
    event.stopPropagation();
  };
}

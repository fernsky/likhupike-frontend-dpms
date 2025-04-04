import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
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
import { Router } from '@angular/router';
import * as UserSelectors from '../../store/user.selectors';
import { UserActions } from '../../store/user.actions';
import { UserResponse } from '../../models/user.interface';

//@ts-expect-error Fixme: No types for carbon icons
import Add16 from '@carbon/icons/es/add/16';
//@ts-expect-error Fixme: No types for carbon icons
import Settings16 from '@carbon/icons/es/settings/16';
//@ts-expect-error Fixme: No types for carbon icons
import Search16 from '@carbon/icons/es/search/16';
//@ts-expect-error Fixme: No types for carbon icons
import Edit16 from '@carbon/icons/es/edit/16';
//@ts-expect-error Fixme: No types for carbon icons
import TrashCan16 from '@carbon/icons/es/trash-can/16';

@Component({
  selector: 'app-user-list',
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
  private store = inject(Store);
  private router = inject(Router);

  model = new TableModel();
  size: TableRowSize = 'md';
  skeleton = false;

  // Store selectors
  users$ = this.store.select(UserSelectors.selectUsers);
  loading$ = this.store.select(UserSelectors.selectUserLoading);
  pagination$ = this.store.select(UserSelectors.selectPagination);
  currentFilter$ = this.store.select(UserSelectors.selectCurrentFilter);

  constructor(protected iconService: IconService) {
    this.iconService.registerAll([
      Settings16,
      Add16,
      Search16,
      Edit16,
      TrashCan16,
    ]);
    this.initializeTable();
  }

  ngOnInit() {
    // Load initial data
    this.store.dispatch(
      UserActions.loadUsers({
        filter: {
          page: 1,
          size: 10,
          sortBy: 'createdAt',
          sortDirection: 'DESC',
        },
      })
    );

    // Subscribe to users and update table
    this.users$.subscribe((users) => {
      this.updateTableData(users);
    });

    // Subscribe to loading state
    this.loading$.subscribe((loading) => {
      this.skeleton = loading;
    });
  }

  private initializeTable() {
    this.model.header = [
      new TableHeaderItem({ data: 'Email' }),
      new TableHeaderItem({ data: 'Ward' }),
      new TableHeaderItem({ data: 'Status' }),
      new TableHeaderItem({ data: 'Created At' }),
      new TableHeaderItem({ data: 'Actions' }),
    ];
  }

  private updateTableData(users: UserResponse[]) {
    this.model.data = users.map((user) => [
      new TableItem({ data: user.email }),
      new TableItem({ data: user.wardNumber || 'N/A' }),
      new TableItem({
        data: user.isApproved ? 'Approved' : 'Pending',
        template: this.statusTemplate,
      }),
      new TableItem({
        data: new Date(user.createdAt).toLocaleDateString(),
      }),
      new TableItem({
        data: user,
        template: this.actionTemplate,
      }),
    ]);
  }

  // Event handlers
  onCreateUser() {
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(userId: string) {
    this.router.navigate([`/dashboard/users/edit/${userId}`]);
  }

  onDeleteUser(userId: string) {
    // Add confirmation dialog here if needed
    this.store.dispatch(UserActions.deleteUser({ id: userId }));
  }

  selectPage(page: number) {
    this.store.dispatch(
      UserActions.setPage({
        pageIndex: page,
        pageSize: this.model.pageLength,
      })
    );
  }

  filterUsers(searchString: string) {
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          searchTerm: searchString,
          page: 1, // Reset to first page on filter
        },
      })
    );
  }

  toggleApprovalFilter(showApproved: boolean) {
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          isApproved: showApproved,
          page: 1,
        },
      })
    );
  }
}

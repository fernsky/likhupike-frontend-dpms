import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserFilter } from '../../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { NumberFormatService } from '@app/shared/services/number-format.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-filters',
  templateUrl: './user-filters.component.html',
  styleUrls: ['./user-filters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    TranslocoModule,
    MatButtonModule,
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class UserFiltersComponent implements OnInit, OnDestroy {
  @Input() show = false;
  @Input() filterForm!: FormGroup;
  @Output() filtersChange = new EventEmitter<UserFilter>();

  private destroy$ = new Subject<void>();
  permissionTypes = Object.values(PermissionType);
  wardNumbers = Array.from({ length: 5 }, (_, i) => i + 1);

  constructor(
    private numberFormat: NumberFormatService,
    private transloco: TranslocoService
  ) {}

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.filtersChange.emit(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return (
      values.wardNumber != null ||
      values.permissions?.length > 0 ||
      values.isApproved != null ||
      values.createdAfter != null ||
      values.createdBefore != null
    );
  }

  clearFilters(): void {
    const defaultValues: UserFilter = {
      wardNumber: undefined,
      permissions: [],
      isApproved: undefined,
      isWardLevelUser: undefined,
      createdAfter: undefined,
      createdBefore: undefined,
    };

    this.filterForm.patchValue({
      wardNumber: null,
      permissions: [],
      isApproved: null,
      isWardLevelUser: null,
      createdAfter: null,
      createdBefore: null,
    });

    this.filtersChange.emit(defaultValues);
  }

  formatWardNumber(number: number): string {
    return `${this.transloco.translate('user.list.filters.ward.prefix', {
      number: this.numberFormat.formatNumber(number),
    })}`;
  }
}

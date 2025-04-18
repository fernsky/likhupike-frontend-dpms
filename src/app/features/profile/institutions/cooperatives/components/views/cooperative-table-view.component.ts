import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CooperativeResponse } from '../../types';
import { CooperativeActions } from '../../store/actions';

@Component({
  selector: 'app-cooperative-table-view',
  templateUrl: './cooperative-table-view.component.html',
  styleUrls: ['./cooperative-table-view.component.scss']
})
export class CooperativeTableViewComponent implements OnInit, OnChanges {
  @Input() cooperatives: CooperativeResponse[] | null = [];
  @Input() loading = false;
  
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<CooperativeResponse>([]);
  displayedColumns: string[] = [
    'name', 
    'type', 
    'status', 
    'establishedDate', 
    'contactPhone',
    'actions'
  ];

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the mat table
    if (this.cooperatives) {
      this.dataSource.data = this.cooperatives;
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperatives'] && this.cooperatives) {
      this.dataSource.data = this.cooperatives;
      
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }
  
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  viewCooperative(cooperative: CooperativeResponse): void {
    this.router.navigate(['/cooperatives', cooperative.id]);
  }

  editCooperative(cooperative: CooperativeResponse): void {
    // Select the cooperative and navigate to edit page
    this.store.dispatch(CooperativeActions.selectCooperative({ id: cooperative.id }));
    this.router.navigate(['/cooperatives/edit', cooperative.id]);
  }
  
  deleteCooperative(cooperative: CooperativeResponse, event: Event): void {
    event.stopPropagation();
    
    // Typically, we'd show a confirmation dialog here
    if (confirm(`Are you sure you want to delete ${this.getCooperativeName(cooperative)}?`)) {
      this.store.dispatch(CooperativeActions.deleteCooperative({ id: cooperative.id }));
    }
  }
  
  getCooperativeName(cooperative: CooperativeResponse): string {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return 'Unnamed Cooperative';
    }
    
    // First try to find translation in default locale
    const defaultTranslation = cooperative.translations.find(
      t => t.locale === cooperative.defaultLocale
    );
    
    if (defaultTranslation) {
      return defaultTranslation.name;
    }
    
    // Fall back to first available translation
    return cooperative.translations[0].name;
  }
}

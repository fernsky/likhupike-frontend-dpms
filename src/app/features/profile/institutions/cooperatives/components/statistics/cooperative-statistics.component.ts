import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { CooperativeType, CooperativeStatus } from '../../types';
import { CooperativeSearchActions } from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';

@Component({
  selector: 'app-cooperative-statistics',
  templateUrl: './cooperative-statistics.component.html',
  styleUrls: ['./cooperative-statistics.component.scss']
})
export class CooperativeStatisticsComponent implements OnInit {
  // Statistics data
  statisticsByType$: Observable<{ [key in CooperativeType]?: number }>;
  statisticsByWard$: Observable<{ [ward: number]: number }>;
  loading$: Observable<boolean>;
  
  // Arrays for template iteration
  cooperativeTypes = Object.values(CooperativeType);
  
  // For the charts
  typeChartData: any[] = [];
  wardChartData: any[] = [];
  
  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.5,
        to: 0,
        loop: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.statisticsByType$ = this.store.select(fromCooperatives.selectStatisticsByType);
    this.statisticsByWard$ = this.store.select(fromCooperatives.selectStatisticsByWard);
    this.loading$ = this.store.select(fromCooperatives.selectSearchLoading);
  }

  ngOnInit(): void {
    // Load statistics
    this.store.dispatch(CooperativeSearchActions.getStatisticsByType());
    this.store.dispatch(CooperativeSearchActions.getStatisticsByWard());
    
    // Process data for charts
    this.prepareChartData();
  }
  
  private prepareChartData(): void {
    // Type chart data
    this.statisticsByType$.pipe(
      map(stats => {
        if (!stats) return [];
        
        const datasets = [{
          data: this.cooperativeTypes.map(type => stats[type] || 0),
          backgroundColor: [
            '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336',
            '#00BCD4', '#8BC34A', '#FF9800', '#673AB7', '#E91E63',
            '#CDDC39', '#3F51B5', '#FFEB3B', '#009688', '#FF5722'
          ]
        }];
        
        return {
          labels: this.cooperativeTypes.map(type => 
            this.formatTypeLabel(type)
          ),
          datasets
        };
      })
    ).subscribe(data => {
      this.typeChartData = data;
    });
    
    // Ward chart data
    this.statisticsByWard$.pipe(
      map(stats => {
        if (!stats) return [];
        
        const wards = Object.keys(stats).map(Number).sort((a, b) => a - b);
        
        const datasets = [{
          label: 'Cooperatives by Ward',
          data: wards.map(ward => stats[ward] || 0),
          backgroundColor: '#4CAF50',
          borderColor: '#2E7D32',
          borderWidth: 1
        }];
        
        return {
          labels: wards.map(ward => `Ward ${ward}`),
          datasets
        };
      })
    ).subscribe(data => {
      this.wardChartData = data;
    });
  }
  
  onTypeClick(type: CooperativeType): void {
    this.store.dispatch(CooperativeSearchActions.getByType({
      cooperativeType: type,
      page: 0,
      size: 10
    }));
    
    this.router.navigate(['/cooperatives'], { 
      queryParams: { type } 
    });
  }
  
  onWardClick(ward: number): void {
    this.store.dispatch(CooperativeSearchActions.getByWard({
      ward,
      page: 0,
      size: 10
    }));
    
    this.router.navigate(['/cooperatives'], { 
      queryParams: { ward } 
    });
  }
  
  private formatTypeLabel(type: CooperativeType): string {
    // Convert SNAKE_CASE to Title Case with spaces
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  getTypeCount(type: CooperativeType): Observable<number> {
    return this.store.select(fromCooperatives.selectStatisticsForType(type));
  }
  
  getStatisticsTotalCount(): Observable<number> {
    return this.statisticsByType$.pipe(
      map(stats => {
        if (!stats) return 0;
        return Object.values(stats).reduce((total, count) => total + (count || 0), 0);
      })
    );
  }
}

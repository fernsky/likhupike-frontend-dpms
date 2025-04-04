import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'formatApprovalStatus',
  standalone: true,
})
export class FormatApprovalStatusPipe implements PipeTransform {
  constructor(private transloco: TranslocoService) {}

  transform(isApproved: boolean): string {
    return isApproved
      ? this.transloco.translate('user.list.filters.approvalStatus.approved')
      : this.transloco.translate('user.list.filters.approvalStatus.pending');
  }
}

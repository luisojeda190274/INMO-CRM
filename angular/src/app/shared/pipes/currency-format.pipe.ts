import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';

@Pipe({
  name: 'crmCurrency',
  standalone: true,
  pure: false
})
export class CurrencyFormatPipe implements PipeTransform {
  private currencyService = inject(CurrencyService);

  transform(value: number | undefined | null, originalCurrency: 'USD' | 'ARS' = 'USD'): string {
    if (value === undefined || value === null) return '-';
    return this.currencyService.format(value, originalCurrency);
  }
}

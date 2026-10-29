import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  readonly currencyMode = signal<'USD' | 'ARS'>('USD');
  readonly usdToArsRate = signal<number>(1280);

  setCurrency(mode: 'USD' | 'ARS'): void {
    this.currencyMode.set(mode);
  }

  setRate(rate: number): void {
    this.usdToArsRate.set(rate);
  }

  format(amount: number, currency: 'USD' | 'ARS'): string {
    const targetMode = this.currencyMode();
    const rate = this.usdToArsRate();

    let displayAmount = amount;
    let displayCurrency = currency;

    if (currency === 'USD' && targetMode === 'ARS') {
      displayAmount = amount * rate;
      displayCurrency = 'ARS';
    } else if (currency === 'ARS' && targetMode === 'USD') {
      displayAmount = amount / rate;
      displayCurrency = 'USD';
    }

    const formatted = new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: 0
    }).format(Math.round(displayAmount));

    return `${displayCurrency === 'USD' ? 'USD ' : '$ '}${formatted}`;
  }
}

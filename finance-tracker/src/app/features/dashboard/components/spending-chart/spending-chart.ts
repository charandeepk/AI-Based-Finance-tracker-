import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionSummary } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-spending-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-chart.html',
  styleUrl: './spending-chart.scss'
})
export class SpendingChart implements OnChanges {
  @Input() summary!: TransactionSummary;

  spendingItems: Array<{ category: string; amount: number; color: string }> = [];
  isEmpty = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary'] && this.summary) {
      const byCategory = this.summary.byCategory ?? {};
      this.spendingItems = Object.entries(byCategory)
        .filter(([, amount]) => amount > 0)
        .map(([category, amount], index) => ({
          category,
          amount,
          color: this.getColorForCategory(category, index)
        }))
        .sort((a, b) => b.amount - a.amount);
      this.isEmpty = this.spendingItems.length === 0;
    }
  }

  getBarWidth(amount: number): number {
    if (this.spendingItems.length === 0) {
      return 0;
    }

    const maxAmount = Math.max(...this.spendingItems.map(item => item.amount));
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  }

  getColorForCategory(category: string, index: number): string {
    const palette = [
      'linear-gradient(90deg, #3b82f6, #60a5fa)',
      'linear-gradient(90deg, #ef4444, #f87171)',
      'linear-gradient(90deg, #10b981, #34d399)',
      'linear-gradient(90deg, #f59e0b, #fbbf24)',
      'linear-gradient(90deg, #8b5cf6, #a78bfa)',
      'linear-gradient(90deg, #ec4899, #f472b6)',
      'linear-gradient(90deg, #0f766e, #2dd4bf)',
      'linear-gradient(90deg, #6366f1, #818cf8)'
    ];

    const normalizedCategory = category.toLowerCase();
    const hash = [...normalizedCategory].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return palette[(hash + index) % palette.length];
  }
}
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { TransactionSummary } from '../../../../core/models/transaction.model';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-spending-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-chart.html',
  styleUrl: './spending-chart.scss'
})
export class SpendingChart implements OnChanges, OnDestroy {
  @Input() summary!: TransactionSummary;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  chart: Chart | null = null;
  isEmpty = true;

  ngOnChanges(): void {
    const byCategory = this.summary?.byCategory ?? {};
    const entries = Object.entries(byCategory).filter(([, val]) => val > 0);
    this.isEmpty = entries.length === 0;

    if (!this.isEmpty) {
      setTimeout(() => this.renderChart(entries), 0);
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  renderChart(entries: [string, number][]): void {
    if (!this.chartCanvas) return;

    const labels = entries.map(([cat]) => cat);
    const data = entries.map(([, val]) => val);
    const colors = [
      '#4ade80', '#f87171', '#60a5fa', '#facc15',
      '#a78bfa', '#fb923c', '#34d399', '#f472b6'
    ];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0
        }]
      },
      options: {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#64748b', padding: 16, font: { size: 13 } }
    },
    title: {
      display: false
    }
  }
}
    });
  }
}
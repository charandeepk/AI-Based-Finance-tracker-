import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TransactionSummary } from '../../../../core/models/transaction.model';
import { FinanceService } from '../../../../core/services/finance.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  summary: TransactionSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    byCategory: {} as any
  };

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getTransactions().subscribe(transactions => {
      this.summary = this.financeService.getSummary(transactions);
    });
  }
}
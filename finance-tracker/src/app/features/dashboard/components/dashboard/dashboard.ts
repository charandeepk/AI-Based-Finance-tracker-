import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TransactionSummary } from '../../../../core/models/transaction.model';
import { FinanceService } from '../../../../core/services/finance.service';
import { TransactionList } from '../../../transactions/components/transaction-list/transaction-list';
import { SpendingChart } from '../../components/spending-chart/spending-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionList, SpendingChart],
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
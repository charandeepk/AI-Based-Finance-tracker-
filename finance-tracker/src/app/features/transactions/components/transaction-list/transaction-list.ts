import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../../../core/models/transaction.model';
import { FinanceService } from '../../../../core/services/finance.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  delete(id: string): void {
    this.financeService.deleteTransaction(id);
  }
}
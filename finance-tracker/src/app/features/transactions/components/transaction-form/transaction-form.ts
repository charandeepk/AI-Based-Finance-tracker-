import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../../../core/models/transaction.model';
import { FinanceService } from '../../../../core/services/finance.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionForm implements OnInit {
  transactionForm: FormGroup;
  transactions: Transaction[] = [];

  incomeCategories = ['salary', 'freelance', 'investments', 'other'];
  expenseCategories = ['food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'education', 'other'];

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense'],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['other'],
      description: [''],
      date: [new Date().toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.financeService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  getCategoriesForType(type: string): string[] {
    return type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  setType(type: 'income' | 'expense'): void {
    this.transactionForm.patchValue({ type, category: '' });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.financeService.addTransaction(this.transactionForm.value);
      this.transactionForm.patchValue({
        amount: null,
        description: '',
        category: ''
      });
    }
  }

  delete(id: string): void {
    this.financeService.deleteTransaction(id);
  }
}
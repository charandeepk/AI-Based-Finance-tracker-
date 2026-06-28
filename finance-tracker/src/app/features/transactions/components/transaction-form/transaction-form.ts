import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceService } from '../../../../core/services/finance.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionForm {
  transactionForm: FormGroup;
  incomeCategories = ['salary', 'business', 'freelance', 'investments', 'other'];
  expenseCategories = ['food', 'travel', 'rent', 'health', 'entertainment', 'shopping', 'education', 'other'];

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense'],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: [this.expenseCategories[0]],
      description: [''],
      date: [new Date().toISOString().split('T')[0]]
    });
  }

  setType(type: 'income' | 'expense'): void {
    const defaultCategory = type === 'income' ? this.incomeCategories[0] : this.expenseCategories[0];
    this.transactionForm.patchValue({ type, category: defaultCategory });
  }

  getCategoriesForType(type: 'income' | 'expense'): string[] {
    return type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.financeService.addTransaction(this.transactionForm.value);
      this.router.navigate(['/dashboard']);
    }
  }
}
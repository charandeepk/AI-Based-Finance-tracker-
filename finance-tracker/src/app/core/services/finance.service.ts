import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseCategory, Transaction, TransactionSummary } from '../models/transaction.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'ft_transactions';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Transaction[]>(STORAGE_KEY) ?? [];
    this.transactions$.next(saved);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTransaction, ...this.transactions$.value];
    this.transactions$.next(updated);
    this.storage.set(STORAGE_KEY, updated);
  }

  deleteTransaction(id: string): void {
    const updated = this.transactions$.value.filter(t => t.id !== id);
    this.transactions$.next(updated);
    this.storage.set(STORAGE_KEY, updated);
  }

  getSummary(transactions: Transaction[]): TransactionSummary {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {} as Record<ExpenseCategory, number>);

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      byCategory,
    };
  }
}
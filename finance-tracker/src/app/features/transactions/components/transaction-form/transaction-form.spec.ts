import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionForm } from './transaction-form';

describe('TransactionForm', () => {
  let component: TransactionForm;
  let fixture: ComponentFixture<TransactionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose income categories for income transactions', () => {
    expect(component.getCategoriesForType('income')).toEqual(jasmine.arrayContaining(['salary', 'business', 'freelance']));
  });

  it('should expose expense categories for expense transactions', () => {
    expect(component.getCategoriesForType('expense')).toEqual(jasmine.arrayContaining(['food', 'travel', 'rent', 'health', 'entertainment']));
  });
});

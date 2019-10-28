import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService implements OnDestroy {
  private destroy$: Subject<void>;
  private hiddenSubject$: BehaviorSubject<boolean>;
  private messageSubject$: BehaviorSubject<string>;

  public readonly hidden$: Observable<boolean>;
  public readonly message$: Observable<string>;

  public message: string;

  constructor() {
    this.message = 'Đang tải dữ liệu ...';

    this.destroy$ = new Subject();
    this.hiddenSubject$ = new BehaviorSubject(true);
    this.messageSubject$ = new BehaviorSubject(this.message);

    this.hidden$ = this.hiddenSubject$.pipe(takeUntil(this.destroy$));
    this.message$ = this.messageSubject$.pipe(takeUntil(this.destroy$));
  }

  show(message: string = this.message) {
    this.messageSubject$.next(message);
    this.hiddenSubject$.next(false);
  }

  close() {
    this.hiddenSubject$.next(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

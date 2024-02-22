import { Directive, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Directive()
export abstract class StatefulComponent<State extends object>
  implements OnDestroy
{
  private _state$: BehaviorSubject<State>;
  state$: Observable<State>;

  constructor(public initState: State) {
    this._state$ = new BehaviorSubject<State>(initState);
    this.state$ = this._state$.asObservable();
  }

  protected get state(): State {
    return this._state$.value;
  }

  setState(newState: State) {
    this._state$.next(newState);
  }

  updateState(newState: Partial<State>) {
    this._state$.next({ ...this.state, ...newState });
  }

  resetState() {
    this.setState(this.initState);
  }

  ngOnDestroy() {
    this._state$.unsubscribe();
  }
}

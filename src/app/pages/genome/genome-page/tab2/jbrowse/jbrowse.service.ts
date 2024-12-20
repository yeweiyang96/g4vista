/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';

// sharedStateService.ts
import { ReplaySubject } from 'rxjs';

// 创建一个 BehaviorSubject 作为共享状态
const sharedState = new ReplaySubject<string>(0);

// 订阅状态
export const onStateChange = (callback: (state: any) => void) => {
  return sharedState.subscribe(callback);
};

@Injectable({
  providedIn: 'root',
})
export class JbrowseService {
  // 更新状态
  setState = (newState: string) => {
    sharedState.next(newState);
  };

  unmount = () => {
    sharedState.unsubscribe();
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// eventBus.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// sharedStateService.ts
import { BehaviorSubject } from 'rxjs';

// 创建一个 Subject 作为事件总线
const eventBus = new Subject<{ event: string; payload?: unknown }>();

// 发布事件
export const emitEvent = (event: string, payload?: unknown) => {
  eventBus.next({ event, payload });
};

// 订阅事件
export const onEvent = (
  event: string,
  callback: (payload: unknown) => void
) => {
  return eventBus.subscribe(({ event: emittedEvent, payload }) => {
    if (emittedEvent === event) {
      callback(payload);
    }
  });
};

// 创建一个 BehaviorSubject 作为共享状态
const sharedState = new BehaviorSubject<unknown>(null);

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
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  getRandomNumberAsync(abortSignal?: AbortSignal) {
    console.log('[API] Getting a random number...');
    return new Promise<number>((resolve) => {
      let handle: number | null = null;
      handle = setTimeout(() => {
        const res = Math.floor(Math.random() * 100);
        console.log('[API] Random number received', res);
        resolve(res);
        handle = null;
      }, 3000);

      abortSignal?.addEventListener('abort', () => {
        if (handle) {
          clearTimeout(handle);
          console.log('Random Number - Cancelled!!!')
        }
      })
    });
  }

  mutiplyByFiveAsync(value: number, abortSignal?: AbortSignal) {
    // this function returns the value times 5 after a delay of 3 seconds

    console.log('[API] Getting a multiplier for seed', value);
    return new Promise<number>((resolve, reject) => {
      let handle: number | null = null;
      handle = setTimeout(() => {        
        const res = value * 5;
        if (value === 57) {
          reject('I dont like the number 57');
        } else {
          console.log('[API] Multiplier received', res);
          resolve(res);
        }
        handle = null;
      }, 3000);

      abortSignal?.addEventListener('abort', () => {
        if (handle) {
          clearTimeout(handle);
          console.log('Cancelled calculation of ', value);
        }
      })
    });
  }
}

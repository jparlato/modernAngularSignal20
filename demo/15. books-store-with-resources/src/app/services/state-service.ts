import { inject, Injectable, linkedSignal, resource, ResourceStreamItem, signal } from '@angular/core';
import { Book } from '../models/book';
import { HttpClient, httpResource } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { webSocketObservable } from '../tools/web-socket-observable';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  readonly apiBase = 'http://localhost:3000/api/books';
  readonly wsBase = 'ws://localhost:3000/ws';
  readonly http = inject(HttpClient);

  #keyword = signal<string>('the');

  // #searchResult = resource({
  //   params: () => ({keyword: this.#keyword()}), 
  //   loader: (options) => this.#searchKeywordPromise(options.params.keyword, options.abortSignal), 
  //   defaultValue: []
  // });

  #searchResult = httpResource<Book[]>(() => ({
    url: `${this.apiBase}/search`, 
    params: { q: this.#keyword()},     
    
  }), {
    defaultValue: [], 
  })

  #selectedBookId = linkedSignal<Book[], string>({
    source: () => this.searchResult.value(), 
    computation: (src, prev) => {
      if (!prev) {
        return src.length > 0 ? src[0].id : '';
      }
      if (prev.value === '' && src.length > 0) {
        return src[0].id;
      }

      return prev.value;
    }
  })

  #selectedBook = rxResource({
    params: () => ({id: this.#selectedBookId() }), 
    stream: (options) => options.params.id
      ? this.http.get<Book>(`${this.apiBase}/${options.params.id}`)
      : of(null), 
    defaultValue: null
  });

  // #selectedStock = resource({
  //   params: () => ({id: this.#selectedBookId()}), 
  //   stream: async (options) => {
  //     const res = signal<ResourceStreamItem<number>>({value: 0 });

  //     if (options.params.id) {
  //       const ws = new WebSocket(`${this.wsBase}/stock/${options.params.id}`);
  //       ws.onmessage = (event) => {
  //         const data = JSON.parse(event.data);
  //         if (data?.stock !== undefined) {
  //           res.set({value: data.stock})
  //         }
  //       }

  //       options.abortSignal.addEventListener('abort', () => {
  //         ws.close();
  //       })
  //     }

  //     return res;
  //   }
  // })

  #selectedStock = rxResource({
    params: () => ({id: this.#selectedBookId()}), 
    stream: (options) => {
      if(!options.params.id) return of(0);
      return webSocketObservable<{stock: number}>(`${this.wsBase}/stock/${options.params.id}`).pipe(
        map(data => data.stock)
      )
    }
  })


  get keyword() {
    return this.#keyword.asReadonly();
  }

  get searchResult() {
    return this.#searchResult.asReadonly();
  }

  get selectedBookId() {
    return this.#selectedBookId.asReadonly();
  }

  get selectedBook() {
    return this.#selectedBook.asReadonly();
  }

  get selectedStock() {
    return this.#selectedStock.asReadonly();
  }

  setKeyword(value: string) {
    console.log('Keyword changes to', value);
    this.#keyword.set(value);
  }

  setSelectedBookId(value: string) {
    this.#selectedBookId.set(value);
  }


  #searchKeywordPromise(value: string, abortSignal?: AbortSignal): Promise<Book[]> {
    return fetch(`${this.apiBase}/search?q=${value}`, {signal: abortSignal})
      .then(resp => resp.json())
  }

  constructor() { }
}

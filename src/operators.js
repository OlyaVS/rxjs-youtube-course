import { interval, fromEvent } from 'rxjs'
import {tap, map, filter, take, takeLast, takeWhile, scan, reduce, switchMap } from 'rxjs/operators';

const stream$ = interval(1000)
  .pipe(
    //tap(v => console.log(`Tab: ${v}`)),
    //map(v => v * 3),
    //filter(v => v % 2 === 0),
    take(5),
    //takeLast(5)
    //takeWhile(v => v < 7)
    //scan((acc, v) => acc + v, 0),
    reduce((acc, v) => acc + v, 0)
  );

stream$.subscribe({
  next: (v) => console.log(v), // каждую сек в метод next выводится новое значение
  complete: () => console.log('Complete!')
});


// добавим событие для документа и обернем это все в стрим
// выполним в обработчике логику стрима stream$
// классический вариант:
// минусы - два раза вызываем метод subscribe
// первый стрим - когда мы создаем событие у элемента fromEvent
// второй стрим - interval внутри
fromEvent(document,'click')
  .subscribe(() => {
    // записываем логику стрима
    const stream$ = interval(1000)
      .pipe(
        tap(v => console.log(`Tab: ${v}`)),
        take(5),
        reduce((acc, v) => acc + v, 0)
      );
    // подписываемся здесь же
    stream$.subscribe({
      next: (v) => console.log(v), // каждую сек в метод next выводится новое значение
      complete: () => console.log('Complete!')
    });
  });

// использовать специальные оператры для смены стримов switchmap
// из него возвращаем новый стрим
fromEvent(document,'click')
  .pipe(
    switchMap((event) => {
      return interval(1000)
        .pipe(
          tap(v => console.log(`Tab: ${v}`)),
          take(5),
          reduce((acc, v) => acc + v, 0)
        );
    })
  )
  .subscribe({
      next: (v) => console.log(v),
      complete: () => console.log('Complete!')
  });
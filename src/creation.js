import { of, from, Observable, fromEvent, range, timer, interval } from 'rxjs';
import { scan, map } from 'rxjs/operators'

// 1: создать стрим - метод of:
// из любых данных, к-е передали в метод of будет создан стрим
const stream$ = of(1, 2, 3, 4);

stream$.subscribe(val => {
  // получим Value: 1, Value: 2, Value: 3, Value: 4
  // те получим те данные, к-е передавали в of
  // выводятся они не сразу, а по очереди, вызывается ф-я subscribe на каждый элемент, те 4 раза
  console.log(`Value: ${val}`);
});

// 2: создать стрим - метод from:
// метод работает с массивами
const arr$ = from([5, 6, 7, 8]);
arr$.subscribe(val => console.log(val));

const arr2$ = from([9, 10, 11, 12]).pipe(
  scan((acc, v) => acc.concat(v), [])
);
arr2$.subscribe(val => console.log(val));

// 3: создать стрим - класс Observable - основной концепт библиотеки:
// созд экз класса и передадим в функцию объект observable
// на этом объекте м вызывать разные методы
const stream2$ = new Observable(observer => {
  // диспатчим без задержки
  observer.next('First value');

  // внутри код мб асинхронный и можем диспатчить разные событие с помощью метода next
  // диспатчим через 1-3сек
  setTimeout(() => observer.next('After 1000 ms'), 1000);
  setTimeout(() => observer.complete(), 1500);
  //setTimeout(() => observer.error('Smth went wrong'), 3000);
  // после необбработанной ошибки код выполнен не будет, обработка в subscribe
  setTimeout(() => observer.next('After 3000 ms'), 3000);
});

// теперь на этот объект стрима stream2$ мы можем подписаться где нам захочется
stream2$.subscribe(
  (val) => console.log(`Val: ${val}`),
  (err) => console.log(err),
  () => console.log(`complete`)
);

// альтернативная запись обработки результатов в стриме.
// можем передавать три cb по очереди в subscribe
// или передавать объект с тремя ключами:
stream2$.subscribe({
  next(val) {console.log(`Val: ${val}`)},
  error(err) { console.log(err) },
  complete() {console.log(`complete`)}
});

// 4: создать стрим - из события
//  подписаться на него
fromEvent(document.querySelector('canvas'), 'mousemove')
  //перед подпиской приведем объект событие в нужный формат
  .pipe(
    map(e => ({
      x: e.offsetX,
      y: e.offsetY,
      ctx: e.target.getContext('2d')
    }))
  )
  .subscribe(position => {
    position.ctx.fillRect(position.x, position.y, 2, 2)
  });

// добавим функцонал кнопке очистить:
// создадим новый стрим
const clear$ = fromEvent(document.getElementById('clear'), 'click');

clear$.subscribe(() => {
  const canvas = document.querySelector('canvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
});

// 5: создать стрим - метод interval
// когда вызываем метод subscribe, то на выходе получает подписку
const sub = interval(500).subscribe(v => console.log(v)); //0 1 2 3 4 5 6 7
// отпишемся через 4 сек
setTimeout(() => {
  sub.unsubscribe();
}, 4000);


// 6: создать стрим - метод timer
timer(250).subscribe(v => console.log(v)); // 0

// 7: создать стрим - метод range
range(42, 5).subscribe(v => console.log(v)); //42 43 44 45 46
import { Subject, BehaviorSubject, ReplaySubject } from "rxjs";

document.addEventListener('click', () => {
  const stream$ = new Subject();
  // сначала подписываемся
  stream$.subscribe(v => console.log(`Value: ${v}`));
  // потом имитим события - метод next, можем передавать к-л данные
  stream$.next('Hello'); // при клике по документу увидим результат
});

document.addEventListener('click', () => {
  const stream$ = new BehaviorSubject('First!');
  stream$.subscribe(v => console.log(`Value: ${v}`));
  stream$.next('Second!');
  //если мы подпишемся после методов next, то получим последний результат, который заменит изначальный
});

document.addEventListener('click', () => {
  const stream$ = new ReplaySubject(1);
  // в ReplaceSubject мы можем подписаться после того как диспатчим события, тк он их сохраняет
  // по умол он выводит все значения, к-е были задиспатчены
  // но мы можем это контролировать указав размер буфера
  stream$.next('One');
  stream$.next('Two');
  stream$.next('Three');
  stream$.subscribe(v => console.log(`Value: ${v}`));
});
import { interval } from 'rxjs'
import { filter, map, take, scan } from 'rxjs/operators'


const btn = document.getElementById('interval');
const rxjsBtn = document.getElementById('rxjs');
const display = document.querySelector('#problem .result');

const people = [
  {name: 'Vladilen', age: 25},
  {name: 'Elena', age: 17},
  {name: 'Ivan', age: 18},
  {name: 'Igor', age: 14},
  {name: 'Lisa', age: 32},
  {name: 'Irina', age: 23},
  {name: 'Oleg', age: 20}
]
;
// при клике на кнопку интервал вывести в блок результата людей, к-м больше 18 лет с интервалом 1с
// классический JS
btn.addEventListener('click', () => {
  btn.disabled = true;
  let i = 0;
  const canDrink = [];

  const interval = setInterval(() => {

    if (people[i]) {
      if (people[i].age >= 18) {
        canDrink.push(people[i].name);
      }
      display.textContent = canDrink.join(' ');
      i++;
    } else {
      clearInterval(interval);
      btn.disabled = false;
    }


  }, 1000)
});

// rxjs

rxjsBtn.addEventListener('click', () => {
  rxjsBtn.disabled = true;
  // заведем новый стрим rxjs
  // у любых стримов в rxjs есть метод pipe,
  // куда мы можем передавать различные операторы для манипуляции стримом
  // после этого подпишемся на данный стрим и получим результат

  // interval продолжает работу даже после того как массив закончился,
  // поэтому для отсановки инетрвала используем оператор take
  interval(1000)
    .pipe(
      // в pipe нам надо отфильтровать людей,
      // привести к нужному формату и вывести на экран
      // с помощью операторов
      // в take мы говорим сколько элементов необходимо брать из данного стрима
      // scan работает как reduce исп-м для объединения имен в
      take(people.length),
      filter(v => people[v].age >= 18),
      map(v => people[v].name),
      scan((acc, v) => acc.concat(v), [])
    )
    .subscribe(res => {
      // subscribe принимает 3 cb: для обработки значения, ошибки и завершения (не принимает параметров)
      // в res попадает итог работы всех операторов - массив имен
      display.textContent = res.join(' ');
    }, null, () => rxjsBtn.disabled = false)
});
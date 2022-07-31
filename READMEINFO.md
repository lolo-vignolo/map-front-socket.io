¿Qué es un Sujeto? Un Sujeto RxJS es un tipo especial de Observable que permite la multidifusión de valores a muchos Observadores. Mientras los Observables simples son de monodifusión (cada Observador suscrito es propietario de una ejecución independiente del Observable), los Sujetos son de multidifusión.

Un Sujeto es como un Observable, pero permite la multidifusión a muchos Observadores. Los Sujetos son como EventEmitters: mantienen un registro de múltiples listeners.

Cada Sujeto es un Observable. Dado un Sujeto, se puede suscribir a él, proporcionando un Observador, que empezará a recibir valores. Desde la perspectiva del Observador, no se puede saber si la ejecución Observable viene de un Observable monodifusión simple o de un Sujeto.

Internamente en el Sujeto, susbscribe no invoca una nueva ejecución que emite valores. Simplemente registra el Observador proporcionado en una lista de Observadores, de manera similar a cómo funciona addListener en otras bibliotecas y lenguajes.

Cada Sujeto. Es un objeto con los métodos next(v), error(e), y complete(). Para proporcionarle un nuevo valor al Sujeto, basta con hacer una llamada a next(value), y este será proporcionado a los Observadores registrados en el Sujeto, mediante multidifusión.

En el siguiente ejemplo, se tienen dos Observadores vinculados a un Sujeto, y se le proporcionan varios valores al Sujeto(next):

```
https://leomicheloni.com/Observables-RXJS-subject/
```

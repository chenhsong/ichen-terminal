# iChen&reg; System 4.1 Terminal UI

Language: TypeScript 2.7 or above  
Framework: Angular 5.2 or above

This is a web application that connects to an iChen&reg; System using OpenProtocol&trade;
and displays the current status of each connected machine on a canvas.

The fields and display formats of different values for each field are customizable
(see `doc/ichen-terminal-config-file-reference.md`).

## Non-Production Build

1. Install Angular: `npm install @angular/cli -g`
2. Restore packages: `npm install`
3. Build: `npm build`
4. Completed app is in the `dist` directory

## Production Build

1. Install Angular: `npm install @angular/cli -g`
2. Restore packages: `npm install`
3. Build: `npm build --prod -aot false` (turn off AOT compilation)
4. Completed app is in the `dist` directory


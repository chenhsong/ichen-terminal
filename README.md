iChen® System 4 Terminal UI
==========================

Language: TypeScript 3.7 or above  
Framework: Angular 9.0 or above

This is a web application that connects to an iChen® System using OpenProtocol™
and displays the current status of each connected machine on a canvas.

The fields and display formats of different values for each field are customizable
(see `doc/ichen-terminal-config-file-reference.md`).

How to Build
------------

1. Install Angular: `npm install @angular/cli -g`
2. Restore packages: `npm install`
3. Build: `ng build --prod`
4. Completed app is in the `dist` directory

Note: AOT is **disabled** because the display template is built dynamically.


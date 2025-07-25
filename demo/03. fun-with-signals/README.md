# FunWithSignals

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.
# why use readonly

The readonly keyword refers to the property itself which is a pointer to a signal object. Yes, you can change the content of the signal, but you don't want to replace the signal object with a new one.

In zoneless applications, angular receives notification when signals change their content, but it does not "know" when you switch between one signal to another. And by using the readonly keyword we ask typescript to make sure we stay with the original signal and not replace it, even if we change its content to a new value.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

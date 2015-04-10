
// Basic concepts demos

// JavaScript works as you expected it to
// 1) Show that the JavaScript basically remains unchanged

// function SayHello() {
//     console.log('Hello');
// }
//
// SayHello();

// TypeScript "any" type allows JavaScript dynamic typing to continue to work
// 1) Change parameter to an unexpected type
// 2) Add type information to prevent this bug
// 3) Notice that type information evaporates
// 4) Notice that the return type is inferred

// function Add(number1: number, number2: number) {
//     return number1 + number2;
// }
//
// var addResult = Add(1, 2);
// console.log(addResult);

// Type Inference
// 1) Show how type inference works

// var myBooleanVar = false;
// var myNumberVar = 0;
// var myStringVar = '';
// var myAnyVar;
// var myNullAnyVar = null;
//
// var myNumberArrayVar = [1, 2, 3];
// var myStringArrayVar = ['', '', ''];

// Functions
// 1) Show how to specify the signature of the function
// 2) Show how to type callback functions
// 3) Show arrow functions

// var myFunctionDefinition: (number1: number, number2: number) => number;
//
// myFunctionDefinition = function (number1: number, number2: number): number {
//     return number1 + number2;
// };
//
// function CallbackFunctionDefinition(number1: number, number2: number,
//         callback: (number1: number, number2: number) => number): number {
//     return callback(number1, number2);
// }
//
// var myArrowFunction = (number1: number, number2: number): number => {
//     return number1 + number2;
// };

// Union Types
// 1) Show how you can specify more than one type
// 2) Show how you can use type guards to execute different code paths

// function unionTypesFunction(value: string|string[]) {
//     if (typeof value === 'string') {
//         console.log(value.length);
//     } else {
//         console.log(value.length);
//     }
// }
//
// unionTypesFunction('hello');
// unionTypesFunction(['a','b']);

// Ambient Declarations
// 1) Show how to reference a variable that exists in the global namespace

// declare var myGlobal;
// console.log(myGlobal);

// Type Definition Files

// /// <reference path="lodash.d.ts"/>
//
// var maxNumber = _.max([1, 2, 3]);

// Interfaces
// 1) Show how to define an interface
// 2) Show that interfaces evaporate
// 3) Show how to use an interface to describe object literals
// 4) show how to extend an interface

// interface MyInterface {
//     number1: number;
//     number2: number;
//     add(number1: number, number2: number): number;
// }
//
// interface MyExtendedInterface extends MyInterface {
//     number3: number;
// }
//
// function MyFunction(obj: MyExtendedInterface) {
//     return obj.add(obj.number1, obj.number2);
// }
//
// var result = MyFunction({
//     number1: 1,
//     number2: 2,
//     number3: 3,
//     add: (number1, number2) => {
//         return number1 + number2;
//     }
// })
//
// console.log(result);

// Classes
// 1) Show how to define a class
// 2) Show the resulting JS
// 3) Private members
// 4) Show how to extend a class
// 5) Show how classes look in ES6

// class MyClass {
//     number1: number;
//     number2: number;
//
//     constructor(number1: number, number2: number) {
//         this.number1 = number1;
//         this.number2 = number2;
//     }
//
//     add() {
//         return this.number1 + this.number2;
//     }
//
//     private hidden() {
//     }
// }
//
// class MyExtendedClass extends MyClass {
//     number3: number;
//
//     constructor(number1: number, number2: number, number3: number) {
//         super(number1, number2);
//         this.number3 = number3;
//     }
// }
//
// var myClass = new MyClass(1, 2);
// console.log(myClass.number1);
// console.log(myClass.number2);
// console.log(myClass.add());
//
// var myExtendedClass = new MyExtendedClass(1, 2, 3);
// console.log(myExtendedClass.number1);
// console.log(myExtendedClass.number2);
// console.log(myExtendedClass.number3);
// console.log(myExtendedClass.add());

// Modules
// 1) Show internal module
// 2) Show external module
// 3) Show module merging

// module MyModule {
//     export class MyClass {
//         number1: number;
//         number2: number;
//
//         constructor(number1: number, number2: number) {
//             this.number1 = number1;
//             this.number2 = number2;
//         }
//
//         add() {
//             return this.number1 + this.number2;
//         }
//
//         private hidden() {
//         }
//     }
// }
//
// module MyModule {
//     export class AnotherClass {
//         string1: string;
//     }
// }
//
// var myModuleClass = new MyModule.MyClass(1, 2);
// console.log(myModuleClass.add());

// export class MyClass {
//     number1: number;
//     number2: number;
//
//     constructor(number1: number, number2: number) {
//         this.number1 = number1;
//         this.number2 = number2;
//     }
//
//     add() {
//         return this.number1 + this.number2;
//     }
//
//     private hidden() {
//     }
// }

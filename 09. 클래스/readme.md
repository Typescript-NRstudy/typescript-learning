# 클래스(class)

자바스크립트의 최신 문법이기도한 클래스를 타입스크립트 클래스와 구분하여 알아보자.

<br/>

## 클래스란?

유사한 객체를 간편히 생성하기 위한 자바스크립트 최신 문법(ES6)<br/>
클래스는 보통 객체를 생성하기 위해 생성자 함수를 사용하는 관례를 문법 레벨로 지원하는 도구이다

### 생성자 함수와 클래스

일반적으로 모양이 유사한 객체를 여러개 만들어야 할 때, 객체를 여러번 생성하기보다 다음과 같이 생성자 함수를 만들어서 사용하는 것이 관례이다.

```javascript
function Developer(name, age) {
  this.name = name;
  this.age = age;
}

let dev = new Developer("Ryu", 20);
console.log(dev); // Person { name: 'Ryu', age: 20 }
```

그리고 이 생성자 함수를 최신 자바스크립트 문법으로 표현하면 다음과 같다. 코드는 다르지만 역할은 동일하다.

```javascript
class Developer {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

let dev = new Developer("Ryu", 20);
console.log(dev); // Person { name: 'Ryu', age: 20 }
```

<br/>

## 클래스 문법

### 1. 클래스 선언

```javascript
class Person {
  // 생성자 메서드(constructor)
  constructor(name, age) {
    // 클래스 속성, 필드(class property, field)
    this.name = name;
    this.age = age;
  }

  // 클래스 메서드(class method)
  printName() {
    console.log(this.name);
  }
}
```

### 2. 클래스 인스턴스 생성

`new` 키워드를 사용하여 클래스를 호출하면 클래스의 인스턴스가 생성된다

```javascript
let ryu = new Person("Ryu", 20);
console.log(ryu); // Person { name: 'Ryu', age: 20 }
ryu.printName(); // Ryu
```

### 3. 클래스 상속(inheritance)

부모 클래스의 속성과 메서드 등을 자식 클래스에서도 사용할 수 있도록 하는 것 (재사용성)<br/>
클래스를 상속받을 때는 `extends` 키워드를 사용한다

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  init() {
    console.log("init");
  }

  printName() {
    console.log(this.name);
  }
}

class Developer extends Person {
  constructor(name, age, language) {
    // ✅ 자식 클래스의 인스턴스를 생성할 때, 부모 클래스의 생성자 메서드를 호출해야 한다
    super(name, age);
    this.language = language;
    this.init();
  }

  introduce() {
    console.log(
      `My name is ${this.name}, I am ${this.age} years old, and I use ${this.language}`
    );
  }
}
```

자식 클래스 내부뿐만 아니라 클래스 인스턴스도 부모 클래스의 속성과 메서드에 접근할 수 있다<br/>

```javascript
const ryu = new Developer("Ryu", 20, "TypeScript");

console.log(ryu); // Developer { name: 'Ryu', age: 20, language: 'TypeScript' }
ryu.printName(); // Ryu
ryu.introduce(); // My name is Ryu, I am 20 years old, and I use TypeScript
```

<br/>

## 클래스에 타입을 정의하는 방법

JavaScript 클래스의 속성과 메서드에 타입 정의를 추가하여 TypeScript 클래스로 변환할 수 있다.<br/>
단, TypeScript로 클래스를 정의할 때는 클래스 이름 바로 아래에 `생성자 메서드에서 사용될 속성을 미리 정의`해야한다.(1️⃣) 그렇지 않으면 속성에 접근할 수 없기 때문이다.

```typescript
class Calculator {
  // 1️⃣ 클래스 속성에 타입 정의(클래스 이름 바로 아래)
  public num1: number;
  public num2: number;

  // 2️⃣ 생성자 메서드에 타입 정의
  constructor(num1: number, num2: number) {
    this.num1 = num1;
    this.num2 = num2;
  }

  // 3️⃣ 클래스 메서드에 타입 정의
  public sum(): number {
    return this.num1 + this.num2;
  }
}
```

<br/>

## 클래스 접근 제어자(Access Modifier)

접근 제어자 `public`, `private`, `protected`를 사용하면 클래스 `속성의 노출 범위를 지정`할 수 있다<br/>

### 필요성

다음 코드는 클래스 속성이 오염되면 클래스 메서드의 동작이 의도치 않게 변경되는 상황을 보여준다<br/>
은행출금, 카드결제 등의 상황에서 다음과 같은 에러는 치명적일 수 있다<br/>

이러한 `의도치 않은 오염을 방지`하기 위해 클래스 속성에 접근 제어자를 사용한다

```typescript
class WaterPurifier {
  waterAmount: number;

  constructor(waterAmount: number) {
    this.waterAmount = waterAmount;
  }

  wash() {
    if (this.waterAmount > 0) {
      console.log("정수기 동작 성공");
    }
  }
}

const purifier = new WaterPurifier(100);
purifier.wash(); // 정수기 동작 성공

purifier.waterAmount = 0;
purifier.wash(); // 메세지가 출력되지 않는다
```

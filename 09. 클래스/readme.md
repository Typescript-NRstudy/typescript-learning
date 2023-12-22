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

<br/>

## Getter와 Setter (Accessor)

클래스 속성을 엑세스하면서 필터링이나 간단한 체크를 수행할 때, 흔히 getter와 setter를 사용한다. TypeScript에서 getter를 사용하기 위해서는 메서드 앞에 get 키워드를 적으며, setter를 사용하기 위해서는 메서드 앞에 set 키워드를 적는다. 아래 예제는 Adult의 나이가 18세 미만인지를 setter에서 체크하고 있다.

```typescript
class Adult {
  private _age: number;
  constructor(age: number) {
    this._age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 18) {
      throw new Error("Invalid age");
    }
    this._age = value;
  }
}

const adult = new Adult(20);
adult.age = 18;
adult.age = 17; // [ERR]: Invalid age
```

<br/>

## 정적 속성 (static property)

정적 속성은 객체가 아닌 클래스 소속의 속성을 가리키며, 속성 앞에 static 이라는 키워드를 붙여 사용한다. 인스턴스 속성은 "this.속성명" 을 통해 엑세스하지만, 정적 속성은 "클래스명.속성명"을 사용하여 엑세스한다. 아래 예제에서 Adult 클래스에 adultAge는 정적 속성으로 정의되어 있고, 클래스 내부 혹은 외부에서 Adult.adultAge을 사용하여 엑세스하고 있다.

```typescript
class Adult {
  static adultAge = 18;
  private _age: number;
  constructor(age: number) {
    this._age = age;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < Adult.adultAge) {
      // 정적 속성은 내부에서도 접근 가능하다.
      throw new Error("Invalid age");
    }
    this._age = value;
  }
}

console.log(Adult.adultAge); // 18
```

<br>

## 읽기 전용 readonly

타입스크립트 클래스에서도 readonly를 사용할 수 있다. 클래스에서의 readonly는 오로지 생성자 내에서만 프로퍼티를 할당할 수 있게 해준다.

```typescript
class Person {
  readonly _birthTime: Date;

  constructor() {
    this._birthTime = new Date(); // 생성자 내에서는 할당 가능
  }

  set birthTime(time: Date) {
    this._birthTime = time; // [ERR]: Cannot assign to 'birthTime' because it is a read-only property.
  }
}
```

<br/>

## 퀴즈

### 🆀 문제

TypeScript의 다양한 클래스 관련 개념을 활용하여 다음 요구사항을 구현해보세요.

1️⃣ Animal 클래스를 정의하세요. 이 클래스는 다음 속성을 가지고 있어야 합니다.

    - name: 문자열로 이루어진 동물의 이름
    - age: 숫자로 이루어진 동물의 나이
    - species: string: 문자열로 이루어진 동물의 종
    - name, age, species는 외부에서 접근할 수 없지만 상속받은 클래스에서는 접근할 수 있어야 합니다
    - 생성자 메서드에서는 name, age, species를 초기화하세요
    - 추가로, displayInfo 메서드를 구현하여 동물의 정보를 출력하세요

2️⃣ Cat 클래스를 정의하세요. 이 클래스는 Animal 클래스를 상속받아야 하며, 다음 속성을 추가로 가져야 합니다.

    - color: 문자열로 이루어진 고양이의 색상. 외부에서 접근할 수 없어야 합니다
    - 생성자 메서드에서는 color를 초기화
    - displayInfo 메서드를 오버라이드하여 고양이의 정보를 출력하세요 (color는 따로 출력)
    - 추가로, getter와 setter를 이용하여 color 속성에 접근할 수 있습니다

<br>

```typescript
// 1. Animal 클래스 정의
class Animal {
  protected name: string;
  protected age: number;
  protected species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  displayInfo(): void {
    console.log(
      `Name: ${this.name}, Age: ${this.age}, Species: ${this.species}`
    );
  }
}

// 2. Cat 클래스 정의
class Cat extends Animal {
  private color: string;

  constructor(name: string, age: number, species: string, color: string) {
    super(name, age, species);
    this.color = color;
  }

  displayInfo(): void {
    super.displayInfo();
    console.log(`Color: ${this.color}`);
  }

  get catColor(): string {
    return this.color;
  }

  set catColor(value: string) {
    this.color = value;
  }
}

// 사용 예제
const animal = new Animal("Leo", 3, "Lion");
const cat = new Cat("Whiskers", 2, "Domestic Cat", "Gray");

animal.displayInfo();
cat.displayInfo();

// 사용 예제 - getter와 setter 활용
console.log(`Cat's color: ${cat.catColor}`);
cat.catColor = "Black";
console.log(`Cat's new color: ${cat.catColor}`);
```
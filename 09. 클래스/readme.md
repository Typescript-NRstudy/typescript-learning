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

<br>
<br>

# 번외 : 우리가 잘못 알고 있는 클래스의 this, super의 동작 원리

#### ❖ Typescript와는 무관한 내용이지만 Class를 배운 김에 같이 알고 가면 좋을 거 같아서 넣어보았습니다.

<br>

우리는 흔히 this는 자기 참조, super는 부모 참조라는 간단한 공식으로 그 동작 원리를 쉽게 추론하고 있다.
이 장을 통해 동작 원리에 대해 배워보자

## 1. this의 동작 원리

다음 코드 예시를 보자

```typescript
class Person {
  age: number;
  name: string;
  constructor(age: number, name: string) {
    this.age = age;
    this.name = name;
  }
  getGoal(): string {
    return "끝까지 생존하며 자신과 똑같은 형질의 개체를 후손으로 남기는 것";
  }

  introduce(): string {
    return `안녕하세요. 저는 ${this.name}입니다. ${
      this.age
    }살이며 ${this.getGoal()}라는 목표를 가지고 있습니다.`;
  }
}

class Developer extends Person {
  skill: string;
  constructor(age: number, name: string, skill: string) {
    super(age, name);
    this.skill = skill;
  }
  getGoal(): string {
    return "질좋은 소프트웨어를 만들어 사람들의 시간을 단축시키고 질을 높이는 것";
  }
}
```

클래스 Developer는 Person을 상속받고 있는 일반적인 코드이다.<br>
만약에 이렇게 Developer 객체를 만들어 `introduce` 메소드를 사용하면 어떻게 될까?
`introduce` 메소드를 사용하면 어떤 클래스의 `getGoal` 가 호출될까?

```typescript
const me = new Developer(27, "ABlue", "JavaScript");
console.log(me.introduce()); // ?
```

결과는 `Developer`의 `getGoal`이 출력된다.

```typescript
[LOG]: "안녕하세요. 저는 ABlue입니다. 27살이며 질좋은 소프트웨어를 만들어 사람들의 시간을 단축시키고 질을 높이는 것라는 목표를 가지고 있습니다."
```

this는 자기 참조라는 표현때문에 this.getGoal는 바로 자기 자신 클래스의 getGoal을 참조할 것이라고 오해하기 쉽다.
class 내에서의 this는 현재 클래스의 메서드를 호출하는 것이 아니라 그 메서드를 호출한 객체의 메서드를 호출한다 생각하면 이해하기 쉽다.
다음 그림을 보고 이해해보자.

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/b8c9a1af-9061-4d56-a02a-17a11b4222a8' width='500' height='400'>

### 1,2 introduce 메서드 탐색

me는 Developer의 인스턴스이다.
me의 introduce 메소드를 호출하면 this 참조는 Developer의 인스턴스를 가리키도록 설정되어 있다.
메서드 탐색은 Developer 클래스에서부터 시작된다. Developer 클래스에는 introduce 메서드가 없기 때문에
부모 클래스인 Person에서 메서드 탐색을 계속한다.
다행히도 Person에 introduce 메서드를 발견하고 이를 실행한다.

### 3,4,5 getGoal 메서드 탐색

Person 클래스의 introduce 메서드를 실행하는 도중 this를 참조하는 객체에게 getGoal이라는 메서드를 호출하라는 구문과 마주치게 되는데
메서드 탐색은 this 참조가 가리키는 객체에서 다시 시작된다.
이 말은 즉, getGoal을 Person에서 찾지않고 introduce를 호출한 me(Developer)에서부터 찾는다는 뜻이다.
따라서 메서드 탐색은 Person에서 벗어나 Developer에서 다시 시작된다.

Developer의 getGoal 메서드가 있으니 이를 실행한 후 동적 메서드 탐색을 종료한다.
그 결과 Person introduce 메서드와 Developer의 getGoal 메서드의 실행 결과를 조합한 문자열이 반환된다.

this 참조는 자식 클래스에서 부모 클래스 방향으로 진행되는 동적 메서드 탐색 경로를 다시 this 참조가 가리키는 원래의 자식 클래스로 이동시킨다.

this의 동작 원리와 함께 메서드 탐색 방법은 아래와 같다.

    1. 메서드를 호출한 객체는 먼저 자신을 생헝한 클래스에 적합한 메서드가 존재하는지 검사한다. 존재하면 메서드를 실행하고
    탐색을 종료한다.

    2. 메서드를 찾지 못했다면 부모 클래스에서 메서드 탐색을 계속한다. 이 과정은 적합한 메서드를 찾을 때까지 상속 계층을 따라 올라가며 계속된다. 만일 이 때 this 참조자를 만났다면 다시 원래의 자식 클래스로 내려가 1번부터 반복하며 해당 메서드를 탐색한다.

    3. 상속 계층의 가장 최상위 클래스에 이르렀지만 메서드를 발견하지 못한 경우 예외를 발생시키며 탐색을 중단한다.

## 2. super의 원리

super는 부모 클래스를 참조하는 것이라고 잘못 알고 있다.<br>
완전히 잘못된 설명은 아니지만 완벽하다고도 볼 수 없다.<br>
만일 부모 클래스를 참조하는 것이라면 다음 코드는 이해가 되지 않을 것이다.

```typescript
class Startup extends Developer {
  constructor(age: number, name: string, skill: string) {
    super(age, name, skill);
  }

  introduce(): string {
    return super.introduce();
  }

  getGoals(): string {
    return "자기가 일하는 회사를 만들어 사회에 기여하는 것";
  }
}

const me = new Startup(27, "ABlue", "JavaScript");
console.log(me.introduce()); // 실행이 될까요?
```

super가 부모 클래스의 메서드를 호출하는 것이라면 위 코드는 정상적으로 실행될 수 없을 것이다.<br>
부모 클래스인 Developer에는 introduce 메서드가 정의되어 있지 않기 때문이다.

하지만 위 코드는 정상적으로 실행되며 Person에 introduce의 메서드가 실행된다.

```typescript
[LOG]: "안녕하세요. 저는 ABlue입니다. 27살이며 자기가 일하는 회사를 만들어 사회에 기여하는 것라는 목표를 가지고 있습니다."
```

사실 super 참조의 용도는 부모 클래스를 가리키는 것이 아니라 `"지금 이 클래스의 부모 클래스에서부터 메서드 탐색을 시작하세요."` 다.<br>
부모 클래스에서 원하는 메서드를 찾지 못했다면 더 상위의 부모 클래스로 이동하면서 메서드가 존재하는지 검사하는 것이다.<br>
super 참조를 통해 실행하고자 하는 메서드가 반드시 부모 클래스에 위치하지 않아도 되는 유연성을 제공한다.<br>
그 클래스의 조상 어딘가에 그 메서드가 정의되어 있기만 하면 실행된다는 것이다.
다음 그림을 보고 이해해보자.

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/2f980f51-1bc3-470b-8de1-e587d70b8d6e' width='500' height='600'>

### 1,2 super.introduce 메서드 탐색

Startup 객체의 introduce 메서드를 호출하면 super.introduce 메서드를 호출하게 된다.
super는 현재 클래스인(introduce를 호출한 객체가 아닌 것에 주의하자) Startup의 부모 클래스인
Developer에서부터 introduce를 메서드를 탐색한다.

### 3 introduce 메서드 탐색

아쉽게도 Developer에는 introduce 메서드가 없다.
그럼 한 단계 더 위의 부모 클래스인 Person에서 introduce를 탐색한다.
Person 클래스에는 다행히도 introduce가 있으며 이를 실행한다.

### 4 getGoal 메서드 탐색

그림에는 없지만 Person의 introduce에는 this.getGoal() 메서드를 호출한다.
여기서의 this는 Startup이므로 Startup부터 다시 getGoal 메서드를 탐색하면 된다.
결과적으로 Startup의 getGoal 메서드가 호출된다.

## 정리

this 참조는 메시지를 수신하는 객체의 클래스에 따라 메서드를 탐색할 시작 위치를 `동적`으로 결정하는데 비해 super 참조는
항상 메시지를 전송하는 클래스의 부모 클래스에서부터 시작되므로 `정적`즉 컴파일 시점에서 결정된다.
앞의 예시를 보면 getGoal이라는 메서드를 호출했던 this 참조는 어떤 클래스에서 메서드 탐색이 시작될지 알지 못한다. Developer일수도 있고
StartUp일수도 있고 미래의 추가될 새로운 자식 클래스일 수 있다.

하지만 super는 다르다. super 참조는 항상 해당 클래스의 부모 클래스에서부터 메서드 탐색을 시작한다.
this 참조를 통한 메서드 탐색을 시작하는 클래스는 미정이지만 super 참조를 통한 메서드 탐색은 컴파일 시점에서 미리 정해진다.
따라서 this 참조인 경우 메서드 탐색을 시작할 크랠스를 반드시 런타임 시점에 동적으로 결정해야 하지만
super 참조의 경우에는 컴파일 시점에 미리 결정할 수 있다.

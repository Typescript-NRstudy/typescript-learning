# 연산자를 사용한 타입 정의

자바스크립트의 OR(||), AND(&&) 연산자를 사용하여 타입을 정의하는 방법을 알아보자.

<br/><br/>

## 유니온 타입(Union Type)

두 개 이상의 타입을 포함할 수 있는 새로운 타입을 만드는 방법 중 하나이다. 여러 개의 타입 중 하나의 타입만 사용하겠다고 선언하는 것이다.<br/>
파이프(|)로 타입들을 연결하여 사용한다.

### 사용

```typescript
function logText(text: string | number) {
  console.log(text);
}

printID("ABC"); // 문자열 전달
printID(123); // 숫자 전달
```

<br/>

### 장점

#### 1. 코드 중복 방지

유니온 타입을 사용하면 동일한 동작을 타입이 다르다는 이유로 함수를 하나 더 작성해서 관리하지 않아도 된다.

#### 2. 타입 정확성 확보

`any`를 사용하여 모든 타입을 허용하는 함수를 만들 수도 있지만, 타입스크립트의 장점을 살릴 수 없게 된다.(속성, API 자동 완성 등) <br/>
유니온 타입을 사용하면 타입을 더 정확하게 제한할 수 있기 때문에, 타입스크립트의 장점을 살릴 수 있다.

#### Before

```typescript
function logText(text: string) {
  console.log(text);
}
function logNumber(text: number) {
  console.log(text);
}
```

#### After

```typescript
function logText(text: string | number) {
  console.log(text);
}
```

<br/>

### 특징(주의사항)

함수의 파라미터에 유니온 타입을 사용하면 함수 안에서는 두 타입의 공통된 속성과 메서드만 자동 완성한다. 즉 `교집합된 속성만 자동 완성`된다.<br/>

```typescript
interface Person {
  name: string;
  age: number;
}

interface Developer {
  name: string;
  skill: string;
}

function introduce(someone: Person | Developer) {
  // name은 Person과 Developer의 공통된 속성
  console.log(someone.name);
}
```

<br/>

### 타입 가드(Type Guard)

유니언 타입을 사용하면 타입의 범위가 넓어지기 때문에, 타입의 범위를 좁혀나가는 과정이 필요하다.<br/>
`타입 가드`를 사용하면 함수 내부에서 파라미터의 타입 종류에 따라 특정 로직을 실행할 수 있다.

#### 1. in 연산자를 사용한 타입 가드

유니온 타입으로 정의된 객체의 속성을 사용하기 전에 `in 연산자`를 사용하면 속성의 존재 여부를 확인하고, 속성이 존재하는 경우에만 해당 속성을 사용할 수 있다.

```typescript
interface Person {
  name: string;
  age: number;
}

interface Developer {
  name: string;
  skill: string;
}

function introduce(someone: Person | Developer) {
  if ("age" in someone) {
    console.log(someone.age);
  }
  if ("skill" in someone) {
    console.log(someone.skill);
  }
}
```

#### 2. typeof 연산자를 사용한 타입 가드

유니온 타입으로 정의된 파라미터의 타입이 원시 타입인 경우, `typeof 연산자`를 사용하여 타입을 구분할 수 있다.

```typescript
function logText(text: string | number) {
  if (typeof text === "string") {
    console.log(text.toLocaleUpperCase());
  }
  if (typeof text === "number") {
    console.log(text.toLocaleString());
  }
}
```

<br/><br/>

## 인터섹션 타입(Intersection Type)

두 개 이상의 타입을 `결합`하여 하나의 새로운 타입을 생성하는 방법이다.
& 연산자를 사용하여 표현한다.

### 사용

```typescript
interface Avenger {
  name: string;
}

interface Hero {
  skill: string;
}

function introduce(someone: Avenger & Hero) {
  console.log(someone.name);
  console.log(someone.skill);
}

introduce({ name: "캡틴", skill: "어셈블" });
```

<br/>

### 특징(주의사항)

인터섹션 타입으로 결합된 두 타입의 속성을 모두 사용할 수 있다는 장점이 있지만, 두 타입 중 `하나의 속성이라도 누락되면 에러`가 발생한다.

#### Before

```typescript
introduce({ name: "캡틴" }); // 🚨 skill 속성이 누락되었기 때문에 에러 발생
```

#### After

결합된 두 타입의 모든 속성을 만족하는 인자를 전달해야 한다.

```typescript
introduce({ name: "캡틴", skill: "어셈블" });
```

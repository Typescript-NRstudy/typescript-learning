# 타입 가드(Type Guard)

타입스크립트를 더 효율적으로 사용하기 위해 타입 가드를 사용하는 방법을 알아보자.

<br/>

## 타입 가드?

- 여러 개의 타입을 가지는 변수를 사용할 때, 해당 변수의 타입을 한정시키는 역할을 한다
- 타입가드를 사용하면 아래처럼 특정 위치에서 여러개의 타입 중 하나의 타입으로 걸러낼 수 있다 (가드한다)

  ```typescript
  const updateInput(value: string | number | boolean) {
    if (typeof value === 'string') {
        // value를 string 타입으로 가드한다
        // string 타입이 제공하는 API를 미리 확인하고 자동완성으로 사용할 수 있다
        value.trim();
    }
  }
  ```

<br/>

## 필요성 (타입단언 vs 타입가드)

타입단언과 비교하여 타입 가드를 사용하는 이유를 알아보자

다음과 같이 유니언 타입 등을 사용하면 여러 타입을 가지는 변수를 사용할 수 있다. 하지만, 해당 변수의 타입을 한정시키지 않으면 타입스크립트는 타입을 추론할 수 없다.

```typescript
const updateInput(value: string | number | boolean) {
    value.length; // ❌ Error : value는 string, number, boolean 타입에서 모두 사용할 수 있는 속성과 API만 접근해야 한다
}
```

### 타입단언의 한계

타입 단언을 사용하여 string 타입으로 강제할 수 있지만, 단점이 있다

```typescript
const updateInput(value: string | number | boolean) {
    console.log((value as string).length);
}
```

- 런타임에서는 타입단언이 무시되기 때문에, 타입단언을 사용하면 타입에러가 발생할 수 있다

  ```typescript
  const updateInput(value: string | number | boolean) {
      console.log((value as string).length); // ✅
      console.log((value as number).length); // ❌ Error : length는 string 타입에서 사용할 수 있는 API
  }
  ```

- 매번 타입 단언을 작성해야 한다

  ```typescript
  const updateInput(value: string | number | boolean) {
      (value as number).toFixed(2);
      console.log((value as string).length); // 반복적으로 타입 단언
  }
  ```

### 타입 가드로 타입 단언의 한계 극복하기

타입 가드를 사용하여 타입별로 분기를 나누어 타입을 한정시키자

- 타입 가드 덕택에 특정 위치에서 원하는 타입으로 구분되고, 해당 타입의 API를 사용할 수 있다

  ```typescript
  const updateInput(value: string | number | boolean) {
      if (typeof value === 'string') {
          value.trim(); // ✅
          return;
      }

      if (typeof value === 'number') {
          value.toFixed(2); // ✅
          return;
      }
  }
  ```

<br/>

## 타입 가드 구현 문법

타입 가드에 사용하는 주요 연산자를 알아보자

### 1️⃣ `typeof` 연산자를 사용한 타입 가드

`if`문과 `typeof` 연산자를 조합하면, 특정 위치에서 원하는 타입으로 구분할 수 있다

```typescript
const updateInput(value: string | number | boolean) {
    if (typeof value === 'string') {
        // ✅ 이 블록 내에서는 value의 타입이 string으로 추론된다
    }
}
```

### ⛔️ 주의!! typeof 로는 null을 가드할 수 없다.

```typescript
typeof null === "object"; // true
```

ECMAScript에서 typeof null === 'null' 로 동작하기를 제안을 했지만 [거절당했다](https://web.archive.org/web/20160331031419/http://wiki.ecmascript.org:80/doku.php?id=harmony:typeof_null).

<br>

### 2️⃣ `instanceof` 연산자를 사용한 타입 가드

`instanceof` 연산자는 대상 객체의 프로토 타입 체인에 포함되어 있는지 여부를 판별한다. 이를 활용하여 타입 가드를 구현할 수 있다. 주로 `클래스 타입이 유니언 타입으로 묶여있을 때` 타입을 구분하기 위해 사용한다

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

function fetchInfoByProfile(profile: Person | string) {
  if (profile instanceof Person) {
    // ✅ 이 블록 내에서는 profile의 타입이 Person으로 추론된다
    profile.name; // ✅
    return;
  }

  if (typeof profile === "string") {
    alert("잘못된 타입입니다");
    return;
  }
}
```

### 3️⃣ `in` 연산자를 사용한 타입 가드

`in` 연산자는 객체에 특정 프로퍼티가 존재하는지 여부를 판별한다. 이를 활용하여 타입 가드를 구현할 수 있다. 주로 `인터페이스 타입이 유니언 타입으로 연결되어 있을 때` 특정 인터페이스로 구분하기 위해 사용한다

```typescript
interface OfflineLecture {
  name: string;
  place: string;
}

interface OnlineLecture {
  name: string;
  url: string;
}

function learnCource(material: OfflineLecture | OnlineLecture) {
  material.url; // ❌ Error : OfflineLecture와 OnlineLecture의 공통 속성이 아니므로 에러가 발생한다

  if ("place" in material) {
    // ✅ 이 블록 내에서는 material의 타입이 OfflineLecture으로 추론된다
    material.place; // ✅
    return;
  }

  if ("url" in material) {
    // ✅ 이 블록 내에서는 material의 타입이 OnlineLecture으로 추론된다
    material.url; // ✅
    return;
  }
}
```

단, 타입가드로 특정 타입을 걸러 내려면 해당 타입이 다른 타입과 구분되는 유일한 속성을 가지고 있어야 한다는 것을 주의해야 한다

```typescript
function learnCource(material: OfflineLecture | OnlineLecture) {
  if ("name" in material) {
    // ❌ 타입 가드로 구분할 수 없는 경우
    // 이 블록 내에서는 material의 타입이 OfflineLecture | OnlineLecture로 추론된다
  }
}
```

### ⛔️ 주의!! `in` 연산자는 프로토타입 체인에 의하여 접근할 수 잇는 속성에 대해서도 `true`을 반환한다.

```typescript
"toString" in {}; // true
```

그러므로 `in`을 사용하여 특정 타입을 걸러낼 때 해당 타입의 프로토체인에 걸려있는 모든 부모의 키도 살펴보아야 한다.

<br/>

## 타입 가드 함수

타입 가드를 함수로 정의하여 사용할 수 있다.

### 필요성

여러가지 타입이 섞여있는 유니온 타입을 사용할 때, `in 연산자나 typeof 연산자로 원하는 타입으로 구분해 낼 수 없는 경우` 타입 가드 함수를 사용하여 타입을 구분할 수 있다.

예를 들어, greet() 함수에서 파라미터가 Person 타입인 경우, age를 출력한다고 해보자. 어떻게 타입을 구분할 것인가?

```typescript
interface Hero {
  name: string;
  nickname: string;
}

interface Person {
  name: string;
  age: number;
}

interface Developer {
  name: string;
  age: string;
  skill: string;
}

function greet(someone: Hero | Person | Developer) {
  // ...
}
```

Person 타입이 그나마 유일하게 갖는 속성은 age이다. 하지만, Developer 타입도 age 속성을 가지고 있으므로, `typeof` 연산자나 `in` 연산자로 타입을 구분하기 어렵다. 이런 경우, 타입 가드 함수를 선언하여 더 구체적으로 타입을 구분할 수 있다.

```typescript
function greet(someone: Hero | Person | Developer) {
  if ("age" in someone) {
    // ❌ 이 블록 내에서는 someone의 타입이 Person | Developer 로 추론된다
    console.log(someone.age);
  }
}
```

### 타입 가드 함수 구현

다음은 인자로 받은 객체의 age 속성이 있는지 확인하여, age 속성이 number인지 확인하고 Person 타입으로 추론(구분)하는 타입 가드 함수를 구현 및 적용한 예시이다.

```typescript
// is 연산자를 사용하여 타입 가드 함수의 반환 타입을 지정한다
function isPerson(someone: Person | Developer): someone is Person {
  // as 키워드를 사용하여 Person 타입으로 추론을 강제한 후 age 속성에 접근한다
  return (someone as Person).age === "number";
}

function greet(someone: Hero | Person | Developer) {
  if (isPerson(someone)) {
    // ✅ 이 블록 내에서는 someone의 타입이 Person으로 추론된다
    console.log(someone.age.toFixed(2));
  }
}
```

<br/>

## 구별된 유니언 타입(Discriminated Union)

유니언 타입을 구성하는 여러 개의 타입을 특정 속성의 유무가 아니라 `속성 문자열 타입 값으로 구분`할 수 있다. 이를 구별된 유니언 타입이라고 한다.

아래 유니온 타입을 갖는 someone 변수는 어떻게 특정 타입으로 가드할 수 있을까? 두 타입의 속성의 이름은 모두 같기 때문에 in 연산자로 구분하긴 어렵다.

```typescript
interface Person {
  name: string;
  industry: "common";
}

interface Developer {
  name: string;
  industry: "tech";
}

function introduce(someone: Person | Developer) {
  // ...?
}
```

이때 두 타입에 모두 존재하면서 `값으로 구분될 수 있는 속성`인 industry를 사용하여 타입을 구분할 수 있다.

```typescript
function introduce(someone: Person | Developer) {
  if (someone.industry === "common") {
    // ✅ someone의 타입이 Person으로 추론
  }

  if (someone.industry === "tech") {
    // ✅ someone의 타입이 Developer으로 추론
  }
}
```

<br/>

## 다양한 방법으로 타입 가드하기

타입가드는 if문뿐만 아니라 switch문이나 비교/논리 연산자로도 적용할 수 있다.

### switch 문을 사용한 타입 가드

switch문을 사용하면 여러 타입을 가진 변수를 더 효율적으로 가드할 수 있다.

```typescript
function introduce(someone: Person | Developer | Teacher) {
  switch (someone.industry) {
    case "common":
      // ✅ someone의 타입이 Teacher으로 추론
      break;
    case "tech":
      // ✅ someone의 타입이 Developer으로 추론
      break;
    case "education":
      // ✅ someone의 타입이 Teacher으로 추론
      break;
  }
}
```

#### 주의사항

단, switch문을 사용할 때는 `default문을 사용하여 모든 타입을 가드`할 수 있도록 해야 한다. case 조건 값에 해당하지 않으면 someone 파라미터가 never 타입으로 추론되어 에러가 발생할 수 있기 때문이다.

```typescript
function introduce(someone: Person | Developer | Teacher) {
  switch (someone.industry) {
    // ...

    default:
      // ✅ someone의 타입이 Person | Developer | Teacher 로 추론
      break;
  }
}
```

<br/>

### 비교/논리 연산자를 사용한 타입가드

#### 타입이 null이 아님을 보장하는 방법

다음은 if문을 활용하여 message가 null이 아님을 보장한 후, message의 타입을 string으로 보장하는 예시이다. `null 아님 보장 연산자(!)`, `논리 연산자`를 사용해도 타입 가드를 적용한 효과를 볼 수 있다.

```typescript
function sayHello(message: string | null) {
  if (message === null) return; // message가 null일때 함수를 종료
  console.log(message); // ✅ message의 타입이 string으로 추론
}
```

- `null 아님 보장 연산자(!)` 사용

  - !를 사용하여 message가 null이 아님을 보장하고, string 타입으로 추론하여 null 체크를 생략할 수 있다

    ```typescript
    function sayHello(message: string | null) {
      if (message!.length >= 3) console.log(message);
    }
    ```

- `논리 연산자` 사용

  - && 연산자로 message가 null이 아님을 보장하고, string 타입으로 추론하여 null 체크를 생략할 수 있다

    ```typescript
    function sayHello(message: string | null) {
      if (message && message.length >= 3) {
        console.log(message);
      }
    }
    ```

<br>

### 콜백함수 내에서의 타입가드

Typescript는 콜백 함수 내에서 타입 가드를 했음에도 불구하고 여전히 유효하지 않습니다.

```typescript
// Example Setup
declare var foo: { bar?: { baz: string } };
function immediate(callback: () => void) {
  callback();
}

// Type Guard
if (foo.bar) {
  console.log(foo.bar.baz); // ✅ foo.bar는 {baz: string}으로 추론
  immediate(() => {
    console.log(foo.bar.baz); // ❌ Error: 해당 객체는 'undefined'일 가능성이 있습니다.
  });
}
```

이럴 경우 타입 가드 안에서 로컬 변수를 선언하고 그 안에 값을 담아 타입 추론이 가능하게 만들면 된다.

```typescript
// Type Guard
if (foo.bar) {
  console.log(foo.bar.baz); // ✅ foo.bar는 {baz: string}으로 추론
  const bar = foo.bar;
  immediate(() => {
    console.log(bar.baz); // ✅ foo.bar는 {baz: string}으로 추론
  });
}
```

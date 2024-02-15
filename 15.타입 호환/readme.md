# 타입 호환(Type Compatibility)

타입스크립트로 코드를 작성하다 보면 의도치 않은 에러를 많이 만나게 된다. 타입호환으로 왜 에러가 발생하는지, 어떻게 해결해야하는지 분석해보자.

<br/>

## 타입 호환이란?

타입 호환은 서로 다른 타입이 있을 때, A 타입이 B 타입에 할당 가능한지를 판단하는 것이다.(포함관계)

### 할당 가능 여부

#### 타입 호환이 불가능한 경우

아래 코드에서 string 타입은 number 타입에 할당할 수 없기 때문에 에러가 발생한다.

즉, 타입이 포함관계가 아닌 경우, 타입 호환은 불가능하다.

```typescript
let num: number = 1;
let str: string = "hello";

num = str; // ⚠️ Error
```

> 타입스크립트에서는 타입 호환을 엄격하게 판단한다. 자바스크립트처럼 런타임에 타입 캐스팅(type casting)이 이루어지지 않기 때문이다.

#### 타입 호환이 가능한 경우

`b`는 "hi"라는 문자열 리터럴 타입이기 때문에 `a`에 할당할 수 있다. 문자열 리터럴 타입은 string 타입의 하위 타입이기 때문이다.

즉, string 타입이 'hi' 문자열 리터럴 타입보다 더 큰 범위를 가지고 있기 때문에 할당이 가능하다. ( `'hi' ⊂ string` )

```typescript
let a: string = "hello";
let b: "hi" = "hi";

a = b; // ✅
b = a; // ⚠️ Error : 'hi' 타입은 'hi'만 할당 가능
```

<br/>

## 구조적 타이핑(Structural Typing)

타입스크립트는 타입 호환을 결정할 때, 타입 유형 보다는 `타입의 내부 구조`를 비교한다. 이를 구조적 타이핑이라고 한다.

다음에서 볼 수 있듯이, `Person` 인터페이스와 `Developer` 클래스는 타입 유형이 다르지만, 내부 구조가 동일하기 때문에 호환 가능하다.

```typescript
interface Person {
  name: string;
}

class Developer {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let person: Person = { name: "ryu" };
let dev = new Developer("Na");

person = dev; // ✅
```

<br/>

## 객체 타입 호환

객체 타입은 인터페이스, 타입별칭 등 타입 유형이 아니라, `객체의 내부 구조`를 비교하여 `최소한의 타입 조건`을 만족했는지에 따라 호환 여부를 판단한다.

```typescript
type Person = {
  name: string;
};

interface Developer {
  name: string;
  skill: string;
}

let person: Person = { name: "ryu" };
let developer: Developer = { name: "na", skill: "typescript" };

person = developer; // ✅
developer = person; // ⚠️ Error : Property 'skill' is missing in type 'Person' but required in type 'Developer'
```

### 두 타입 간 동일한 타입을 가진 속성이 1개 이상인 경우

```typescript
person = developer; // ✅
```

`Developer` 타입은 `Person` 타입과 호환 가능하다.

`Developer` 타입에 skill 속성이 하나 더 선언되어 있지만, `Person` 타입 입장에서는 호환하는 데 필요한 조건인 문자열 타입 `name` 속성을 가지고 있기 때문이다.

### 호환을 위한 최소 조건을 만족하지 못하는 경우

```typescript
developer = person; // ⚠️ Error
```

`Person` 타입은 `Developer` 타입과 호환 불가능하다.

`Developer` 타입으로 선언된 변수는 최소한 name, skill 속성을 가지고 있어야 하지만, `Person` 타입에는 skill 속성이 없기 때문에 호환하는 데 필요한 최소 조건을 만족하지 못한다.

- Person 타입에 skill `속성을 추가`하여 타입 에러를 해결하기

  ```typescript
  type Person = {
    name: string;
    skill: string;
  };

  interface Developer {
    name: string;
    skill: string;
  }
  ```

- Developer 타입의 skill `속성을 옵셔널로 변경`하여 타입 에러 해결하기

  ```typescript
  type Person = {
    name: string;
  };

  interface Developer {
    name: string;
    skill?: string;
  }
  ```

<br/>

## 함수 타입 호환

함수 타입도 구조적 타이핑 관점에서 매개변수 타입과 반환 타입을 비교하여 호환 여부를 판단한다.

### 매개변수 타입 호환

### 반환 타입 호환

<br/>

## 이넘 타입 호환

### 숫자형 이넘과 숫자 타입 호환

숫자형 이넘은 숫자 타입과 호환 가능하다.

```typescript
enum SPA {
  React, //0
  Vue, //1
  Angular, //2
}

let id: number = 0;
id = SPA.React; // ✅
```

### 이넘 타입간 호환 불가능

이넘 타입간에는 구조적 타이핑 개념이 적용되지 않는다.

아래의 예시처럼 이넘 타입은 같은 속성과 값을 가졌더라도 이넘 이름이 다르면 호환 불가능하다.

```typescript
enum SPA {
  React, //0
  Vue, //1
  Angular, //2
}

enum Framework {
  React, //0
  Vue, //1
  Angular, //2
}

let spa: SPA = SPA.React;
spa = Framework.React; // ⚠️ Error : Type 'Framework.React' is not assignable to type 'SPA'.
```

<br/>

## 제네릭 타입 호환

제네릭의 타입 호환은 `제네릭으로 받은 타입의 사용 여부`에 따라 결정된다.

### 제네릭으로 받은 타입을 사용하지 않는 경우

제네릭으로 받은 타입이 Product 인터페이스의 타입 구조에 전혀 영향을 미치지 않는다.

이처럼 제네릭으로 받은 타입을 사용하지 않는 경우, 두 제네릭 타입은 서로 호환 가능하다.

```typescript
interface Product<T> {
  name: string;
  price: number;
}

let product1: Product<string> = { name: "cup", price: 1000 };
let product2: Product<number> = { name: "plate", price: 2000 };

product1 = product2; // ✅
product2 = product1; // ✅
```

### 제네릭으로 받은 타입을 사용하는 경우

제네릭으로 받은 타입이 타입 구조 내에서 사용되는 경우, 두 제네릭 타입은 서로 호환 불가능하다.

인터페이스의 타입 구조가 달라지기 때문이다.

```typescript
interface Product<T> {
  id: T;
  name: string;
  price: number;
}

let product1: Product<string> = { id: "prd1", name: "cup", price: 1000 };
let product2: Product<number> = { id: 1, name: "plate", price: 2000 };

product1 = product2; // ⚠️ Error : Type 'Product<number>' is not assignable to type 'Product<string>'.
product2 = product1; // ⚠️ Error
```

```typescript
// prodoct1의 인터페이스 타입
interface Product {
  id: string;
  name: string;
  price: number;
}

// prodoct2의 인터페이스 타입
interface Product {
  id: number;
  name: string;
  price: number;
}
```

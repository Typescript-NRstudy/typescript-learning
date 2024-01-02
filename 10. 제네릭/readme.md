# 제네릭(Generic)

<br/>

## 제네릭이란?

타입을 미리 정의하지 않고 사용하는 시점에 원하는 타입을 정의해서 쓸 수 있는 문법

<br/>

## 문법

`타입변수(T)`를 사용하여 함수에 제네릭을 선언하고 파라미터와 반환 타입에 제네릭 타입을 연결한다

```typescript
function getId<T>(text: T): T {
  // ...
}
```

함수를 호출할 때 타입변수에 타입을 지정하여 함수의 파라미터, 반환값의 타입을 결정할 수 있다

```typescript
getId<string>("hi"); // 타입변수를 선언한 모든 부분에 string이라는 타입이 들어감
```

<br/>

## 제네릭의 장점

### 1. 반복되는 코드를 줄일 수 있다

함수의 역할과 동작은 같지만 타입이 다른 함수를 여러개 선언해야 할 떄 제네릭을 사용하면 코드의 중복을 줄일 수 있다

#### before

```typescript
function getStringArray(arr: string[]): string[] {
  return arr;
}

function getNumberArray(arr: number[]): number[] {
  return arr;
}
```

### after

```typescript
function getArray<T>(arr: T[]): T[] {
  return arr;
}

getArray<string>(["a", "b", "c"]);
getArray<number>([1, 2, 3]);
```

<!-- 컴파일 시점에 타입을 체크하기 때문에 타입 안정성을 높일 수 있다.
타입을 미리 지정하지 않고 사용하는 시점에 타입을 지정할 수 있기 때문에 재사용성이 높아진다. -->

<br/>

### 2. any 타입의 사용을 줄일 수 있다

제네릭을 사용하면 타입을 미리 지정하지 않고 사용하는 시점에 타입을 지정할 수 있기 때문에 any 타입을 사용하지 않아도 된다

#### before

any를 사용하면 타입스크립트의 코드 자동완성이나 에러의 사전 방지 등의 장점을 사용하지 못한다

```typescript
function logText(text: any): any {
  console.log(text);
  return text;
}
```

#### after

제네릭을 사용하면 타입이 정확하게 지정되면서 타입스크립트의 이점을 활용할 수 있다

```typescript
function logText<T>(text: T): T {
  console.log(text);
  return text;
}

logText<string>("hi");
logText<number>(10);
```

<br/>

## 활용

### 인터페이스에 제네릭을 선언하는 방법

인터페이스 타입을 선언할 때 제네릭을 선언하면 타입을 유연하게 확장할 수 있을 뿐만 아니라 비슷한 역할을 하는 타입 코드를 대폭 줄일 수 있다.<br/>

다음은 제품의 종류와 재고를 나타내는 인터페이스이다. 이 상황에서 value에 다른 데이터 타입을 갖는 드롭다운을 추가하고 싶다면 어떻게 해야 할까?

```typescript
interface ProductDropdown {
  value: string;
  selected: boolean;
}

interface StockDropdown {
  value: number;
  selected: boolean;
}
```

#### 👎 bad

다음 방식으로 모든 데이터 타입을 일일이 정의하면 코드를 관리하기 어려워진다.

```typescript
interface AddressDropdowpn {
  value: string;
  selected: boolean;
}
```

#### 👍 good

제네릭을 사용하여 타입을 유연하게 확장할 수 있다.

```typescript
interface Dropdown<T> {
  value: T;
  selected: boolean;
}
```

```typescript
let product: Dropdown<string>;
let stock: Dropdown<number>;
let address: Dropdown<string>;
```

<br/>

## 제네릭 타입 제약

제네릭 타입을 사용할 때 타입 변수(T)에 어떤 타입이 들어올지 알 수 없기 때문에, 타입 변수(T)로 사용할 수 있는 타입을 제한할 수 있다

### 1. `extends` 키워드를 사용하여 제약

모든 타입이 아닌 특정 타입으로 제한하고 싶을 때 사용한다<br/>
제네릭을 선언하는 부분에 `<T extends 특정타입>`을 추가한다<br/>

```typescript
interface LengthType {
  length: number;
}

// 제약조건 : length 속성을 갖는 타입만 제네릭 타입으로 받을 수 있음
function logLength<T extends LengthType>(content: T): T {
  console.log(content.length);
  return content;
}

logLength("a");
logLength(10); // error: number 타입은 LengthType 제약조건을 만족하지 못함
```

### 2. `keyof` 키워드를 사용하여 제약

keyof로 객체 타입의 키를 추출하고 제네릭과 함께 사용하여 타입을 제한할 수 있다.<br/>
제네릭을 선언하는 부분에 `<T extends keyof 객체타입>`을 추가한다<br/>

```typescript
type ShoppingItem = {
  name: string;
  price: number;
};

// 제약조건 : T는 ShoppingItem의 속성 중 하나의 속성이어야 함
// name | price
function getShoppingItemOption<T extends keyof ShoppingItem>(itemOption: T): T {
  return itemOption;
}

getShoppingItemOption("name");
getShoppingItemOption("price");
getShoppingItemOption("stock"); // error: ShoppingItem에 없는 속성은 X
```

<br/>

## 제네릭을 사용할때 주의할 점

제네릭을 사용하면 코드의 재사용성과 유연성을 높일 수 있지만, 동시에 타입 안전성을 유지하기 위해 신중하게 활용해야한다.

### 1. 컴파일러는 제네릭 타입을 추론할 수 없다

개발자가 제네릭 타입을 명시적으로 지정하지 않으면, 컴파일러는 주어진 매개변수 및 반환값을 기반으로 최적의 타입을 추론하려고 시도한다. 항상 정확하게 추론하지는 않을 수 있다. 타입스크립트 컴파일러는 어떤 타입이 들어올지 모르기 때문에 함부로 타입을 가정하지 않는다.

```typescript
function logText<T>(text: T): T {
  console.log(text.length); // error: text는 any 타입이기 때문에 length 메서드를 사용할 수 없음
  return text;
}

logText("hi"); // 컴파일러가 string으로 추론
```

컴파일러가 제네릭 타입을 올바르게 추론하지 못하는 경우, 개발자는 명시적으로 제네릭 타입을 지정하여 해결할 수 있다.

```typescript
logText<string>("hello"); // 제네릭 타입을 사용하는 시점에 타입을 지정했으니까 string 타입으로 취급
```

### 2. 제네릭에 대한 제약 조건을 사용하여 타입 안전성 강화

제네릭 타입을 사용할 때, 특정 조건을 충족시키기 위해 extends 키워드를 사용하여 제약을 설정할 수 있다.

```typescript
function logText<T extends { length: number }>(text: T): T {
  console.log(text.length); // 제네릭 타입 T는 length 속성을 갖고 있다는 제약조건을 만족
  return text;
}
```

### 3. 타입 단언을 사용하여 컴파일러에게 정보 제공

경우에 따라서 개발자는 컴파일러에게 특정 값이 어떤 타입인지 확신할 수 있을 때, 타입 단언을 사용하여 컴파일러에게 해당 정보를 전달할 수 있다.

```typescript
function logText<T>(text: T): T {
  (text as string).split(""); // 컴파일러에게 string 타입임을 알려줌
  return text;
}
```

<br/>

## 퀴즈

### 1. 함수 제네릭 선언

아래의 함수 mergeArrays는 두 개의 배열을 합치고, 중복된 요소를 제거하여 반환하는 함수입니다.
함수에 제네릭을 적절히 선언하고, 함수를 호출하세요.

```typescript
function mergeArrays(arr1, arr2) {
  const merged = [...arr1, ...arr2];
  return Array.from(new Set(merged));
}
```

#### 정답

```typescript
function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  const merged = [...arr1, ...arr2];
  return Array.from(new Set(merged));
}

mergeArrays<string>(["hello", "world"], ["bye", "world"]);
mergeArrays<number>([1, 2, 3], [3, 4, 5]);
```

### 2. 제네릭 타입 제약

다음은 특정 유형의 객체에서 지정된 프로퍼티를 가져와 반환하는 함수입니다. 하지만 모든 객체가 모든 프로퍼티를 갖고 있는 것은 아닙니다. keyof와 extends를 사용하여 이 함수에 올바른 타입 제약을 추가하세요.

```typescript
function getProperty(obj: any, key: string): any {
  return obj[key];
}
```

#### 정답

obj가 K 키를 가져야 하며, key의 타입은 K로 제한한다. 이를 통해 프로퍼티가 존재하지 않을 경우 컴파일 에러가 발생하도록 올바른 타입 제약을 설정할 수 있다.

`Record<K, any>`는 'T는 K라는 키를 가진 객체여야 한다'는 의미의 TypeScript의 표준 라이브러리에서 제공되는 유틸리티 타입이다.

```typescript
function getProperty<T extends Record<K, any>, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

getProperty({ name: "ryu", age: 20 }, "name"); // ryu
```

# 타입추론

코드 작성 시 제공받는 부가적인 코드 정보나 자동완성 기능은 타입추론을 통해 이루어진다.

<br/>

## 타입추론이란?

타입스크립트가 코드를 해석할 때, 코드에 대한 정보가 부족한 경우 자동으로 적절한 타입을 정의하는 동작을 말한다.<br/>
타입추론을 통해 코드를 더 간결하게 작성할 수 있다. 자동으로 타입이 추론되는 코드는 타입을 표기하지 않아도 되기 때문이다.

```typescript
let a = 10; //a의 타입은 number로 추론된다
```

<br/>

## 변수의 타입추론

변수의 타입은 선언하는 시점에 할당된 값을 기반으로 추론된다.

### 초기화가 되지 않은 변수의 타입추론

다음에서, a가 선언되는 시점엔 값이 할당되지 않아 어떤 값이 들어올지 알 수 없다.<br/>
따라서 어떤 값이 들어와도 받을 수 있는 타입인 any로 추론된다.

```typescript
let a; // any로 타입추론
```

### 초기화가 된 변수의 타입추론

다음은 초기값으로 문자열을 할당한 경우이다. 초기화가 된 변수는 할당된 값에 따라 적절한 타입이 추론된다.

```typescript
let a = "hello!"; // a는 string으로 타입추론
```

단, 이미 초기화가 된 변수의 값을 변경하는 경우에는 타입이 변경되지 않는다.

```typescript
let a = "hello!";
a = 10; // ✅ a의 타입은 여전히 string으로 타입추론
```

<br/>

## 함수의 타입 추론

함수는 주어진 매개변수와 반환값에 따라 타입이 추론된다.

### 함수의 반환 타입 추론

함수의 반환 타입은 파라미터 타입과 내부 로직의 반환 타입으로 추론된다.<br/>
result가 number로 추론되는 이유는 sum()함수의 반환 타입이 number이기 때문이다.

```typescript
function sum(a: number, b: number) {
  return a + b; // 1. 내부 로직의 결과값이 number 타입
}

const result = sum(10, 20); // 2. result는 number로 타입추론
```

단, 함수의 반환 타입이 없는 경우에는 `void`로 추론된다.

```typescript
function introduce(name: string) {
  console.log(`저는 ${name} 입니다.`);
}

const result = printMe("rjk"); // result는 void로 타입추론
```

### 함수의 매개변수 타입 추론

함수의 매개변수 타입은 함수의 매개변수에 할당된 값으로 추론된다.

```typescript
function sum(a: number, b: number) {
  return a + b; // a와 b의 타입은 number로 추론
}

sum(10, 20);
```

파라미터에 기본값이 설정된 경우, 해당 기본값의 타입을 파라미터의 타입으로 추론한다.

```typescript
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`); // name의 타입은 string으로 추론
}

greet(); // Hello, Guest!
greet("Na"); // Hello, Na!
```

<br/>

## 다양한 타입추론 방식

### 인터페이스 상속과 제네릭이 함께 사용되는 경우

인터페이스 상속과 제네릭이 함께 사용되는 구조에서 제네릭의 타입을 추론해보자.<br/>
다음의 경우, `detailedItem`의 value의 타입은 string으로 추론된다. DetailedDropdown 인터페이스로 받은 제네릭 타입(K)이 Dropdown 인터페이스의 제네릭 타입(T)으로 전달되기 때문이다.

```typescript
interface Dropdown<T> {
  value: T;
  title: string;
}

interface DetailedDropdown<K> extends Dropdown<K> {
  description: string;
}

const detailedItem: DetailedDropdown<string> = {
  // value의 타입은 string으로 추론
  value: "GOODS_01",
  title: "맥북",
  description: "M2 프로 14인치",
};
```

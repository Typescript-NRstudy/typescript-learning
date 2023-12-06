# 타입 별칭(Type Alias)

<br/><br/>

## 타입 별칭?

특정 타입이나 인터페이스 등을 참조할 수 있는 타입 변수를 의미한다.
쉽게 말해 특정 타입에 대해 별칭을 지정하는 것.
변수의 타입이 어떤 타입인지 명시하기 위해 사용하거나 여러번 반복해서 사용해야 하는 타입에 대해 별칭을 지정하여 간결하게 표현할 수 있다.

```typescript
type MyStringType = string;

const str: MyStringType = "world"; // 타입 별칭을 사용한 타입 지정
```

<br/>

### 장점

#### 1. 반복되는 타입의 코드를 줄일 수 있다

##### Before

```typescript
function getFullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`;
}

const user: { firstName: string; lastName: string } = {
  firstName: "John",
  lastName: "Smith",
};

getFullName(user);
```

##### After

위 코드에서 user의 타입을 지정할 때, 타입 별칭을 사용하면 다음과 같이 간결하게 표현할 수 있다.<br/>
단순히 반복되는 타입을 줄일 수 있을 뿐만 아니라, User가 firstName과 lastName 두 속성을 가진 객체임을 명시적으로 표현할 수 있다.

```typescript
type User = { firstName: string; lastName: string };

function getFullName(user: User) {
  return `${user.firstName} ${user.lastName}`;
}

const user: User = {
  firstName: "ryu",
  lastName: "jk",
};

getFullName(user);
```

<br/>

#### 2. 타입의 유형을 더 세밀하게 표현해 코드의 동작을 더 이해하기 쉽게 만들 수 있다.

##### Before

```typescript
function calculateRectangleArea(width: number, height: number): number {
  return width * height;
}
```

##### After

```typescript
type Centimeter = number;

function calculateRectangleArea(
  width: Centimeter,
  height: Centimeter
): Centimeter {
  return width * height;
}
```

### 주의사항

타입별칭의 이름이 중복되면 안된다.<br/>
즉, 타입변수는 타입을 선언하고 다시 다른 타입을 선언할 수 없다.

```typescript
type User = { firstName: string; lastName: string };
type User = { firstName: string; lastName: string; age: number }; // Error
```

<br/>

## 타입별칭과 인터페이스의 차이점

타입별칭과 인터페이스 모두 객체 타입을 정의할 수 있지만, 차이점이 존재한다.<br/>

### 1. 코드 에디터에서 표기 방식 차이

동일한 속성과 타입을 갖는 객체를 타입별칭과 인터페이스로 정의하고 코드 에디터에서 확인해보면 차이점을 알 수 있다.

#### type 사용시

<img width="320" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/416e9428-7962-442d-8818-03c858d32a83">

#### interface 사용시

<img width="355" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/f648d7cc-3773-45b7-86b9-99aacd92f317">

### 2. 사용할 수 있는 타입의 차이

주요 데이터 타입, 인터섹션, 유니온, 유틸리티, 맵드 타입은 타입 별칭으로만 정의할 수 있다. 이렇게 인터페이스로 정의할 수 없는 타입은 타입 별칭을 사용한다.

```typescript
type Id = string | number;
type Product = MainProduct | SubProduct;
type JaeKyeong = Person & Developer;
```

### 3. 타입 확장 가능성

타입 확장이란 이미 정의된 타입을 조합해서 더 큰 의미의 타입을 만드는 것을 의미한다.

#### 인터페이스 확장

인터페이스는 타입을 확장할 때 상속이라는 개념을 사용한다

```typescript
interface Person {
  name: string;
  age: number;
}
interface Developer extends Person {
  language: string;
}

const jaeKyeong: Developer = {
  language: "typescript",
  name: "jaekyeong",
  age: 10,
};
```

#### 타입별칭 확장

타입별칭은 인터섹션 타입으로 객체 타입을 2개 이상 합쳐서 확장할 수 있다

```typescript
type Person = {
  name: string;
  age: number;
};

type Developer = {
  language: string;
};

type Ryu = Person & Developer;

const JaeKyeong: Ryu = {
  name: "jaekyeong",
  age: 10,
  language: "typescript",
};
```

<br/>

## 타입 별칭은 언제 사용해야 할까?

타입 별칭으로만 타입 정의가 가능한 곳에서는 타입별칭을 사용하고, 백엔드와의 인터페이스를 정의하는 곳에서는 인터페이스를 사용하는 것이 관례이다.

### 타입 별칭으로만 정의할 수 있는 타입

주요 데이터 타입, 인터섹션, 유니온, 유틸리티, 맵드 타입은 타입 별칭으로만 정의할 수 있다.
이렇게 인터페이스로 정의할 수 없는 타입은 타입 별칭을 사용한다.

```typescript
// 유틸리티 타입
type Admin = {
  name: string;
  age: number;
  role: string;
};
type OnlyName = Pick<Admin, "name">;

// 맵드 타입
type Picker<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### 백엔드와의 인터페이스 정의

객체 속성이 다른 객체 정보와 결합하여 표시되어야 한다면 기존 타입 확장이라는 측면에서 인터페이스로 정의하는 것이 좋다.

```typescript
interface Admin {
  role: string;
  department: number;
}

// 1. 상속을 통한 인터페이스 확장
interface User extends Admin {
  id: string;
  name: string;
}

// 2. 선언 병합을 통합 타입 확장
interface User {
  skills: string[];
}
```

상속과 선언 병합 특징에 따라 최종적으로 User 인터페이스는 다음과 같이 정의된다.

```typescript
interface User {
  id: string;
  name: string;
  skills: string[];
  role: string;
  department: number;
}
```

## object type에 대해 잘못 알고 있는 사실

우리는 흔히 object type(`{}`)에 대해 잘못 알고 있다.
보통 object type을 객체 리터럴로 알고 있고 있기 때문이다.

```typescript
const me: { age: number; name: string } = { age: 27, name: 'NaJaeWan' };
```

그러면 다음과 같은 코드는 이해하지 못하게 된다.

```typescript
const x: {} = 1; // 이게 왜 오류가 안나는거죠??
```

object type은 <b>조건/제약</b>과 비슷하다.  
즉 `{ age: number, name: string }`이란 타입은 알 수 없는 타입에 age와 name이란 속성에 엑세스할 수 있어야하고
그 속성의 값의 타입은 number, string이여야 한다는 것이다.  
`const x: {} = 1; `의 경우에는 알 수 없는 타입에 그 어떤 속성에도 관심 없는 타입을 말한다는 것이다.
그래서 1이 아닌 그 어떤 타입의 값이 와도 오류가 나질 않는다.

또한 자바스크립트의 모든 타입은 toString()라는 내장메소드를 갖고있으므로 아래의 코드도 문제가 없다.

```typescript
const x: { toString(): string } = 1;
```

정리하자면 object type(`{}`)은 빈 객체가 아니라 <b>어떤 타입의 조건/제약을 명시</b>하는 것이라고 생각하면 된다.

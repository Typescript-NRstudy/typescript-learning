# 유틸리티 타입(utility type)

타입스크립트는 이미 정의된 타입을 변형하여 사용할 수 있는 유틸리티 타입을 제공한다.

실무에서 자주 사용되는 유틸리티 타입을 소개한다.

<br/>

## 유틸리티 타입?

이미 정의되어 있는 `타입 구조를 변경하여 재사용`하고 싶을 때 사용하는 타입이다.

타입스크립트 라이브러리에 내장되어 있기 때문에 설정 파일의 `lib` 속성 옵션만 추가하면 쉽게 사용할 수 있다.

> `lib` 속성은 타입스크립트에서 미리 정의해 놓은 타입 선언 파일을 사용할때 쓰는 옵션이다.

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ESNext"], // 최신 자바스크립트 문법을 의미하는 ESNext를 추가
  }
}
```

<br/>

## `Pick<TYPE, KEY>`

기존 타입(대상 타입)에서 `몇 개의 속성을 추출`하여 새로운 타입을 정의할 때 사용한다.

### 문법

Pick을 사용하면 결과적으로 타입별칭을 사용하여 `새로운 타입을 정의`한 것과 같다.

```typescript
type NewType = Pick<대상 타입, "대상 타입의 속성1" | "대상 타입의 속성2" | ...>;
```

> 유틸리티 타입의 화살표 괄호는 제네릭 문법을 의미한다

### 적용

```typescript
interface Profile {
  id: string;
  address: string;
}

type ProfileId = Pick<Profile, "id">;

const userId: ProfileId = {
  id: "ryu",
};
```

여러개 추출도 가능하다.

```typescript
interface Profile {
  id: string;
  name: string;
  address: string;
}

type UserProfile = Pick<Profile, "id" | "name">;

const userProfile: UserProfile = {
  id: "ryu",
  name: "ryu",
};
```

<br/>

## `Omit<TYPE, KEY>`

기존 타입(대상 타입)에서 `몇 개의 속성을 제외`하고 나머지 속성으로 새로운 타입을 정의할 때 사용한다.

### 문법

두번째 제릭 타입으로 제외할 속성 이름을 문자열 타입 또는 문자열 유니온 타입으로 전달한다.

```typescript
type NewType = Omit<대상 타입, "제외할 속성1" | "제외할 속성2" | ...>;
```

### 적용

address 속성을 제외한 나머지 속성으로 새로운 타입을 정의하였다.

```typescript
interface UserProfile {
  id: string;
  name: string;
  address: string;
}

type User = Omit<UserProfile, "address">;

const user: User = {
  id: "ryu",
  name: "ryu",
};
```

### Omit vs Pick 어떤 것을 사용할까?

`Pick`과 `Omit` 타입은 반대의 역할을 한다.

`Pick`은 대상 타입에서 몇 개의 속성을 추출하여 새로운 타입을 정의하고, `Omit`은 대상 타입에서 몇 개의 속성을 제외하고 새로운 타입을 정의한다.

```typescript
interface UserProfile {
  id: string;
  name: string;
  address: string;
}

type User1 = Pick<UserProfile, "id" | "name">;
type User2 = Omit<UserProfile, "address">;
```

위에서 User1과 User2는 동일한 새로운 타입을 생성한다.

컨벤션마다 어떤 유틸리티 타입을 사용할지는 다를 수 있지만, 가급적이면 `코드를 줄이는 방향으로 유틸리티 타입을 정해서 사용`하는 것이 좋다. (Omit을 사용하는 것이 코드를 줄이는 방향에서 유리하다)

<br/>

## `Partial<T>`

기존 타입(대상 타입)의 `모든 속성을 옵셔널로 변경`하여 새로운 타입을 정의할 때 사용한다.

### 문법

객체 형태의 대상 타입만 전달하면 된다.

```typescript
type NewType = Partial<대상 타입>;
```

### 적용

`Partial` 타입은 특정 타입의 속성을 모두 선택적으로 사용할 수 있게 변경한다.

따라서, `데이터를 수정하는 API를 호출`하거나 이미 정해진 데이터 타입을 다른곳에서 `선택적으로 재사용`할 때 유용하다.

#### `Before`

보통 백엔드 개발자와 함께 인터페이스를 설계하는 과정에서 `데이터 수정 API`를 다룰 때, 서버쪽에 변경된 속성만 넘겨 달라고 할 수도 있고, 데이터 전체를 넘겨달라고 할 수도 있다.

API를 호출할때, 다음과 같이 서버에 어떤 값을 넘기느냐에 따라 함수의 파라미터 타입을 정의해 볼 수 있다.

```typescript
interface Todo {
  id: string;
  title: string;
  checked: string;
}

// id 속성만 넘기는 경우
function updateTodo(todo: Pick<Todo, "id">) {
  // ...
}

// id, checked 속성만 넘기는 경우
function updateTodo(todo: Omit<Todo, "title">) {
  // ...
}

// 전체 속성을 넘기는 경우
function updateTodo(todo: Todo) {
  // ...
}
```

#### `After`

이럴때 `Partial` 타입을 사용하면 모든 속성을 선택적으로 사용할 수 있으므로, 위의 세가지 케이스를 모두 만족시킬 수 있다.

```typescript
function updateTodo(todo: Partial<Todo>) {
  // ...
}
```

id, title, checked 속성을 모두 옵션 속성으로 변경되기 때문에, updateTodo 함수의 인자로 다양한 형태의 값을 넘길 수 있다.

```typescript
updateTodo({ id: "1" });
updateTodo({ id: "1", checked: true });
updateTodo({ id: "1", title: "유틸리티 타입 공부", checked: true });
```

<br/>

## `Exclude<TYPE1, TYPE2>`

`유니언 타입`을 구성하는 `특정 타입을 제외`할 때 사용한다.

`Pick`, `Omit`, `Partial` 타입이 객체 타입의 형태를 변형하는 것과 달리, `Exclude`는 유니온 타입을 구성하는 타입을 변형한다.

### 문법

두번째 제네릭 타입으로 제거할 타입 이름을 문자열 타입이나 문자열 유니온 타입으로 전달한다.

```typescript
type NewType = Exclude<대상 유니온 타입, '제거할 타입 이름1' | '제거할 타입 이름2', ...>;
```

### 적용

특정 타입을 제외한 나머지 타입으로 새로운 유니온 타입을 정의하였다.

```typescript
type Categoies = "animal" | "person" | "plant";

type NotAnimal = Exclude<Categoies, "animal">;
```

제외할 타입을 여러개 전달할 수도 있다.

```typescript
type Categoies = "animal" | "person" | "plant";

type NotAnimalOrPlant = Exclude<Categoies, "animal" | "plant">;
```

<br/>

## `Record<KEY, TYPE>`

객체 타입의 `속성을 다른 타입으로 변환`할 때 사용한다.

타입 한개를 속성의 키로, 다른 타입을 속성의 값으로 받아 새로운 타입을 정의한다.

### 문법

첫번째 제네릭 타입으로 속성의 키(key)로 사용할 타입을 전달하고, 두번째 제네릭 타입으로 속성의 값(value)으로 사용할 타입을 전달한다.

첫번째 제네릭 타입에는 string, number, string union type, number union type 등을 사용할 수 있고, 두번째 제네릭 타입에는 어떤 타입이든 사용할 수 있다.

```typescript
type NewType = Record<
  "객체 속성의 키로 사용할 타입",
  "객체 속성의 값으로 사용할 타입"
>;
```

### 활용1

문자열 유니온 타입과 객체 타입을 `Record` 타입의 입력 값으로 전달하여 새로운 타입을 정의해보자.

다음은 `Record` 유틸리티 타입을 사용하여 개발자 직군별로 다른 타입을 지정한 `Developers` 타입을 정의한 예시이다.

```typescript
type DeveloperProfile = {
  skill: string;
  age: number;
};

type WebDeveloper = "frontend" | "backend" | "fullstack";

type Developers = Record<WebDeveloper, DeveloperProfile>;
```

키 값은 모두 첫번째 제네릭 타입으로 받았던 `WebDeveloper` 문자열 유니온 타입이고, 값은 두번째 제네릭 타입으로 받았던 `DeveloperProfile` 타입이다.

<img width='250px' alt='Record 타입이 적용된 Developers 타입 정보' src='https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/73758c2c-ca3b-49f6-bf20-54b0823d65b7'><br/>

따라서, `Developers` 타입을 사용하면 다음과 같은 객체를 선언할 수 있다.

```typescript
const dev: Developers = {
  frontend: { skill: "html, css, javascript", age: 25 },
  backend: { skill: "node, express, mongodb", age: 27 },
  fullstack: { skill: "all", age: 30 },
};
```

### 활용2

`Record` 타입으로 `인덱스 시그니처를 ㅇ정의`할 수도 있다.

```typescript
type PhoneBook = Record<string, string>;

const familyPhoneBook: PhoneBook = {
  mom: "010-0000-0000",
  dad: "010-0000-0000",
};
```

<img width="189" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/46aec8bf-0896-4911-a5d9-1e9fd4a26f69">

<br>

## `ReturnType<TYPE>`

함수를 제네릭 TYPE으로 받아, 반환값의 타입을 반환한다.

### 문법

```typescript
type NewType = ReturnType<
  typeof "함수"
>;
```

### 활용

React hooks의 인터페이스를 컴포넌트에서 받게 될 때 사용되면 편리하다.
나중의 hooks의 인터페이스가 달라져도 사용하는 코드 쪽의 수정을 최소화할 수 있기 때문이다.

```typescript
type UsePersonInfo = ReturnType<typeof usePersonInfo>;

function usePersonInfo() {
  return {
    age: 28,
    name: "Na",
  };
}

const personInfo = usePersonInfo();

fn({ ...personInfo });

function fn(personInfo: UsePersonInfo) {}
```

<br>

## `Readonly<TYPE>`

TYPE의 모든 속성을 읽기 전용(readonly)으로 변경한 새로운 타입을 반환한다.

### 문법

```typescript
type NewType = Readonly<
  typeof "함수"
>;
```

### 활용

한 번 생성된 인스턴스는 함부로 바꿀 수 없게 만들려고 할 때 활용되어진다.

```typescript
class User {
  readonly id: string;
  readonly name: string;
  readonly age: string;
  constructor(dto: UserDTO) {
    this.id = dto.id;
    this.name = dto.name;
    this.age = dto.age;
  }
}
```

<br>

## `Required<TYPE>`

TYPE의 모든 속성을 옵셔널에서 필수(required)로 변경한 새로운 타입을 반환한다.

### 문법

```typescript
type NewType = Required<"타입 및 인터페이스">;
```

### 활용

```typescript
interface User {
  id: number;
  name: string;
  hobby?: string;
}

type RequiredUser = Required<User>;

const user: RequiredUser = {
  // ❌ Error: Property 'hobby' is missing in type '{ id: number; name: string; }' but required in type 'Required<User>'.
  id: 1,
  name: "ryu",
  // hobby property도 명시해야 한다.
};
```

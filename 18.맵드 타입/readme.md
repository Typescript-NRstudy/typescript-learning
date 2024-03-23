# 맵드 타입(Mapped Type)

앞서 살펴본 유틸리티 타입은 모두 내부적으로 맵드 타입을 이용해서 구현되었다.

유틸리티 타입과 맵드 타입을 잘 활용하면 타입스크립트 코드를 더 간결하고 보기 좋게 작성할 수 있다.

<br/>

## 맵드 타입?

이미 정의된 타입을 가지고 새로운 타입을 생성할 때 사용하는 타입문법이다.

마치 자바스크립트의 `map` 함수처럼 기존 타입을 순회하면서 새로운 타입을 생성한다.

### 주의 사항

#### 인덱스 시그니처 문법 안에서 사용하는 in 앞의 타입 이름은 개발자 마음대로 지을 수 있다

- `in` 앞에 오는 타입 변수는 순회할 타입 변수이므로 개발자 마음대로 지을 수 있지만, 최대한 의미를 나타낼 수 있는 이름을 사용하는 것이 좋다.

```typescript
type developers = "na" | "ryu";
type studyAttendance = {
  [dev in developers]: boolean; // in 앞에 dev는 개발자가 다른 의미있는 이름으로 명시할 수 있다.
};
```

#### 맵드 타입의 대상 타입 유형

- 맵드 타입의 대상 타입으로 `문자열`, `문자열 유니온 타입`, `인터페이스`, `타입별칭` 등 여러가지 타입을 변환하여 사용할 수 있다.

- 단, `boolean` 타입은 속성 이름(key)으로 사용할 수 없기 때문에 사용할 수 없으며,  
  key에는 `string`, `number` 그리고 ES6에 새롭게 등장한 다른 값과 중복되지 않는 유일무이의 값 `symbol`이다.

```typescript
type TrueAndFalse = true | false;
type TrueAndFalseMap = {
  [Boolean in TrueAndFalse]: boolean; // ❌ Error: Type 'boolean' is not assignable to type 'string | number | symbol'.
};
```

<br/>

## 맵드 타입 예시

### `in` 연산자 활용

`in` 연산자는 마치 자바스크립트의 `for in` 반복문을 사용하는 것 처럼 대상 타입을 순회하면서 속성 값 타입을 변경한다.

#### 적용

다음은 개발자들의 스터디 출석 여부를 나타내는 타입을 만드는 예시이다.

`developers` 타입을 순회하면서 새로운 타입을 생성한다.

```typescript
type developers = "na" | "ryu";
type studyAttendance = {
  [dev in developers]: boolean; // ✅ 문자열 유니온 타입의 각각의 속성에 대해 boolean 타입을 지정
};
```

결과 타입은 다음과 같다.

```typescript
type studyAttendance = {
  na: boolean;
  ryu: boolean;
};
```

### `keyof` 연산자 활용

`keyof` 연산자는 객체 타입의 모든 속성 키를 유니온 타입으로 가져온다.

문자열 유니온 타입을 이용하여 객체 형태의 타입으로 변환할 때 유용하게 사용할 수 있다.

```typescript
interface Person {
  name: string;
  age: number;
}

type PersonPropCheck = {
  [P in keyof Person]: boolean; // ✅
  // [P in "name" | "age"]: boolean;
};
```

결과 타입은 다음과 같다.

```typescript
type PersonPropCheck = {
  name: boolean;
  age: boolean;
};
```

<br/>

## 매핑 수정자

맵드 타입으로 타입을 변환할 때, 속성의 성질을 바꿀때 사용하는 문법이다.

매핑 수정자에는 `readonly`, `?`, `-` 등이 있다.

### `?` 매핑 수정자

`?` 매핑 수정자는 속성을 옵셔널 속성으로 만든다.

```typescript
type Developer = {
  name: string;
  skill: string;
};

type OptionalDeveloper<T> = {
  [P in keyof T]?: T[P]; // ✅ 제네릭으로 넘겨받은 타입의 속성을 옵셔널 속성으로 만든다
};

const na: OptionalDeveloper<Developer> = {
  name: "na",
};
```

### `-` 매핑 수정자

`-` 매핑 수정자는 속성을 제거한다.

옵션널 속성을 다시 필수 속성으로 만들거나 readonly 속성을 일반 속성으로 변환할 수 있다.

```typescript
type Developer = {
  name?: string;
  skill?: string;
};

type RequiredDeveloper<T> = {
  [P in keyof T]-?: T[P]; // ✅ 제네릭으로 넘겨받은 타입의 속성의 옵션 속성을 제거
};

const ryu: RequiredDeveloper<Developer> = {
  name: "ryu", // ❌ Error: Property 'skill' is missing in type '{ name: string; }' but required in type 'RequiredDeveloper<Developer>'.
};
```

<br/>

## 유틸리티 타입 직접 만들어보기

타입스크립트에서 제공하는 유틸리티 타입을 직접 만들어보자.

### 만들기 전에 앞서서 알아야 할 것들

```typescript
T extends U ? X : Y
```

자바스크립트처럼 타입스크립트도 `?`를 사용하여 조건부 형식으로 타입을 정의할 수 있다.
조건식 결과에 따라 X가 될 수도, Y가 될 수도 있다.

### Partial

```typescript
type myPartial<T> = {
  [P in keyof T]?: T[P];
};
```

### Pick

```typescript
type myPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### Omit

대상 객체의 속성을 순회하며 K가 아닌 속성들만 새로운 타입으로 만들어 반환한다.

```typescript
type myOmit<T, K extends keyof T> = {
  // K는 제외할 속성의 키
  [P in Exclude<keyof T, K>]: T[P];
};
```

### Exclude

```typescript
type myExclude<T, U> = T extends U ? never : T; // U는 T에서 제외할 타입
```

위에 있는 Exclude는 U가 T 안에 있으면 never로 선언하며 그렇지 않으면 그대로 T를 반환한다.  
즉 T에 오는 타입들 중 U에 오는 것들은 제외하겠다는 의미이다.

### Required

```typescript
type myRequired<T> = {
  [P in keyof T]-?: T[P];
};
```

### Record

```typescript
type myRecord<K extends string, T> = {
  [P in K]: T;
};
```

<br/>

## Key Remapping via `as`

TypeScript 4.1 이상에서는 매핑된 타입에 as 절을 사용해서 매핑된 타입의 키를 다시 매핑할 수 있다.

```typescript
type ReMappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
  // 'Capitalize' 은 키 앞글자를 대문자로 바꿔주는 타입이다.
};

interface Person {
  name: string;
  age: number;
  skill: string;
}

type PersonGetter = Getters<Person>;
// type PersonGetter = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
```

조건부 타입을 통해 `never`를 생성해서 키를 필터링할 수 있습니다.

```typescript
// 'income' 프로퍼티를 Exclude로 제거한다
type RemovePrivateField<Type> = {
  [Property in keyof Type as Exclude<Property, "income">]: Type[Property];
};

interface EmployeeInfo {
  name: string;
  age: number;
  income: number;
}

type EmployeePublicInfo = RemovePrivateField<EmployeeInfo>;
// type EmployeePublicInfo = {
//     name: string;
//     age: number;
// }
```

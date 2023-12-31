# 이넘(enum)

자바스크립트에는 이넘이 없지만 타입스크립트에서는 이넘을 지원한다

<br/>

## 이넘?

이넘은 특정 값의 집합을 의미하는 데이터 타입이다 (상수 집합)<br/>
비슷한 성격이나 같은 범주에 있는 상수를 하나로 묶어 더 큰 단위의 상수로 만드는 역할을 한다

```typescript
enum Language {
  Korean,
  English,
  Japanese,
}
```

객체의 속성에 접근하듯이 이넘의 이름에 `.` 접근자를 붙여서 사용한다

```typescript
let lang: Language = Language.Korean; //0
```

<br/>

### 1. 숫자형 이넘

위의 예제에서 lang의 값에 0이 대입되는 이유에 대해 알아보자<br/>
이넘에 선언된 속성은 기본적으로 숫자형 이넘이며, 0부터 시작하여 1씩 증가한다.

```typescript
enum Language {
  Korean, // 0
  English, // 1
  Japanese, // 2
}
```

첫번째 속성의 시작값을 지정하면 순서대로 이넘의 속성값은 1씩 증가한다

```typescript
enum Language {
  Korean = 5, // 5
  English, // 6
  Japanese, // 7
}
```

다만, 실제 코드를 작성할 때는 명시적으로 값을 지정하는 것이 좋다

```typescript
enum Language {
  Korean = 5,
  English = 10,
  Japanese = 15,
}
```

<br/>

### 2. 문자형 이넘

이넘의 속성 값에 문자열을 지정한 이넘을 의미한다<br/>
숫자형 이넘과 달리 모든 속성에 대해 값을 지정해야 하며, 선언된 속성 순서대로 값이 증가하지 않는다<br/>
실무에서는 숫자형 이넘보다는 문자형 이넘으로 관리하는 사례가 더 많다

```typescript
enum Language {
  Korean = "ko",
  English = "en",
  Japanese = "jp",
}
```

속성 이름과 값을 동일한 문자열로 지정하는 것이 관례이다<br/>
대소문자를 구분하지 않으며 언더스코어(\_)를 사용할 수 있지만, 속성 이름에 공백이 포함되면 안된다

```typescript
enum Language {
  Korean = "Korean",
  English = "English",
  Japanese = "Japanese",
}
```

<br/>

## 특징

### 1. 혼합 이넘

숫자형 이넘과 문자형 이넘을 혼합해서 선언할 수 있다 <br/>
다만, 일괄되게 숫자나 문자열 둘중 하나의 데이터 타입으로 관리하는 것이 좋다

```typescript
enum Answer {
  Yes = "Yes",
  No = 0,
}
```

<br/>

### 2. 다양한 이넘 속성값 정의 방식

이넘의 속성 값은 고정 값뿐만 아니라 다양한 형태로 할당할 수 있다<br/>
활용도는 높지 않지만 방법은 알아두자

    1️⃣ 먼저 선언되어 있는 이넘의 속성을 활용할 수 있다
    2️⃣ 계산한 값을 속성 값으로 할당할 수 있다

```typescript
enum Authorization {
  User, // 0
  Admin, // 1
  SuperAdmin = User + Admin, // 1️⃣ a
  God = "abc".length, // 2️⃣ 3
}
```

<br/>

### 3. const 이넘

이넘을 선언할 때 앞에 const를 붙인 이넘을 의미한다<br/>
컴파일시 코드양을 줄여주며, 항상 속성에 고정된 값만 넣어주어야 한다

#### `일반 이넘` 컴파일 결과

일반 이넘은 컴파일될 때 이넘 속성 이름과 값을 연결해주는 객체를 생성한다

<img width="527" alt="스크린샷 2023-12-13 오후 4 31 25" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/4e6f02a2-08e2-49bf-9460-8ce3d6030328">

#### `const 이넘` 컴파일 결과

const 이넘은 컴파일 시점에 객체를 생성하지 않고, 이넘의 속성 이름과 값을 바로 연결해준다

<img width="483" alt="스크린샷 2023-12-13 오후 4 32 21" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/20a4d1f6-286b-4130-a377-634e6e3a9ce9">

<br/>

### 일반 이넘은 되도록이면 지양하자

TypeScript에서 enum을 사용하면 Tree-shaking이 되지 않습니다

```javascript
"use strict";
var logLevel;
(function (logLevel) {
  logLevel["ERROR"] = "ERROR";
  logLevel["WARN"] = "WARN";
  logLevel["INFO"] = "INFO";
  logLevel["DEBUG"] = "DEBUG";
})(logLevel || (logLevel = {}));
```

일반 이넘을 트랜스파일을 하면 위의 코드처럼 즉시 실행 함수가 생성됩니다.JavaScript에 존재하지 않는 것을 구현하기 때문에 TypeScript 컴파일러는 IIFE(즉시 실행 함수)를 포함한 코드를 생성하게 됩니다. 그런데 Rollup과 같은 번들러는 IIFE를 '사용하지 않는 코드'라고 판단할 수 없어서 Tree-shaking(사용하지 않는 코드를 삭제하는 것)이 되지 않습니다.

결국 logLevel을 import하고 실제로는 사용하지 않더라도 최종 번들에는 포함되어 불필요하게 번들링 사이즈가 커지게 됩니다.

[참고 링크](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking)

<br/>

## 퀴즈

### 문자열 이넘 활용

사용자로부터 입력받은 지역명에 해당하는 City 이넘 값을 활용하여, 해당 지역에 대한 소개 메시지를 출력하는 코드를 작성하세요.

```typescript
enum City {
  SEOUL = "서울",
  BUSAN = "부산",
}

let userInput: string = "서울"; // 사용자로부터 도시명을 입력받는다

// 여기에 코드를 작성하세요
switch (userInput) {
  case Center.SEOUL:
    console.log("서울은 현대적이고 다양한 즐길거리가 많은 도시입니다.");
    break;
  case Center.BUSAN:
    console.log("부산은 아름다운 해변과 신선한 해산물이 유명한 도시입니다.");
    break;
  default:
    console.log("해당하는 도시의 여행 정보를 찾을 수 없습니다.");
}

/* 
  예시 입력: "서울"
  출력 결과: "서울은 현대적이고 다양한 즐길거리가 많은 도시입니다."
  
  예시 입력: "부산"
  출력 결과: "부산은 아름다운 해변과 신선한 해산물이 유명한 도시입니다."
  
  예시 입력: "인천"
  출력 결과: "해당하는 도시의 여행 정보를 찾을 수 없습니다."
*/
```

### const 이넘의 장점

`일반 enum` 보다 `const enum` 을 사용하는 이유는 무엇인가?

- 코드 크기 최적화 및 성능 향상
  - const enum을 사용하는 주된 이유는 코드 크기 최적화와 성능 향상을 이루기 위함입니다. 이 방식은 런타임에 별도의 객체를 생성하지 않고 직접 값으로 대체되기 때문에 코드가 더 효율적이고 가벼워집니다.

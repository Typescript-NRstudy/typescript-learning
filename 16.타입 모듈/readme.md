# 타입 모듈(Type Module)

모듈이란 함수나 변수, 클래스 등을 논리적인 단위로 구분하여 필요할 때 가져다 쓸 수 있도록 하는 개념이다. 애플리케이션이 복잡해질수록 모듈화는 필수적이다.

<br/>

## 자바스크립트 모듈

### 모듈화의 필요성

ES6 이전의 자바스크립트는 모듈의 개념이 없었기 때문에, 파일 단위로 변수나 함수가 구분되지 않았다.

따라서 전역 스코프를 가지기 때문에 변수나 함수가 충돌하는 결과를 야기했다. 이러한 문제는 애플리케이션의 규모가 커질수록 더 부각되었다.

```javascript
// a.js
var a = 10;

// b.js
var a = 20;

console.log(a); // 20 : a.js의 a가 덮어씌워짐
```

### 모듈화를 위한 시도

이러한 문제를 해결하기 위해 `Common.js`, `Require.js` 등으로 모듈화를 시도했다.

#### `Common.js`

브라우저 이외의 환경인 서버나 데스크톱에서도 자바스크립트를 활용하기위해 고안된 스펙이다.

`Node.js`가 설치되어 있다면, 별도의 도구나 라이브러리 없이도 다음과 같이 자바스크립트의 모듈화가 가능하다.

```javascript
// math.js

function sum(a, b) {
  return a + b;
}

module.exports = sum;

// app.js
let math = require("./math.js");
console.log(math(1, 2)); // 3
```

#### `Require.js`

AMD(Asynchronous Module Definition) 라는 `비동기 모듈 정의` 스펙을 구현한 라이브러리이다.

> 비동기 모듈 : 모듈을 필요로 하는 시점에 순차적으로 가져오는 방식.

`require.js` 라이브러리를 내려받으면 `require()` 문법으로 외부 라이브러리를 마치 모듈처럼 사용할 수 있다.

```
# install
npm install requirejs
```

```typescript
// 외부 모듈 로드 성공시 콜백함수 실행
require(["https://unpkg.com/vue@3/dist/vue.global.js"], function (Vue) {
  console.log(Vue, "vue is loaded");
});
```

### ES6 모듈화 문법

이러한 모듈화의 시도 끝에 ES6에서는 자바스크립트 자체적으로 모듈화를 지원하기 시작했다.

#### 1️⃣ `export` vs `export default` : 모듈 내보내기

<!-- 리스트를 markdown 테이블로 바꿔줘 -->

| 구분             | 설명                              |
| ---------------- | --------------------------------- |
| `export`         | `여러개`의 변수나 함수를 `모듈화` |
| `export default` | `하나`의 변수나 함수를 `모듈화`   |
| `import`         | 모듈 가져오기                     |

```typescript
// math.js
export function sum(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// formatString.js
export default fuction ellipsis(str) {
  return str + "...";
}

// app.js
import { sum, multiply } from "./math.js";
import ellipsis from "./formatString.js";

```

> 일반적으로 파일의 맨 마지막 줄에 `export`로 내보낼 대상을 정의하는 것이 관례이다. 이는 다른 개발자가 코드를 읽을 때, 내보내는 대상을 쉽게 찾을 수 있도록 하기 위함이다.<br/>
> 내보낼 대상에 `export`를 일일이 붙여주어도 무방지만, 무엇이든 두가지 방식 중 한가지로 인관되게 코드를 작성하는 것이 좋다.

#### 2️⃣ `import as` : 별칭 사용

모듈을 가져올 때, `as` 키워드를 사용하여 가져온 모듈의 이름을 변경할 수 있다.

이름이 충돌하는 경우 별칭을 사용하여 충돌을 피할 수 있다.

```typescript
import { sum as add } from "./math.js"; // 이 파일에서 sum을 add로 사용
console.log(add(1, 2)); // 3
```

> import 구문 안에서 사용한 as와 타입 단언의 as는 다른 문법이다. 사용하는 위치에 따라 역할이 다르므로 주의하자.

#### 3️⃣ `import *` : 모듈 전체를 가져오기

모듈 전체를 가져오기 위해서는 `*`를 사용한다.

`*`와 `별칭`를 사용하여 모듈 전체를 가져오면 `네임스페이스`로 사용할 수 있다. 즉, 모듈의 모든 내용을 가져와서 하나의 객체로 만들어 사용할 수 있다.

```typescript
// math.js
function sum(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

export { sum, multiply };

// app.js
import * as math from "./math.js"; // math 네임스페이스로 가져옴
console.log(math.sum(1, 2)); // 3
console.log(math.multiply(1, 2)); // 2
```

<br/>

## 타입스크립트 모듈

타입스크립트는 자바스크립트의 모듈화 문법을 그대로 사용하면서, 타입을 내보내고 가져올 수 있다.

### 모듈 유효범위(스코프)

타입스크립트 프로젝트 내에서는 어느 파일에서 변수나 타입을 선언하든 전역 변수로 간주하기 때문에 같은 프로젝트 내에서는 이미 선언된 이름을 재사용할 수 없다. (전역 스코프)

```typescript
// utils.ts
type Developer { // ⚠️ Error: Duplicate identifier 'Developer'.
  name: string;
}

// app.ts
var ryu: Developer = {
  name: "Ryu",
};

type Developer { // ⚠️ Error: Duplicate identifier 'Developer'.
  name: string;
  skill: string;
}
```

다만, 전역 스코프로 정의된다 하더라도 `var` 이나 `interface` 등 `재선언이나 병합이 가능한 코드`는 별도로 에러가 발생하지 않는다.

```typescript
// utils.ts
interface Developer {
  name: string;
}

// app.ts
// ✅ utils.ts의 Person 인터페이스와 app.ts의 Developer 인터페이스가 병합되어 name, skill 속성을 모두 정의해야 한다
var ryu: Developer = {
  name: "Ryu",
  skill: "typescript",
};

interface Developer {
  name: string;
  skill: string;
}
```

<br/>

### TS 모듈화 문법

타입스크립트 프로젝트에서 타입 코드를 모듈로 내보내고 불러올때 사용하는 두가지 문법을 알아보자.

#### 1️⃣ `import type`

타입을 가져올 때도 자바스크립트와 동일하게 import 구문을 사용한다.

다만, 타입을 다른 파일에서 가져올 때는 `type` 키워드를 추가로 사용하여 `타입 코드인지 아닌지 명시`할 수 있다.

```typescript
import type { Developer } from "./utils";
```

> `import` vs `import type` 중 어떤 것을 사용할까? <br/>
>
> 규칙을 정하고 일관적으로 작성하면된다.
> 다만 코드의 자동완성을 통해 타입을 가져오는 경우 `import`문에 `type` 키워드가 붙지 않기 때문에,
> 자동완성이 주는 편리함을 따라가고 싶다면 `import`를 사용하는 것이 좋다.
> 코드의 역할을 더 명확하게 하고 싶다면 `import type`을 사용하는 것을 권장한다.

#### 2️⃣ `import inline type`

변수, 함수 등 실제 값으로 사용되는 코드와 타입을 함께 가져올 때 사용하는 문법이다.

한 파일에서 import로 여러 종류의 코드를 가져올 때 `어떤 모듈이 타입인지 명시`할 수 있다.

```typescript
import { type Product, initialValue } from "./Product";
```

<br/>

### 모듈화 전략 : `배럴(Barrel)`

배럴 모듈화 패턴은 `여러 파일을 하나의 통으로 내보내는 기법`이다.

비슷한 타입을 한곳에 모아서 내보내면, 여러 파일을 불러오는 번거로움을 줄이고 가독성을 높일 수 있다.

다음은 3개의 타입을 각각의 파일로 분리하여 배럴 패턴을 적용한 예시이다.

- 파일 3개 모듈을 한곳에 모아주는 `index.ts` 중간파일을 생성한다.

  ```typescript
  // 🗂️ ./types/index.ts
  import  * from "./product";
  import  * from "./user";
  import  * from "./order";

  export { Product, User, Order };
  ```

- `index.ts` 파일을 통해 모듈을 내보내면, 모듈들을 간결하게 불러올 수 있다.

  ```typescript
  // 🗂️ app.ts
  import { Product, Order, User } from "./types";
  ```

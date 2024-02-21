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

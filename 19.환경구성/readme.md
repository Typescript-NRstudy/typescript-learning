# 프로젝트 환경 구성

타입스크립트 프로젝트를 구성하는데 필요한 설정 파일, 선언 파일, 빌드 도구 등을 타입스크립트와 함께 사용하는 방법을 알아보자.

<br/>

## 타입스크립트 설정 파일?

타입스크립트 설정 파일이란, 해당 타입스크립트 프로젝트가 `어떻게 컴파일될지 세부적인 옵션을 정의`하는 파일이다.

타입스크립트 설정 파일은 tsc 컴파일 명령어를 실행할 때 컴파일러가 참조하는 설정 파일이다. 설정 파일은 `tsconfig.json` 파일로 작성하며, 프로젝트 루트 레벨에 위치한다.

tsc 명령어로 하나하나 옵션을 지정할 수도 있지만, 설정 파일을 사용하여 프로젝트 전체에 대한 설정을 한 번에 관리하는 것이 편리하다.

예를 들어, 다음 설정 파일은 타입스크립트 결과물의 문법을 `es5`로 맞추고, 결과물을 `dist` 폴더에 저장한다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "outDir": "dist"
  }
}
```

<br/>

## 타입스크립트 설정 파일 생성

`tsconfig.json` 파일을 생성할 수도 있지만, 명령어를 사용해서 생성하는 것이 편리하다.

```bash
# 타입스크립트 라이브러리를 전역 레벨에 설치
npm install -g typescript

# 타입스크립트 설정 파일 생성
tsc --init
```

```bash
# npx를 사용하여 타입스크립트 라이브러리를 설치하지 않고 설정 파일 생성
npx typescript tsc --init
```

`tsconfig.json` 파일이 생성되면, 해당 파일을 열어 설정을 변경할 수 있다.

<br/>

## 루트 옵션

타입스크립트 설정 파일의 옵션은 크게 루트옵션과 컴파일러 옵션으로 나뉜다. 그중 루트 옵션은 프로젝트 전체에 영향을 미친다. 컴파일할 대상 파일이나 폴더를 지정하는 등 `프로젝트 전반적인 환경 구성`과 관련된 옵션이다.

### 1. `files`

타입스크립트 컴파일 대상 파일의 목록을 의미한다. tsc 명령어를 실행할 때 대상이 되는 파일 목록을 지정할 수 있다.

```json
// tsconfig.json
{
  "files": ["index.ts", "app.ts"]
}
```

위처럼 일일이 파일을 지정하는 것보다, `include` 속성을 이용하여 특정 위치나 파일 패턴으로 컴파일 대상을 지정하는 것이 더 효율적이다. (파일 목록 중 하나라도 맞지 않으면 컴파일 자체가 되지 않는다.)

### 2. `include`

컴파일 대상 파일의 패턴을 지정하는 속성이다.

와일드 카드(\*) 검색 패턴을 함께 사용하여 특정 폴더 위치나 파일 확장자를 기준으로 지정할 수 있다.

> `*` : 디렉터리 구분자를 제외한 모든 파일 이름<br/>`**` : 해당 폴더의 모든 하위 폴더

아래 예시는, src 폴더 내의 모든 파일(하위 폴더의 파일까지 모두)과 utils 폴더 바로 아래에 있는 모든 파일을 컴파일 대상으로 지정한다.

```json
// tsconfig.json
{
  "include": ["src/**/*", "utils/*"]
}
```

`include` 속성 값을 별도로 지정하지 않으면, 프로젝트 내 모든 파일이 컴파일 대상이 된다.

```json
// tsconfig.json
{
  "include": ["**/*"]
}
```

#### 👀 주의사항

`files` 속성을 지정하면, `inlcude` 속성으로 지정한 파일은 무시된다.

```json
// tsconfig.json
{
  "files": ["index.ts", "main.ts"]
  // "include": [], 마치 이 부분이 주석처리된 것처럼 동작한다
}
```

### 3. `exclude`

`include`와 반대되는 속성으로, 컴파일 대상에서 제외할 파일을 지정한다.

```json
// tsconfig.json
{
  "exclude": ["node_modules"]
}
```

#### 👀 주의사항

`include` 속성에 포함된 파일만 배제하기 때문에, `include` 속성에 해당 파일이 포함되어 있지 않다면 `exclude` 속성을 사용해도 무시된다.

```json
// tsconfig.json
{
  "include": ["**/*"],
  "exclude": ["node_modules", "text/**/*"]
}
```

### 4. `extends`

여러 타입스크립트 프로젝트에서 설정 파일을 공통으로 사용하거나 빌드용 타입스크립트 설정을 분리할 때 사용한다.

```json
// base.json : 공통 컴파일러 설정 파일
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "esnext"]
  }
}
```

```json
// tsconfig.json
// extends 속성으로 공통 설정 상속받아 사용
{
  "extends": "./base",
  "compilerOptions": {
    "strict": true
  }
}
```

결과적으로 다음과 같이 정의한 효과를 얻을 수 있다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "esnext"],
    "strict": true
  }
}
```

### 다양한 공통 설정 파일

프레임워크나 라이브러리 별로 흔히 사용하는 타입스크립트 설정 파일이 있다. 이러한 설정 파일을 사용하면, 타입스크립트 프로젝트를 더 편리하게 구성할 수 있다.

- [🔗 tsconfig-bases](https://github.com/tsconfig/bases)

<br/>

## 컴파일러 옵션

컴파일러 옵션은 루트 옵션과 달리 `컴파일러 동작에 영향을 미치는 옵션`이다. 타입스크립트 컴파일러가 코드를 어떻게 해석하고, 어떤 결과물을 생성할지에 대한 옵션을 설정한다.

- 🔗 [Compiler Options](https://www.typescriptlang.org/tsconfig)

실무에서 가장 자주 사용하는 컴파일러 옵션을 살펴보자.

### 1. `target`

타입스크립트 컴파일 결과물이 어떤 자바스크립트 문법으로 변환될지를 지정하는 옵션

- 타입스크립트가 실행되는 환경에 따라 설정

  - `es3`, `es5`, `es6`, `es2015` ~ `es2020`, `esnext`

    ```json
    {
      "compilerOptions": {
        "target": "esnext"
      }
    }
    ```

- [🔗 주요 라이브러리나 프레임워크에서 권장하는 target 속성](https://github.com/tsconfig/bases)

### 2. `lib`

타입스크립트 컴파일러가 코드에서 사용할 수 있는 빌트인 객체 및 라이브러리를 지정하는 옵션

타입스크립트에서 제공하는 타입 정의 파일을 포함하는 라이브러리를 지정한다

- 타입스크립트 프로젝트가 웹 어플리케이션이라면, 화면 조작이 필수로 들어가니 DOM 옵션을 추가
- 서버 사이드 환경에서 실행되는 Node.js 애플리케이션이라면, ESNext 옵션을 추가

  ```json
  {
    "compilerOptions": {
      "lib": ["DOM", "ESNext"]
    }
  }
  ```

### 3. `strict`

타입스크립트의 `타입 체크 수준을 정의`하는 옵션으로, 다음 옵션을 묶어서 제어할 수 있다.

- `strict mode family` : `strict` 관련 속성들은 컴파일 시점에 에러를 미리 잡아낼 수 있게 도와준다(코드의 안정성)

  ```json
  {
    "compilerOptions": {
      // 다음 속성 하나를 활성화하면
      "strict": true,
      // [strict mode family] 다음 속성들이 모두 활성화된다
      "noImplicitAny": true,
      "noImplicitThis": true,
      "strictNullChecks": true,
      "strictBindCallApply": true,
      "strictFunctionTypes": true,
      "strictPropertyInitialization": true,
      "alwaysStrict": true,
      "useUnknownInCatchVariables": true
    }
  }
  ```

### 4. `noImplicitAny`

타입스크립트에서 `any` 타입을 사용하지 않도록 강제하는 옵션

- strict mode family 중 하나

- 옵션을 활성화(true)하면, `any`로 암묵적 추론되는 경우 any 타입을 명시적으로 지정해야 한다

- 프로젝트에 타입스크립트를 점진적으로 적용해야 하는 경우, 옵션을 비활성화(false)하고 `any` 타입 추론을 사용하다가 나중에 옵션을 활성화하여 타입을 구체화할 수 있다

  ```json
  {
    "compilerOptions": {
      "noImplicitAny": true
    }
  }
  ```

### 5. `strictNullChecks`

타입스크립트에서 `null`과 `undefined`를 구분하여 사용하도록 강제하는 옵션

- strict mode family 중 하나
- 옵션을 활성화하면 타입이 좀더 복잡해지지만, 코드의 안정성을 높여 런타임 에러를 줄일 수 있다

  ```json
  {
    "compilerOptions": {
      "strictNullChecks": true
    }
  }
  ```

#### 필요성

타입스크립트에서 null 값에 `typeof`를 사용하면 결과가 `object`로 나오는데, 이는 자바스크립트의 설계상 오류로 인해 발생하는 문제이다. 이러한 문제를 해결하기 위해 `strictNullChecks` 옵션을 활성화하면, `null`과 `undefined`를 구분하여 사용하도록 강제할 수 있다.

```typescript
var submitButton = document.querySelector(".submit-button");

submitButton.addEventListener("click", function () {
  submitButton.remove(); // ⚠️ Error: Object is possibly 'null'
});😎
```

`strictNullChecks` 옵션을 활성화한 경우 위와 같은 코드는 타입 에러가 발생한다. `submitButton`에 `null` 값이 할당될 수 있는데, `remove` 메서드를 호출하고 있기 때문이다.

`submitButton` 에 `Element` 타입이 정상적으로 할당되었는지 확인하고, `remove` 메서드를 호출하도록 코드를 수정해야한다.

타입가드를 활용하여 if문 안의 submitButton이 `Element` 타입으로만 추론되도록 할 수 있다.

```typescript
if (submitButton) {
  submitButton.remove(); // ✅
}
```

또는, `null 아님 보장 연산자(!)`를 사용할 수도 있다. 이 연산자는 변수가 `null` 타입이 아님을 단언하는 역할을 한다.

```typescript
submitButton?.remove(); // ✅
```

### 6. `allowJs`

타입스크립트 컴파일러가 자바스크립트 파일을 컴파일할 수 있도록 허용하는 옵션

- 기본은 꺼져 있지만, `true`로 컴파일 대상에 포함시키면 타입스크립트 파일에서 이미 로직이 작성되어 있는 자바스크립트 파일을 가져올 수 있게 된다

  ```json
  {
    "compilerOptions": {
      "allowJs": true
    }
  }
  ```

  ```javascript
  // math.js
  export function sum(a, b) {
    return a + b;
  }
  ```

  ```typescript
  // index.ts
  import { sum } from "./math"; // ✅ javascript 파일을 모듈로 인식
  console.log(sum(1, 2));
  ```

### 7. `sourceMap`

타입스크립트 컴파일 결과물에 소스맵 파일을 생성하는 옵션

> 소스맵? <br/> : 컴파일된 자바스크립트 코드와 원본 타입스크립트 코드 간의 매핑 정보를 담은 파일

#### 필요성

만약 코드가 간단하다면 소스 맵을 사용하지 않고도 디버깅이 가능하지만, 실제 프로젝트에서는 컴파일 결과를 통해 원본 파일의 코드 위치를 찾기 어려울 수 있다. 소스맵은 컴파일 결과물인 자바스크립트 파일에서 에러가 발생했을 때, 해당 에러가 원본 타입스크립트 파일의 몇 번째 줄에서 발생했는지 확인할 수 있게 도와주기 때문에 소스 맵을 사용하여 디버깅하는 것이 훨씬 편리하다.

`sourceMap`옵션을 켜고 컴파일하면, 다음과 같이 컴파일 결과물과 소스맵 파일이 함께 생성된다.

```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

<img width="292" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/bec18646-2a3b-4fd9-bb54-d7a1ef248316">

브라우저 개발자 도구에서 컴파일된 결과물(.js)이 아니라 컴파일이 되기 전 원본 파일(.ts)에서 코드 위치를 확인할 수 있다.

<img width="342" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/8c9ed062-7af6-47d4-8375-18841367acdd">

### 8. `jsx`

타입스크립트에서 작성된 JSX 코드를 어떻게 변환할지 정의하는 옵션

- `react`, `preserve`, `react-jsx`, `react-jsxdev`, `react-native`

- 옵션 별로 다음 예시 코드를 컴파일한 결과가 다르다

  ```typescript
  function App() {
    return <div>Hello, World!</div>;
  }
  ```

  - `"jsx": "react"`

    JSX 코드를 `React.createElement` 함수 호출로 변환한다

    ```jsx
    // 컴파일 결과
    import React from "react";
    export const App = () => React.createElement("div", null, "Hello, World!");
    ```

  - `"jsx": "preserve"`

    JSX 코드를 그대로 유지하면서, 자바스크립트 최신 문법과 라이브러리만 추가한다

    ```jsx
    // 컴파일 결과
    import React from "react";
    const const App = () => <div>Hello, World!</div>;
    ```

  - `"jsx": "react-native"`

    JSX 코드를 `preserve` 옵션과 유사하게 변환한다

    ```jsx
    // 컴파일 결과
    import React from "react";
    export const App = () => <div>Hello, World!</div>;
    ```

### 9. `baseUrl`

타입스크립트 컴파일러가 모듈을 해석할 때, 기준이 되는 경로를 지정하는 옵션

- 상대경로가 길어지는 경우, `baseUrl`로 모듈 해석 기준 경로를 지정하면 간결하게 모듈을 찾을 수 있다

  ```json
  {
    "compilerOptions": {
      "baseUrl": "./src"
    }
  }
  ```

  ```typescript
  // import { formatDate } from "../../utils/format";
  import { formatDate } from "utils/format"; // ✅
  ```

### 10. `paths`

`baseUrl` 옵션과 함께 사용하여 모듈을 해석할 때, 경로를 별칭으로 지정하는 옵션

- 임포트 구문의 파일 경로를 줄일 수 있다

  - 다음에서 `baseUrl` 속성이 `src` 폴더를 가리키고 있기 때문에, `paths` 속성의 경로는 모두 `src/`로 시작하게 된다

    ```json
    {
      "compilerOptions": {
        "baseUrl": "./src",
        "paths": {
          "@utils/*": ["utils/*"]
        }
      }
    }
    ```

    ```typescript
    // import { formatDate } from "../../utils/format";
    import { formatDate } from "@utils/format"; // ✅
    ```

### 11. `removeComments`

타입스크립트 컴파일 결과물에서 주석을 제거하는 옵션

- `true`로 설정하면, 주석이 제거된 결과물을 생성하여 파일 용량을 줄여준다

  ```json
  {
    "compilerOptions": {
      "removeComments": true
    }
  }
  ```

  ```typescript
  // [AS-IS] 개발자가 입력한 주석입니다
  const name = "ryu";
  ```

  컴파일한 결과는 다음과 같다

  ```javascript
  const name = "ryu";
  ```

<br/>

## 타입 선언 파일

이 파일은 프로젝트에서 자주 사용되는 공통 타입을 정의하는 파일이다. 또한 프로젝트 전반에 걸쳐 사용되는 라이브러리 타입을 정의할 수도 있다.

만약 공통 타입을 분리하고 별도의 파일로 관리하고 싶다면, `d.ts` 확장자로 타입 선언 파일을 정의하면 된다.

프로젝트 루트 레벨에서 정의하면, 해당 타입은 프로젝트 내의 TypeScript 파일에서 자동으로 인식된다.

```typescript
// index.d.ts
interface User {
  id: string;
  name: string;
}
```

```typescript
// index.ts
// ✅ 별도의 파일을 임포트하지 않아도 타입을 사용할 수 있다
const user: User = {
  id: "1111",
  name: "ryu",
};
```

### vs `.ts` 파일 내 타입 정의

프로젝트 공통 타입들을 `별도의 타입스크립트 파일에 정의하여 관리`할 수도 있다.

프로젝트 내 공통 타입만 정의한다고 가정하고 타입 선언 코드만 작성한 파일을 만들어 사용할 수 있다. 그러나 타입 이외의 코드를 작성하는 것을 시스템적으로 방지할 수는 없다. (공통 타입 이외의 코드가 추가될 가능성 있음)

```typescript
// types.ts
export interface User {
  id: string;
  name: string;
}
```

```typescript
// index.ts
import { User } from "./types"; // ✅ 타입을 임포트하여 사용

const user: User = {
  id: "1111",
  name: "ryu",
};
```

타입 코드를 어디에 작성하든 상관없다. 팀 컨벤션에 맞게 타입 코드를 별도의 파일로 분리하여 관리하자.

<br/>

## 외부 라이브러리 사용하기

타입스크립트 프로젝트에서 외부 라이브러리를 사용할 때, 자바스크립트로 작성된 외부 라이브러리의 타입을 정의하는 방법을 알아보자.

### 1️⃣ 외부 라이브러리의 타입 선언 패키지 사용하기

외부 라이브러리의 타입 선언 파일은 [NPM 공식 사이트](https://www.npmjs.com/)에서 패키지를 검색하여 타입선언 파일을 지원하는지 확인하고, `@types/라이브러리 이름` 으로 패키지가 있는지 확인한 후 프로젝트에 설치해서 사용하면 된다.

#### 1) 타입선언 파일을 지원하는지 확인하기

- 사용자들이 특정 라이브러리에 대한 타입을 정의해서 `Definitely Typed`라는 깃허브 저장소에 공유해놓은 경우, 해당 타입 선언 파일을 사용할 수 있다

- [NPM 공식 사이트](https://www.npmjs.com/)에서 라이브러리를 검색하면, 패키지 소개 화면에서 'DT' 아이콘을 확인할 수 있다. 이는 `Definitely Typed` 레포지토리에 해당 라이브러리의 타입 선언 파일이 있음을 의미한다

  <img width="800" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/06c2fd2f-1501-4a13-8ed0-11f1368a5849">

#### 2) 타입선언 패키지가 있는지 확인하기

- 실제로 타입 선언 파일(`@types` 패키지)이 존재하는지 확인하려면, [NPM 공식 사이트](https://www.npmjs.com/)에서 `@types/라이브러리명`을 검색해보면 된다

  <img width="800" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/806558b8-6743-45e0-bd50-bba45d3e8230">

#### 3) 프로젝트에 설치하기

- `@types` 패키지란, `Definitely Typed` 레포지토리에 있는 타입 선언 파일을 패키지화한 것이다

  - `@types` 패키지를 설치하면, 해당 라이브러리의 타입 선언 파일을 사용할 수 있다

    ```bash
    # @types/jquery 패키지 설치
    npm i @types/jquery
    ```

  - 패키지를 정상적으로 설치하면, `package.json` 파일의 `dependencies` 속성에 `@types/jquery` 패키지가 설치되어 있다. 그리고 `node_modules/@types` 폴더에 타입 선언 파일이 설치된다
    s
    <img width="545" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/dbc34262-15cd-46fd-8aa8-634bb852fefe">

### 2️⃣ 외부 라이브러리에 내장된 타입 선언 파일 사용하기

외부 라이브러리에 자체적으로 타입이 정의되어 있는 경우, 별도의 타입 선언 파일을 작성하지 않아도 된다.

axios 라이브러리를 설치하고 `node_modules/axios` 폴더를 확인해보면, `index.d.ts` 타입 선언 파일이 내장되어 있음을 확인할 수 있다. 그렇기 때문에 axios는 별도의 타입 선언 라이브러리를 추가하지 않고도 타입스크립트 프로젝트에서 바로 사용할 수 있다.

<img width="842" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/dbe52b6c-0e70-4063-8047-ed5867e4649d">

#### ✔️ 라이브러리가 타입스크립트 타입 선언을 내장하고 있는지 확인하는 방법

- [NPM 공식 사이트](https://www.npmjs.com/)에서 라이브러리를 검색하면, 패키지 소개 화면에서 'TS' 아이콘을 확인할 수 있다

  - 이는 타입 선언 파일을 같이 제공하고 있음을 의미한다. 해당 로고가 없다면 별도의 타입 선언 파일을 추가해야 한다

    <img width="800" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/d288daad-b12b-4262-8aca-b0a9ddea0990">

### 3️⃣ 외부 라이브러리를 위해 타입 선언 파일 직접 정의하기

DT나 내장 타입 선언 파일이 지원되지 않는 라이브러리의 경우, 직접 타입 선언 파일을 작성하여 사용할 수 있다.

최근에 제작된 라이브러리나 유저가 많은 라이브러리는 대부분 타입스크립트를 잘 지원하는 편이다. 예시를 위해 오래 전에 만들어진 라이브러리인 `datatables`를 살펴보자.

<img width="800" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/af64ce5d-104c-4184-ba87-c77c478109fc">

이 패키지는 제목 우측에 'DT', 'TS' 아이콘이 없으므로 타입 선언 파일을 직접 작성해야 한다.(타입스크립트를 지원하지 않는다)

#### 타입 선언 파일을 직접 작성하는 방법

- 라이브러리의 소스를 모두 확인하고 타입을 정의하는 것이 아니라, 실제로 사용하는 라이브러리의 API나 코드들과 관련된 타입만 정의하면 된다

  ```typescript
  let table = new DataTable("#table", {
    // options
  });
  ```

  위의 코드는 DataTable 타입이 정의되어 있지 않기 때문에 타입 에러가 발생한다

    <img width="441" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/7f13a952-8140-4092-a691-4c788d99df41">

    <br/>

  - 프로젝트 루트 레벨에 `global.d.ts` 파일을 선언하고, DataTable 타입을 정의한다

        ```typescript
        // global.d.ts
        declare class DataTable {
          constructor(Element: string, options: any) {}
        }
        ```

        타입 선언 파일에 클래스 타입으로 타입을 정의했기 때문에, 프로젝트 전체에서 자동으로 해당 타입을 인식해서 에러가 발생하지 않는다

        <img width="621" alt="image" src="https://github.com/Typescript-NRstudy/typescript-learning/assets/135115849/d5fa0ce0-e750-4983-9c2b-2226cb525903">

    <br>

## Webpack

웹팩은 `모듈 번들러`이자 프런트엔드 개발 빌드 도구이다.

### Core Concept

- <b>Entry</b>
- <b>Output</b>
- <b>Loaders</b>
- <b>Plugins</b>
- Mode
- Browser Compatibility

Core Concept은 6가지인데 기본적으로 알아야 할 것은 `Entry`, `Output`, `Loaders`, `Plugins` 이 4가지이다.

### Entry

Entry는 어떤 파일을 입력 파일로 지정할 것인지 설정하는 속성이다.
해당 속성을 통해 진입점 파일을 기술하면 된다.

```typescript
//webpack.config.js
module.exports = {
  entry: "./src/index.js",
};
```

<br>

### Output

Output은 Entry와 반대로 모듈 번들링의 결과물을 내보낼 위치와 파일의 이름을 지정하는 속성이다.  
기본적으로는 `root/dist/main.js` 로 설정된다.

```typescript
//webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js",
  },
};
```

### Loaders

Webpack을 통해 트랜스파일링, 이미지 최적화, css 파일 변환, 주석 제거, 코드 난독화 등 여러가지 일을 하게 되는데,  
이러한 많은 일들을 Webpack이 모두 하게 된다면 Webpack이란 어플리케이션이 너무 무거워지고, 번거로운 업데이트를 자주 하게 될 것이다.
그래서 Webpack은 Loaders라는 프로그램 구조를 제안하고 있다.

#### Loader란?

Loader라는 작은 프로그램을 Webpack에다가 주입하여 몇몇 기능들은 Loader들에게 일을 전가하게함으로써,
Webpack의 부담을 덜어주는 역할을 한다.
이로써 사용자들은 자신의 기호에 맞는 적절한 Webpack을 사용할 수 있게 된다.

```typescript
//webpack.config.js
const path = require("path");

module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: {
      test: /\.js$/,
      use: "babel-loader",
      exclude: /node_modules/,
    },
  },
};
```

### Plugins

Loader가 입력된 파일들을 어떻게 처리할 것인가에 대한 소프트웨어였다면
Plugin은 그렇게 처리된 파일들을 최종적으로 어떻게 처리할 것인가에 대한 소프트웨어이다.
Loader는 Entry에 적용되고 Plugin은 output에 적용되는 소프트웨어라고 생각하면 된다.

```typescript
//webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // 내장 plugin에 접근하는 데 사용

module.exports = {
  module: {
    rules: {
      test: /\.js$/,
      use: "babel-loader",
      exclude: /node_modules/,
    },
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

# ESLint

## ESlint란?

`ESLint`는 EcmaScript(javascript) 와 Lint를 합친 단어이다. 여기서 Lint는 에러가 있는 코드에 표시를 달아놓는 것을 의미한다.

```
린트(lint) 또는 린터(linter)는 소스 코드를 분석하여 프로그램 오류, 버그, 스타일 오류, 의심스러운 구조체에 표시(flag)를 달아놓기 위한 도구들을 가리킨다. 이 용어는 C 언어 소스 코드를 검사하는 유닉스 유틸리티에서 기원한다.
```

즉 ESlint는 자바스크립트 문법에서 에러가 발생하면 표시해주는 도구이다.

<br>

## ESLint 사용 방법

### 설치

```
npm i -D eslint
yarn add -D eslint
```

현재는 v9가 최신 버전이지만, 이 문서에서는 v8 가장 마지막 버전으로 설명하려한다.

```
npm i -D eslint@8.57.0
yarn add -D eslint@8.57.0
```

ESlint는 개발에서만 사용되므로 설치 시 의존성을 devDependencies에 설정한다.  
그러므로 플래그 `-D` 를 붙여서 설치한다.

실행 명령어

```
npm eslint {파일 경로}
yarn eslint {파일 경로}
```

<br>

## Configuration(설정)

설치가 완료되었다고 바로 ESlint가 적용되지 않는다.
ESLint 설정파일을 만들어야한다.

### Configuration 파일 형식

ESLint 설정파일은 `.eslintrc` 로 시작해야한다.  
또한 ESLint는 Javascript, JSON, YAML 등 다양한 형식의 설정 파일을 지원하는데
원하는 포맷에 따라 그에 맞는 파일 확장자를 사용하면 된다.

- .eslintrc.json
- .eslintrc.js
- .eslintrc.yml
- .eslintrc.yaml

### Configuration option

Configuration에는 중요한 키워드가 8지가 있다.

- root
- plugins
- extends
- rules
- env
- parser, parserOptions
- ignorePatterns
- overrides

### root : boolean

ESLint는 현재 Lint 대상의 파일이 위치한 폴더 안에 설정 파일이 있는지 우선 확인해보고  
없으면 상위 폴더를 한 단께 씩 거슬러 올라가면서 설정 파일을 찾게 된다.  
이 때 `root` 옵션이 `true`로 설정되 어 있는 설정 파일을 만나면 더 이상 상위 폴더로 올라가지 않는다.
만약 `root`가 `false`일 시 하위 폴더의 설정 파일을 우선적으로 적용하되 그렇지 않은 설정들은 상위 폴더의 설정 파일의 옵션을 따라간다.

예를 들어, 프로젝트 별 설정 파일에는 `root` 옵션을 `false`로 설정하고, 코드 저장소 최상위 경로에는 `root` 옵션을 `true`로 설정하면 코드 저장소의 공통 설정과 프로젝트 별 특화 설정을 분리해서 관리할 수 있어서 편리하다.

```json
//.eslintrc.json
{
  "root": true
}
```

<br>

### plugins : string[]

ESLint에는 기본으로 제공되는 규칙(rule) 외에도 추가적인 규칙을 사용할 수 있도록 만들어주는 다양한 플러그인(plugin)이 있다.

플러그인의 설정 파일의 `plugins` 옵션을 통해서 설정할 수 있다.

```json
//.eslintrc.json
{
  "plugins": ["prettier", "@typescript-eslint", "react"]
}
```

하지만 plugins에 명시하기 전에 해당 플러그인을 개발 의존성에 미리 설치를 해야 유효하다.

```
npm i prettier
npm i typescript-eslint
npm i eslint-plugin-react
```

eslint-plugin의 패키지 이름은 보통 `eslint-plugin-` 으로 시작된다.

<br>

### extends : string[]

ESLint는 Google, Facebook, Airbnb 등 수많은 세계적인 기업들이 사용하고 있으며,
그 기업들의 설정 파일을 `extends` 옵션을 통하여 그대로 가져와 사용할 수 있다.

```json
//.eslintrc.json
{
  "extends": ["airbnb"]
}
```

이렇게 확장이 가능한 ESLint 설정은 npm 패키지 이름이 `eslint-config-`로 시작하며  
extends 옵션에 명시할 때는 위와 같이 앞 부분을 생략해도 무방하다.

뿐만 아니라 ESLint 플러그인에서 제공하는 추천 설정도 `extends`에서 설정할 수 있다.

```json
//.eslintrc.json
{
  "plugins": ["react"],
  "extends": ["plugin:react/recommended"]
}
```

<br>

### rules : Record<string, string | number>

설정 파일에서 rules 옵션은 규칙 하나 하나를 세세하게 제어하기 위해서 사용된다.  
일반적으로는 extends 옵션을 통해서 설정된 규칙을 덮어쓰고 싶을 때 유용하게 쓸 수 있다.

```json
// .eslintrc.json
{
  "extends": ["airbnb"],
  "rules": {
    "no-console": "error"
  }
}
```

이렇게 ESLint는 rules 옵션으로 명시된 규칙을 extends 옵션을 통해서 가져온 규칙보다 우선 시 해준다.

또한 rules안에 있는 규칙들의 값들은 다음과 같은 값을 가질 수 있다.

- "off" 또는 0: 규칙을 사용하지 않음
- "warn" 또는 1: 규칙을 경고로 사용
- "error" 또는 2: 규칙을 오류로 사용

<br>

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-empty-function": "off", // 0
    "@typescript-eslint/no-explicit-any": "warn", // 1
    "@typescript-eslint/no-floating-promises": "error" // 2
  }
}
```

<br>

### env : Record<string, boolean>

자바스크립트는 다양한 환경에서 실행될 수 있는데 각 환경마다 전역(global) 변수를 통해 접근이 가능한 고유한 객체들이 있다.  
대표적인 예로, 브라우저 환경에서는 전역에서 접근이 가능하지만 NodeJS 환경에서는 불가능한 windows 객체를 들 수가 있다.

ESLint는 기본적으로 미리 선언하지 않고 접근하는 변수에 대해서는 오류를 내기 때문에 이렇게 각 실행 환경(runtime)에서 기본적으로 제공되는 전역 객체에 대해서 설정을 통해 알려줘야 하는데, 이러한 역할을 env 옵션이 담당한다.

예를 들어, ESLint로 린트(lint)를 할 자바스크립트 코드가 브라우저에서 실행될 수도 있고, NodeJS에서도 실행될 수 있다면, 두 가지 실행 환경에서 접근 가능한 모든 전역 객체를 다음과 같이 등록해줄 수 있다.

```json
// .eslintrc.json
{
  "env": {
    "node": true,
    "browser": true
  }
}
```

<br>

### parser, parserOptions

개발자가 작성하는 자바스크립트 코드는 실제로 브라우저와 같은 실행 환경에서 실제로 돌아가는 코드와 다른 경우가 많다. 그 이유는 타입스크립트, react의 JSX와 같은 확장 문법이나 babel과 같은 트랜스파일러가 최신 문법을 구형 문법으로 변환하는 경우를 들 수 있다.

ESLint는 기본적으로 <b>순수한 자바스크립트 코드</b>만 이해할 수 있기 때문에 자바스크립트의 확장 문법이나 최신 문법으로 작성한 코드를 린트(lint)하기 위해서는 그에 상응하는 파서(parser)를 사용하도록 설정해줘야 한다.

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["tsconfig.json"],
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018
  }
}
```

<br>

### ignorePatterns : string[]

ESLint는 린트(lint)를 수행할 때 기본적으로 node_modules 폴더나 .로 시작하는 설정 파일은 무시한다.
그러나 그 밖에 다른 파일을 무시하고 싶다면 설정 파일의 ignorePatterns 옵션을 사용할 수 있습니다.

```json
// .eslintrc.json
{
  "ignorePatterns": ["build", "dist", "public", "resource", "jest.config.js"]
}
```

혹은 .gitignore처럼 `.eslintignore` 파일을 만들어 그 안에 명시할 수 있다.

```
// .eslintignore

build
dist
public
resource/*a
__tests__/**/*.{js,ts}
```

<br>

### overrides : Record<string, string | string[]>[]

프로젝트 내에서 일부 파일에 대해서만 다른 설정을 적용해줘야 할 때는 `overrides` 옵션을 사용한다.

예를 들어, 프로젝트에 자바스크립트 파일과 타입스크립트 파일이 함께 들어있다면 자바스크립트 파일을 기준으로 기본 설정을 하고, 타입스크립트 파일을 위한 설정은 overrides 옵션에 명시할 수 있다. 타입스크립트 확장자를 가진 파일에 대해서는 타입스크립트 용 파서와 플러그인과 추천 설정을 사용하도록 세팅해주고 있습니다.

```json
// .eslintrc.json
{
  "overrides": [
    {
      "files": "**/*.+(ts|tsx)",
      "parser": "@typescript-eslint/parser",
      "plugins": ["@typescript-eslint"],
      "extends": ["plugin:@typescript-eslint/recommended"]
    }
  ]
}
```

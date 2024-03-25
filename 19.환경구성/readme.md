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

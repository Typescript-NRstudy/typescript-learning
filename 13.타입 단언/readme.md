# 타입 단언

타입스크립트의 `타입 추론` 에 기대지 않고 개발자가 직접 타입을 명시하여 해당 타입으로 강제하는 것을 의미한다. 주로 어떤 타입에 대해 타입스크립트의 타입 추론보다 개발자가 확실히 잘 아는 상황일 때 사용한다.

<br/>

## 사용 용법

타입 단언은 `as` 라는 키워드를 사용하며 as 뒤에는 변수나 함수 호출 결과 값에 대해 확실하다고 생각하는 타입을 명시한다.

```typescript
const PI = 3.14 as number;
const result = getPI() as number;
```

<br>

여러 개를 중첩하여 사용할 수 있으며 뒤에 있는 단언은 앞에서 단언한 타입의 하위 집합(subset)이여야 한다.

```typescript
const PI = 3.14 as any as number; // number의 하위 집합이 any이므로 ok!
const e = 2.718 as number as string; // string의 하위 집합에는 number가 아니므로 no!
```

<br>

## 타입 단언을 남용해서는 안 된다.

타입 단언은 어디까지나 타입스크립트의 추론 기능보다 더 명확히 알고 있을때만 사용해야 한다. 타입 단언은 개발자가 타입을 보장하고 책임져야하는 기능이다. 물론 호환이 되지 않은 타입(앞에 나와있는 중첩 예시)에 대해서는 컴파일 에러를 띄우지만 그 밖에 케이스에 대해서는 런타임 에러를 띄우게 된다. 그래서 잘못 명시했을 경우에는 컴파일 시점에서 에러를 잡을 수 없으며 런타임 시점에서 애플리케이션이 죽어버리는 불상사가 일어날 수 있다.

<br>

## 타입 단언이 필요한 케이스

1. HTML 요소에 접근할 때

```typescript
const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

위 코드는 create-react-app으로 typescript react-app 을 만들면 index.js 파일에 자동으로 생성하는 코드이다.
`getElementById` 메소드의 반환타입을 타입 단언을 사용하여 HTMLDivElement 타입으로 명시했다.
그 이유는 `getElementById` 메소드 반환타입은 HTMLElement | null 이다.

하지만 여기서 ID가 root인 요소는 index.html에 자동적으로 삽입이 되어있다.
그러므로 타입스크립트의 타입 추론보다 개발자가 자세히 아는 경우이다.
물론 ID가 root인 html 요소가 없거나 동적으로 생기는 경우면은 타입 단언을 쓰는 것은 위험하다.
그렇지만 create-react-app로 만든 react-app은 root html 요소를 자동적으로 삽입하기 때문에 타입 단언을 쓰는 것이 무관하다.

<br>

2. stringify된 JSON 값을 파싱할 때

```typescript
const deserialize = <T>(data: string): T => JSON.parse(data) as T;

const ryu = deserialize<Person>(
  '{"name":"Ryu Jae kyung", "age":29, "characteristic": "diligence"}'
);
```

javascript JSON 메소드인 parse의 반환타입은 기본적으로 any이다.
즉 JSON 파일을 파싱해서 나온 데이터 타입은 타입스크립트는 모르며, JSON 파일을 만든 개발자만이 알고 있다.
그래서 타입 단언으로 명시하는 것이다.

## null 아님 보장 연산자: !

null 아님 보장 연산자(non null assertion)는 null 타입을 개발자가 보장해주는 연산자이다.
어떤 property를 읽을 때 그 property가 null이 아님을 타입스크립트에게 알려준다.

```typescript
const response = axios.get("/getItems");
const items = response.data!.items; // axios data property 명세서에는 items 속성이 없지만 개발자가 api response.data에 items 라는 property를 받을것이라는 것을 알고 있기에 !를 사용하여 타입스크립트의 "'response.data.items'은(는) 'undefined'일 수 있습니다" 라는 에러가 나오지 않는다.
```

### null 아님 보장 연산자에 대한 내 생각

null 아님 보장 연산자는 http 규약, javascript ECMAscript에서 명시되어 있는 것이 아닌 서버에서 받은 것이나 자신이 직접 만든 타입에 대해서 사용하는 것은 권장하지 않는다.

개발하는 것에서부터 실제 상용 애플리케이션에 동작을 하여 수많은 사용자가 사용하기까지에는 다양하고 수많은 문제들이 일어난다. 사용자의 네트워크 문제로 인해 서버에서 데이터를 받지 못하거나, 서버에서 잘못된 시스템 설계로 http 500 에러를 일으키거나, 본인의 설계 미스로 인해 null값이 아니라고 생각한 곳에서도 null, undefined가 발생할 수 있다.

실제로 개발 도중에서 자주 보이는 에러는 `Cannot read properties of null`, `Uncaught TypeError : is not function` 와 같이 데이터를 제대로 읽지 못해서 발생하는 에러가 많을 것이다.

그래서 언제나 자신이 설계한 데이터는 null, undefined가 와도 시스템이 정상적으로 동작을 하게 만들어야 한다.

그러므로 null 아님 보장 연산자를 쓰는 것보다는 `Optional chaining(?)` 연산자와, `Nullish coalescing operator(??)` 연산자를 같이 쓰는 것을 권장한다.

```typescript
const response = axios.get("/getItems");
const items = response.data?.items ?? { items: [] };
```

이런 식으로 data라는 객체 안에 items라는 속성이 있으면 그 속성을 읽고 없으면은 default값으로 { items : [] }; 를 반환하게 해준다. 이러면 네트워크 문제나 서버 시스템 설계 미스가 일어나도 애플리케이션이 죽지 않으며 사용자는 문제가 일어났다는 것을 모르게 된다.

또한 앞의 예시보다도 더 훌륭한 코드는 axios의 제네릭 타입을 이용하여 서버에서 주는 데이터 타입을 명시하고 http error는 `react-query` 등 라이브러리를 통해 예외 처리를 해주는 것이 낫다. 즉 타입 단언이 아닌 axios 라이브러리에서 제공해주는 타입을 사용하는 것이 낫다는 것이다.

```typescript
function getItems() {
  const response = axios.get<{ items: Item[] }>("/getItems");
  return response.data.items;
}

// react-query v5
function useGetItems() {
  return useQuery<Item, AxiosError, void>({
    queryKey: "getItems",
    queryFn: () => getItems(),
  });
  // react-query에서도 제네릭 타입을 이용하여 request, response, error 타입을 명시할수도 있다.
}
```

eslint에도 null 아님 보장 연산자를 쓰면 에러를 일으키는 규칙이 있다. [@typescript-eslint/no-non-null-assertion](https://typescript-eslint.io/rules/no-non-null-assertion)

이 규칙을 사용하여 null값이 와도 정상적으로 서비스를 보장해주는 애플리케이션을 만드는 것이 개발자에게도 사용자에게도 이로운 일이다.

<br>
<br>

13장 참고 내용

- [쓰지말라는 Type Assertions(타입 단언) 은 왜 있나?](https://velog.io/@kmh060020/%EC%93%B0%EC%A7%80%EB%A7%90%EB%9D%BC%EB%8A%94-Type-Assertions%ED%83%80%EC%9E%85-%EB%8B%A8%EC%96%B8-%EC%9D%80-%EC%99%9C-%EC%9E%88%EB%82%98)

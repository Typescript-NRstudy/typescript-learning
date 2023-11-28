# 유니온 타입 (Union type)

### - 정의

유니온 타입은 TypeScript에서 <b>합집합</b> (A ∪ B)을 의미한다.

    type Some = A | B;

위 코드가 갖는 의미는 다음과 같다.

<b>A 또는 B에 있는 모든 요소를 ​​포함합니다.</b>

### - 예시

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/5ccf8145-4004-4284-9b4a-5efe8f7f07c2' width='688px' height='255px' />

<br>
string과 number의 집합은 다음과 같은데
string | number는 string과 number의 <b>합집합</b>이니 아래의 사진과 같다.

<br>

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/a9d5de6e-15b2-4d9a-8589-b050a73d5db2' width='688px' height='255px' />

<br>
  
```
const a : string | number = '12';
```

그래서 다음 코드는 맞는 타입이다.  
'12'라는 문자열은 string 집합에 포함되고 string 집합에 포함되어 있는 요소는 string과 number 합집합에 포함되기 때문이다.

<br>
<br>

# 인터섹션 타입 (InterSection type)

### - 정의

유니온 타입은 TypeScript에서 <b>교집합</b> (A ∩ B)을 의미한다.

    type Some = A & B;

<b> A와 B에 모두 존재하는 모든 요소를 포함합니다.</b>

### - 예시

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/a3e692e9-f032-487c-b828-12877e50b9e7' width='688px' height='255px' />

<br>
{a: number}와 {b: number}의 집합은 다음과 같은데
string | number는 string과 number의 <b>합집합</b>이니 아래의 사진과 같다.

<br>

<img src='https://github.com/Typescript-NRstudy/typescript-learning/assets/53801395/7ac90288-1ddd-461d-8882-86b4e7d1d5a3' width='688px' height='255px' />

<br>

```
const a : {a: number} & {b: number} = {a: 2, b: 5};
```

<br>

그래서 다음 코드는 맞는 타입이다.  
{a: 2, b: 5}라는 객체는 {a: number} 집합과 {b: number} 집합이 갖고있는 모든 요소를 포함하기 때문이다.

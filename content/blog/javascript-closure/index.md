---
title: Javascript 톺아보기 5.클로저
date: "2021-09-02T22:17:15.408Z"
description: "클로저는 무슨 뜻이고 어떤 원리로 동작하는지 알아보자"
---

클로저는 대부분의 개발자가 처음 접했을때는 굉장히 생소하고 낯설어서 주저하게 되는 개념이다. 하지만, 막상 알고보면 개념 자체는 간단하고,
그 구현원리 또한 자바스크립트의 실행 컨텍스트에 대해서 이해하고 있다면 쉽게 이해할 수 있다.

## 클로저란

클로저란 무엇일까? 클로저는 자바스크립트만의 개념은 아니고 함수를 일급객체로 사용하는 모든 언어에서 사용되는 특성이다.
클로저의 정의는 언어마다, 그리고 그것을 설명하는 사람마다 조금씩 다르게 말하는 경향이 있다.

MDN에서는 클로저의 정의를 아래와 같이 말한다.

> A closure is the combination of a function and environment within which that function was declared

유명한 함수형 언어인 Haskell에서는 클로저를 다음과 같이 설명한다.

> A closure, the opposite of a combinator, is a function that makes use of free variables in its definition. It 'closes' around some portion of its environment.

각자 표현하는 방식은 다르지만 공통적으로 나오는 키워드는 `function`이다. 그리고 `declared` 또는 `definition`이라는 키워드도 보이는데 선언, 정의 등의 유사한 단어를 사용하는 것을 볼 수 있다.

모두의 공통된 이해를 위해서는 문서상에서 정의한 공식 정의를 따라야겠지만, 필자 나름대로 이해를 가장 쉽게 할 수 있는 설명은 "클로저는 자신이 생성될 때의 환경을 기억하고, 그를 사용하는 함수이다" 라고 말할 것 같다.
실제 예시를 통해서 살펴보자.

```javascript
function makeAddNumFunc(num) {
  const toAdd = num

  return function (num) {
    return num + toAdd
  }
}

const add5 = makeAddNumFunc(5)

add5(3) // 8
add5(8) // 13
add5(15) // 20
```

위 예시에서 makeAddNumFunc가 리턴하는 익명함수는 본인이 정의될 때의 환경인 makeAddNumFunc의 Lexical Environment를 기억하고 있다. 따라서, toAdd에 할당된 값을 기억하고 익명함수가 호출 될 때마다
인자로 받은 숫자와 toAdd에 할당되어있던 숫자를 더해서 리턴한다.

위 상황에서 add5는 자신이 생성될 때의 환경을 기억하는 함수라고 할 수 있다. 이러한 함수를 바로 클로저라고 부른다.

저렇게 생성된 함수가 기억하는 환경에서 사용하는 변수들을 `free variables`라고 부른다. 그래서 Haskell에서는 function that makes use of free variables in its definition 이라고 설명하는 것이다.

클로저(Closure)란 단어의 사전적 정의를 찾아보면 "폐쇄" 라는 뜻을 가지고 있다.
클로저는 자신이 생성될 때의 환경을 기억하고 있다. 그리고 그 생성될 때의 환경이라는 것은 곧 클로저 생성한 함수의 환경이다.

클로저의 정의에 사용하는 폐쇄, 닫혀있다라는 것은 수학에서 사용하는 개념을 차용했는데, 수학에서 닫혀있다는 집합의 특정 연산 결과가 그 집합 안에 속해있을 때 닫혀있다고 말한다.
예를 들어 자연수라는 집합에서 `+` 연산은 닫혀있다. 자연수끼리의 덧셈 결과는 어떤 자연수끼리 더해도 자연수가 나온다.
`3 + 2 = 5` 하지만, 자연수 집합에서 `/` 연산은 자연수에 대해서 닫혀있지 않다. (`3 / 2 = 1.5`) 이렇게 특정 연산의 결과가 집합에 속해있을 때 닫혀있다라는 표현을 쓴다.

위의 예시에서 보면 리턴된 익명함수는 toAdd를 사용하고 있지만 toAdd는 익명함수 내부에 속박되어있지 않고 외부에 있다. 이런 변수를 자유변수라고 한다.
익명함수에서 toAdd라는 변수에 접근하려고 하면 makeAddNumFunc가 호출될 때의 환경에서 정의된 toAdd에만 접근할 수 있다. 스코프 체인은 제일 가까운 스코프부터 상위로 올라가므로
이미 제일 가까운 환경에서 toAdd라는 변수를 찾았으므로 그 외의 스코프로는 접근을 할 수 없다. 이러한 상황에서 익명함수의 toAdd를 찾기 위한 연산은 생성될 때의 환경에 닫혀있다. 라고 표현할 수 있다.
이런 동작으로 인해 클로저라는 이름으로 부르게 되었다.

## 클로저의 원리

그렇다면 클로저는 어떤 원리로 동작하게 되는 것일까?
클로저는 본인이 생성될 때의 환경을 기억한다. 그리고 본인이 호출될 때 그 환경에 있는 변수들을 참조할 수 있게된다.

환경이라고 계속 말하고 있는 것을 좀 더 명확하게 설명하자면 이 환경은 Lexical Environment를 의미한다.
Lexical Environment는 실행 컨텍스트의 구성요소 중 하나로서, 식별자와 식별자에 바인딩 된 값, 상위 스코프에 대한 참조를 기록하는 객체이다.

따라서 클로저가 기억하는 것은 자신이 생성될 때의 Lexical Environment인 것이다.
그런데, 여기서 의문이 생길 수 있다. 실행 컨텍스트는 전역코드, 모듈, eval, 그리고 함수가 호출 될 때 생성되고 개발자가 보통 자주 실행 컨텍스트를 만드는 상황은 함수를 호출하는 상황이다.
그리고 함수의 실행 컨텍스트는 함수가 호출 될 때 콜스택에 쌓였다가 함수의 실행이 종료되면 콜스택에서 제거된다. 그런데 어떤 원리로 클로저는 이미 콜스택에서 없어진 Lexical Environment를 기억할 수 있는 것일까?

그 해답은, Lexical Environment는 실행 컨텍스트의 구성요소 중 하나지만, 엄밀히 말하면 실행 컨텍스트와는 별개의 존재이다. Lexical Environment는 객체일 뿐이고, 실행 컨텍스트에서 해당 객체에 대한 참조를 가지고 있는 것 뿐이다.
그렇다면 참조카운트가 0이 되면 Garbage Collecting 대상이 되어서 메모리에서 사라지는 자바스크립트의 특징 상 실행컨텍스트가 제거되면 참조카운트가 0이 되면서 Lexical Environment도 메모리에서 없어져야 정상이겠지만,
실행컨텍스트가 제거되더라도 그 함수에서 리턴한 클로저가 해당 Lexical Environment를 참조하고 있다면 Lexical Environment는 GC 대상이 되지 않는다.

이런 원리에서 클로저가 생성될 때의 Lexical Environment를 기억할 수 있는 것이고, 이미 제거된 실행 컨텍스트의 Lexical Environment는 클로저말고는 접근할 수 있는 방법이 없으므로 정보의 은닉이라는 장점 또한 얻게된다.

그런데, 여기서 또 다른 의문이 생길수도 있다. 클로저는 함수이다. 그리고 함수의 실행 컨텍스트는 함수가 호출될 때 생성된다. 그런데 어떻게 클로저는 본인의 실행 컨텍스트가 생성되기도 전인 본인이 정의된 Lexical Environment를 기억하는 것일까?
이는 Javascript가 함수를 생성하는 방식과 함수의 실행컨텍스트에서 outerEnvironmentRecordReference를 결정하는 방식에 연관되어 있다.

Javascript에서 함수는 사실 객체이다. 함수를 생성하는 것은 결국 함수 형태의 객체를 만드는 것이다. Javascript 엔진은 함수 객체를 만들 때 함수 객체의 `[[Environment]]` 내부 슬롯에 현재 실행중인 실행 컨텍스트의 LexicalEnvironment를 할당한다.
여기서 말하는 내부슬롯, 내부메서드는 ECMA-script 명세에서 이 명세에 따르는 자바스크립트를 구동하는 엔진이 구현해야 하는 동작들을 추상화시켜서 설명하는 일종의 Pseudo Code이다.

그러면 함수 객체는 본인의 내부 슬롯에 생성될 때의 Lexical Environment를 기억하고 있게 된다. 그리고 함수가 호출되어서 실행 컨텍스트가 생성될 때 스코프 체인을 결정짓는 outerEnvironmentRecordReference에 이 함수객체의 `[[Environment]]`가 참조하고 있는 객체를 할당한다.
이러한 동작으로 인해 함수가 호출될 때의 Lexical Environment를 기억할 수 있게 되고, 클로저의 동작이 성립하게 되는 것이다.

## 클로저의 활용 예시

- 상태 기억

```javascript
const pureGetFactorial = (n, currentValue = 1) => {
  if (n === 1) {
    return currentValue
  }

  return pureGetFactorial(n - 1, currentValue * n)
}

pureGetFactorial(110)
pureGetFactorial(110)

const memoGetFactorial = (() => {
  const memo = {}

  return n => {
    if (memo[n]) return memo[n]

    memo[n] = pureGetFactorial(n)
    return memo[n]
  }
})()

memoGetFactorial(110)
memoGetFactorial(110)
```

- 상태 은닉

```jsx
const makeCounter = () => {
  let count = 1

  return {
    up: () => ++count,
    down: () => --count,
  }
}

const counter = makeCounter()

counter.up() // 2
counter.up() // 3
counter.down() // 2
```

- 상태 공유

```javascript
const makeStudent = (function makeClass(classTeacherName) {
  return function (name) {
    return {
      name: name,
      getTeacherName: () => classTeacherName,
      setTeacherName: name => {
        classTeacherName = name
      },
    }
  }
})("연욱")

const 철수 = makeStudent("철수")
const 영희 = makeStudent("영희")
철수.getTeacherName() // 연욱
영희.getTeacherName() // 연욱

영희.setTeacherName("김봉두")
철수.getTeacherName() // 김봉두
```

---
title: Javascript 톺아보기 3.this
date: "2021-08-19T21:32:30.818Z"
description: "Javascript의 this는 왜 그렇게 설계되어서 우리를 혼란스럽게 하는지, 그리고 어떤 규칙으로 인해 정해지는지 알아보자"
---

javascript코드를 읽으면서 this라는 단어를 마주쳤을 때 반가움을 느끼는 사람은 많지 않을 것이다.

Javascript에서 this는 여타 다른 객체지향 언어들의 this와는 다르게 동작하며 런타임에서 동적으로 정해지기 때문이다.
그래서 코드에서 this를 마주치면 런타임에서 어떤 값이 할당될지에 대해서 계속 고민을 유발하기 때문에 반가운 존재는 아니다.

그럼에도 불구하고, 우리는 코드를 잘 읽고 이해할 수 있는 능력을 갖추기위해서, 코드의 동작을 예측하기 위해서 이 this가 어떻게 정해지는지 알아야한다.
그리고 근본적으로 Javascript의 this는 왜 다른언어들과는 다르게 동작하는지에 대해 고민해봐야 한다.

## 왜 this는 그모양일까?

> 이 섹션은 필자 개인의 생각이 담겨져 있으며, 기본적인 프로그래밍 지식을 가졌다는 전제하에 작성되었습니다.
> 만약 this가 어떻게 동작하는지에 대해서만 궁금하다면 [this는 어떻게 정해질까?](#this는-어떻게-정해질까?)로 넘어가도 무방합니다.

### Class 기반 언어에서의 this

일반적으로 프로그래밍 언어에서 this 또는 self 키워드로 표현되는 객체는 메서드를 호출한 주체를 의미한다.

this를 이해하기 위해서는 일반 함수와 메서드의 차이점을 명확히 인식해야 한다.

일반함수는 독립적으로 존재하는 함수이며, 메서드는 특정한 객체에 종속되어서 그 객체의 속성에 연관된 동작을 하는 함수이다.
여기서 메서드가 변화시키거나 참조하는 특정한 객체를 지칭하는 키워드가 바로 this 인 것이다.

Class 기반 객체지향언어들에서 this는 Class를 통해서 만들어진 instance를 의미한다. 또한, 일반함수와 메서드를 명확히 구분짓고 있다.

대표적인 객체지향 언어인 Java에서는 this가 어떻게 정해지는지 알아보자.

객체지향 언어인 Java에서는 프로그램의 모든 동작은 객체간의 소통으로 이루어진다.
그렇기에 Java에서 모든 함수는 메서드이다.

Java는 일단 프로그램을 만들려면 Class를 정의하고 그 Class를 통해서 instance를 만들어야 한다.
따라서 Java에서 정의하는 모든 함수는 곧 어떤 객체의 메서드이다 라는 것이다.

이런 제약조건이 있는 상황에서는 this의 결정이 간단해진다.

```java
public class Student {

  private int studentID;
  private String studentName;

  public void setStudentName(String studentName) {
    this.studentName = studentName; // Student Class를 통해서 만들어질 instance를 this 키워드로 참조
  }

  public static void main(String[ ] args) {
    Student foo = new Student();
    foo.setStudentName("yeonuk"); // this => foo

    System.out.println(foo.studentName); // "yeonuk"
  }
}
```

Java에서 this는 Class를 통해서 만들어진 instance이다.
위 코드를 보면 Student라는 Class를 통해서 foo라는 instance를 생성했으며 foo의 메서드로서 호출되는 setStudentName 메서드는 this로 foo를 참조하고 있으므로 결국
`foo.name = "yeonuk"`과 동일한 동작을 수행한다.

즉 Java에서 this는 Class를 통해서 생성한 instance 객체이다.

그렇다면 객체지향 스타일만을 허용하는 Java 말고 조금 더 많은 프로그래밍 패러다임을 허용하는 Python은 어떻게 동작하는지 알아보자.

Python에서도 객체는 Class를 통해서만 만들 수 있다. 그렇기에 객체가 어떤 메서드를 가질지가 명확하다.

그리고, Python은 Java와는 다르게 모든게 객체지향 스타일만을 허용하는게 아니라 다양한 스타일을 허용하기에
객체에 속해있는 함수인 메서드뿐만 아니라, 일반 함수도 존재할 수 있다.

하지만, 파이썬에서 일반 함수와 메서드는 명확히 구분되어 있다.

만약 일반 함수를 객체의 메서드로서 동작하게 하려면 명확히 해당 함수가 어떤 객체를 바라볼지를 지정해줘야 한다.

```Python
class Person:
  def __init__(self,name):
    self.name = name;

yeonuk = Person("yeonuk");

def hello(self):
  print(self.name)

import types

yeonuk.hello = types.MethodType(hello,yeonuk,Person) # (1)
yeonuk.hello(); # "yeonuk"

yeonuk.hello2 = hello.__get__(yeonuk) #(2)
yeonuk.hello2(); # "yeonuk"

yeonuk.hello = hello #(3)
# yeonuk.hello() #TypeError: hello() takes exactly 1 arguments (0 given) on line 11 in main.py
```

Python에서는 호출주체인 객체를 this가 아닌 self라는 키워드로 표시하며, 메서드의 첫번째 인자로(통상 self로 표현) 전달하는 방식으로 처리한다.

권장되지 않는 방식이지만 이미 Class를 통해서 생성된 객체에 메서드를 추가하고자 한다면, 단순히 이미 만들어져있는 함수를
객체의 속성에 추가하는 것만으로는 정상적으로 동작하지 않는다.

`(3)`의 예시가 정상적으로 동작 안하는 예시이다. `(3)`을 보면 일반함수가 객체의 속성으로 할당은 되지만, 그 함수를 호출하면 첫번째 인자인 self가 전달되지 않았다고 에러를 출력한다.

그래서 Class에서 정의되지 않았던 메서드를 객체에 추가하려면 `types.MethodType, __get__`등과 같은 방식을 통해서 self가 바인딩 된 새로운 함수를 만들어서
객체의 속성으로 할당해야 한다.

엄밀히 말하자면 일반 함수로부터 self가 바인딩된 새로운 메서드를 만들고, 그 메서드를 객체의 속성으로 할당하는 것이다. 그래서 그 함수를 다른 객체의 속성으로 할당해도 할당된 객체를 self로 참조하지는 않는다.

```Python
class Person:
  def __init__(self,name):
    self.name = name;

yeonuk = Person("Yeonuk");
lily = Person("Lily");

def hello(self):
  print(self.name)

import types

binding_hello = types.MethodType(hello,yeonuk,Person)
binding_hello() # "yeonuk"
lily.hello = binding_hello;
lily.hello(); # "yeonuk"
```

위 코드를 보면

- `hello`라는 함수를 types.MethodType의 인자로 전달해서 yeonuk 객체에 바인딩한 `binding_hello`란 메서드를 생성
- `binding_hello` 메서드를 다른 객체 `lily`의 속성으로 할당
- `lily.hello()` 호출 => `"yeonuk"` 출력

순으로 동작하고 있다.

`hello` 함수를 types.MethodType의 인자로 전달해서 yeonuk 객체에 바인딩한 `binding_hello`란 메서드를 생성했기에 `binding_hello`는 곧 yeonuk의 메서드이다.
즉 어떤방식으로 호출하던 yeonuk의 메서드로 동작한다.

이 메서드를 다른 lily 객체에 속성으로 할당하더라도 단지 이 메서드가 할당만 되는 것 뿐이지 메서드가 바라보고 있는 객체는 `yeonuk`이기에 호출결과로 `yeonuk.name`인 `"yeonuk"`이 출력되는 것이다.

결론적으로, 일반적인 Class 기반 객체지향 언어들에서는 메서드 내부에서의 this가 가리키는 값이 해당 메서드가 바인딩 된 객체로 명확히 설계되어 있으며
바인딩 할 객체를 정하는 시점은 Class를 통해서 instance를 생성할 때이다.

만약, 일반 함수를 메서드로서 동작하게 하려면 일반 함수 그대로 사용할 수는 없고 일반 함수를 통해서 새로운 메서드를 만들어야 한다.
그리고 이 새로운 메서드를 만드는 과정에서는 반드시 이 메서드가 어떤 객체에 바인딩 될 지 명확히 지정해줘야 한다.

### Javascript에서의 this

위의 챕터에서 일반적인 프로그래밍 언어에서는 함수와 메서드를 명확히 구분한다고 했다.
하지만 Javascript는 일반 함수와 메서드를 구분하지 않는다.

또한, Javascript는 Class기반 언어가 아니다. Javascript는 Prototype을 기반으로 동작한다. Prototype을 기반으로 동작하기에 특정 객체의 메서드를 호출할 경우 해당 객체안에 메서드가 없다면 프로토타입 체인을 통해서 메서드를 찾게된다.

```javascript
const people = {
  introduce() {
    console.log(this.name)
  },
}

const yeonuk = {
  name: "Yeonuk",
}

const lily = {
  name: "Lily",
}

yeonuk.__proto__ = people // yeonuk의 prototype을 people로 설정
lily.__proto__ = people // lily의 prototype을 people로 설정

yeonuk.introduce() // "Yeonuk"
lily.introduce() // "Lily"
yeonuk.introduce === lily.introduce // true
```

위에서 Yeonuk과 lily객체 모두 introduce라는 메서드는 가지고 있지 않지만, 포로토타입 체인을 통해서 프로토타입 객체인 people의 introduce 함수를 메서드로 호출했다.

여기서 중요한 점은 자기가 가진 함수가 아니라 프로토타입 객체의 함수를 호출했다라는 점이다.
즉 yeonuk과 lily가 자기 자신에 속해있는 함수를 호출한 것이 아니라, 프로토타입 객체인 people의 메서드를 빌려와서 사용한 것이다.
다른 객체지향 언어들에서 각 객체들이 스스로의 메서드를 온전히 소유하고 있는 것과는 상이한 동작이다.

이 상황에서 yeonuk과 lily는 모두 people의 메서드를 빌려와서 사용하기 때문에 결국 동일한 함수를 호출하고 있다.
하지만 같은 함수를 호출했음에도 불구하고 각기 다른 결과(`Yeonuk, Lily`)를 표현할 수 있다.
이것이 Javascript가 this를 고정된 값이 아닌 변하는 값으로 설계한 이유이다.

만약 this가 고정되어서 메서드를 선언한 객체로 고정되게 된다면 introduce 메서드는 해당 메서드를 선언한 객체인 people로 고정되어 있고,
people객체에는 name이란 프로퍼티가 없으므로 name 프로퍼티에 접근하려하면 암묵적으로 undefined를 반환한다. 따라서, introduce 함수를 호출했을때는 매번 `undefined`만 출력될 것이다.
이렇게 동작하게 된다면 메서드 상속을 제대로 구현할 수 없으므로 비효율적이다.

그래서 Javascript는 함수가 호출되는 상황에 따라서 각기 다른 this를 가질 수 있게함으로서 같은 함수를 호출하더라도 각기 다른 결과를 낼 수 있도록 설계하였다.

그리고 Javascript에서 this가 동적으로 변하는 가장 큰 차이점은 **자바스크립트에는 엄밀히 말하면 메서드가 없다.**

> 자바스크립트에 "메서드"라는건 없다. 하지만 자바스크립트는 객체의 속성으로 함수를 지정할 수 있고 속성 값을 사용하듯 쓸 수 있다.
> [^1]

즉, Javascript에서는 객체에 포함되어 있는 함수는 해당 객체에 온전히 바인딩 되었다기보다는 스스로 온전히 하나의 함수로 존재하되, 객체의 특정 프로퍼티가 그 함수의 참조값을 가리키고 있는 것 뿐이다.
그래서 객체에서 메서드를 호출하였을때에도 참조하고 있는 값을 찾아가서 해당 함수를 호출하는 것이다.

즉, 특정 함수가 어떤 객체에 종속된 것이 아닌, 함수 자체로 온전히 존재하며 이를 통해서 같은 함수를 다양한 용도로 사용할 수 있게 된다.

```javascript
function introduce() {
  console.log(this.name)
}

const yeonuk = {
  name: "Yeonuk",
  introduce: introduce,
}

yeonuk.introduce() // "Yeonuk", yeonuk 객체의 메서드로 호출

introduce() // "", 일반 함수로 호출
```

위 코드에서 introduce라는 함수를 yeonuk객체의 메서드로서 호출할 수도 있고, 일반함수로서 호출할 수도 있는 것을 확인할 수 있다.

메서드로서 호출했다는 단어에 집중해야 하는데, 자바스크립트에서 메서드는 존재하지 않으니까 그냥 객체의 속성이 가리키고 있는 함수를 호출하면 그 함수가 메서드처럼 동작하는 것이다.

그렇다면 하나의 함수가 일반 함수로 호출될 수도 있고, 여러 다른 객체의 메서드처럼 호출 할 수 있을 것인데 이런 상황에서 함수가 가리키는 this를 특정 객체에 종속되게 고정해두면 안될 것이다.

그렇기에 자바스크립트는 this값을 `함수가 호출되는 시점` 즉, 실행 컨텍스트가 생성되는 시점에 결정하게 설계하였다고 생각된다.

자, this를 변하는 값으로 설계한 이유는 공감이 되었다.
하지만 그럼에도 불구하고 모든 변수는 정적으로 값이 바인딩되는데에 반해서 this만 동적으로 값이 바인딩 된다는 것은 여전히 개발자들에게 많은 혼란과 공포를 가져다준다.

this를 안쓰면서 개발을 할 수 있다면 좋겠지만, 내가 안쓴다 하더라도 this를 사용한 다른 코드를 읽고 이해해야 할 일이 생길수도 있다.
또한, 무섭다고, 모른다고 this에 대해서 알고자 하지 않는다면 this라는 키워드만 본다면 도망을 가게 될 것이다. 이러한 개발자는 좋은 개발자라고 볼 수 없다.

this를 무서워서 안쓰는 개발자와 사용을 지양하지만 필요한 경우에는 언제든 읽고 해석하고 사용할 수 있는 개발자는 명확히 다르다.

그렇다면 이제 this가 어떤 규칙에 의해서 결정되는지 알아보자.

## this는 어떻게 정해질까?

**javascript에서 this는 함수의 호출방식에 따라서 결정된다.**

this는 일반적으로 객체의 프로퍼티를 참조하기 위해서 사용되므로 함수 그중에서도 객체의 메서드에서만 의미있게 사용될 수 있다.

하지만, Javascript에서는 this에 대한 참조는 코드 어느곳에서든 가능하다. 그래서 메서드로서 호출되지 않는 경우에서의 this는 모두 전역객체를 가리킨다.(strict mode에서는 undefined를 가리킨다.)

```javascript
// 1. 함수가 아닌 일반 코드에서의 this => 전역객체
console.log(this) // window

// 2. 메서드로서 호출된 것이 아닌 일반 함수 호출에서의 this => 전역객체
function foo() {
  console.log(this)
}

foo() // window
```

### 함수의 호출 방식에 따른 this 바인딩

this는 함수의 호출 방식에 따라서 결정된다고 했다.
이 때 주의할 점은 같은 함수라도 여러가지 방식으로 호출 될 수 있다는 점이다.

함수를 호출하는 방법은 크게 4가지로 나눌 수 있다.

1. 일반 함수 호출
2. 메서드 호출
3. 생성자 함수 호출
4. apply, call, bind 메서드에 의한 호출

#### 일반 함수 호출

함수가 메서드로서 호출되는 것이 아니라 일반 함수로서 호출되는 경우에는 this에는 전역 객체가 바인딩된다.

```javascript
// 2. 메서드로서 호출된 것이 아닌 일반 함수 호출 this => 전역객체
function foo() {
  console.log(this)
}

foo() // window
```

이 때 주의할 점은 중첩함수, 콜백함수등의 호출도 모두 일반 함수호출로서 동작한다는 점이다.

```javascript
// 2. 메서드로서 호출된 것이 아닌 일반 함수 호출 this => 전역객체
function foo() {
  console.log(this) // window

  function bar() {
    console.log(this) // window
  }

  bar()
}

foo()
```

위 코드에서 foo안에서 bar라는 내부함수를 선언했고 이를 호출했다. 이때 bar의 호출은 특정 메서드로서 호출된 것이 아닌,
일반 함수 호출로서 동작했기 때문에 bar함수의 this도 window로 바인딩된다.

또한 자바스크립트에서는 콜백함수 패턴이 많이 사용되는데, 콜백함수는 인자로 전달하는 순간 바로 호출되는 것이 아니라 해당 콜백함수를 받은 고차함수에게 호출에 대한 주도권이 있다.
즉, 콜백함수를 어떻게 호출할지는 고차함수에게 달려있다 따라서, this의 결정권도 고차함수가 가지고 있다는 뜻이 된다.

많은 프론트엔드 개발자 입문자들이 이런 동작으로 인해서 this를 두려워하게 된다.

```javascript
const yeonuk = {
  name: "Yeonuk",
  printName() {
    console.log(this.name)
  },
}

const btn = document.querySelector("button")

btn.addEventListener("click", yeonuk.printName)
```

위 코드에서 개발자의 기대는 버튼이 클릭됬을 때 `"Yeonuk"` 이라는 문자열이 나오는 거였지만, 이벤트 리스너의 콜백함수로 전달한 함수는 yeonuk 객체에 바인딩 된 printName을 넘겨주는 것이 아니라,
단순히 yeonuk이라는 객체에서 printName이라는 property가 참조하고 있는 함수를 전달하는 것 뿐이다.

그렇기 때문에, this의 결정권은 이제 실제 printName함수를 호출하는 addEventListener함수에게 있는 것이다.
이 addEventListener는 내부 동작으로 인자로 전달된 함수의 this값을 eventListener가 할당된 Node로 결정하므로 여기서 this는 btn변수에 할당된 DOM Node가 된다.

그렇기 때문에 고차함수에 인자로 전달할 함수들 처럼 호출에 대한 주도권이 없는 함수에서는 this 바인딩에 많은 주의를 기울어야 하며,
this를 사용하지 않거나, arrow function 또는 Function.prototype.bind 메서드를 통해서 this값을 정적으로 고정한 뒤에 사용하는 것이 좋을 것이다.

#### 메서드 호출

특정 객체의 메서드로서 호출된 함수는 해당 함수를 호출한 객체를 this로 삼는다.

이 말은 단순하게 그냥 해당 메서드를 호출하는 객체 즉, `.` or `[]`앞에 적힌 객체가 this가 된다는 뜻이다.
여기서 주의할점은 해당 함수를 선언한 객체가 아닌 호출하는 객체가 중요하다는 점이다.

```javascript
const yeonuk = {
  name: "Yeonuk",
  introduce() {
    console.log(this.name)
  },
}

const lily = {
  name: "Lily",
  introduce: yeonuk.introduce,
}

lily.introduce()
```

위 코드에서 introduce라는 함수를 선언한 객체는 yeonuk이지만 실제 호출하는 객체는 lily이므로 this는 lily를 가리키게 된다.

이렇게 동작하는 이유는 동일하게 introduce라는 함수는 yeonuk에 종속된 것이 아니라 yeonuk에서 선언은 했지만 함수는 별개의 독립된 공간에 존재하게 되며
단순히 해당 객체에서 그 참조값을 가리키고 있는 것 뿐이기 때문이다.

따라서 lily객체에서도 그 참조값을 통해서 같은 함수를 바라보고 결국 이 상황에서 this를 결정짓는 요인은 호출한 객체가 무엇인지에 따라서 결정되는 것이다.

이러한 동작을 통해서 해당 객체가 소유하고 있는 것이 아닌 prototype이 소유하고 있는 함수에서도 this를 참조할 때 prototype객체가 아닌 실제 함수를 호출한 객체를 바라볼 수 있게 되는 것이다.

#### 생성자 함수 호출

javascript에서는 특정 함수를 객체를 생성하는 생성자 함수로서 호출할 수 있다.

그렇다고 특정한 함수의 형태를 생성자 함수로 정해둔 것이 아니라 모든 함수는 생성자 함수로 호출될 수 있다.

함수를 생성자 함수로 호출하는 방법은 함수앞에 new 키워드를 붙여서 호출하는 것이다.

이 생성자 함수 내부에서 지칭하는 this는 생성자 함수로부터 만들어질 instance가 바인딩 된다.

```javascript
function People(name) {
  this.name = name
}

const yeonuk = new People("yeonuk")
console.log(yeonuk.name) // "yeonuk"
```

생성자 함수 People이 가리키는 this는 이 생성자 함수를 통해서 생성될 인스턴스를 가리키고 그에 따라서
yeonuk이라는 객체를 People 함수를 통해서 만드는 과정에서 this는 yeonuk이라는 객체가 되고 결과적으로 yeonuk 객체의 name에 인자로 전달한 `"yeonuk"`이 할당되게 되었다.

다만 이렇게 생성자 함수로 사용하려고 만든 함수를 일반 함수로 호출하게 된다면 내부에서 일반함수 호출시의 this값인 전역객체를 바라보게 된다.
그러면 저 함수를 일반함수로 호출하게 된다면 의도치 않게 전역객체를 수정하게 되는 결과가 나올수도 있다.

```javascript
function People(name) {
  this.name = name
}

console.log(window.name) // ""

const yeonuk = People("yeonuk")

console.log(yeonuk) // undefined
console.log(window.name) // "yeonuk"
```

People 함수를 생성자 함수로 호출하려고 했지만 실수로 new 키워드를 생략했다.
그렇게 된다면 일반함수로서 호출이 되면서 return 값이 없으므로 암묵적으로 yeonuk에 undefined가 할당되게 되고,
가장 큰 문제는 this가 가리키는 값인 전역객체(window)의 name을 수정해버리는 결과를 나타내게 되었다.
실제 개발자의 의도와는 전혀 다르게 동작하게 된 것이다.

그래서 개발자들 사이에서 생성자 용도로 만든 함수를 구분하기 위해서 첫글자를 대문자로 시작하게 하는 등의 컨벤션을 적용하고 있지만
이는 특정한 규칙으로 강제되는 것이 아니라 단순한 컨벤션일 뿐이므로 개발자 개인이 주의를 잘 기울이고, eslint 등의 툴을 통해서
의도와 다르게 동작하는 일이 없도록 주의해야 한다.

#### Function.apply, call, bind 메서드에 의한 호출

함수를 호출하는 방법에는 함수를 직접 호출하는 것 뿐만 아니라 Function.prototype에 있는 메서드를 통해서 간접 호출하는 방식이 있다.
함수를 간접 호출 하는 메서드는 apply, call, bind 3가지 방법이 있다.

이 함수들을 분류하자면 `apply, call`와 `bind`로 구분할 수 있다.

`apply, call`과 `bind`메서드의 차이점은 return값이 원본 함수를 호출한 결과이냐, 아니면 this가 바인딩된 새로운 함수냐의 차이다.
어떻게 동작을 하는지 실제 코드를 통해서 알아보자.

1. apply, call

apply, call 메서드는 원본함수를 호출한 결과값을 return 한다.
apply와 call 메서드는 인자로 1.this로 사용할 객체 2.원본함수를 호출할 때 전달할 인자를 받는다.

유일한 차이점은 함수를 호출할 때 인자를 전달하는 방식이다.
apply 메서드는 인자들을 하나의 배열형태로 받으며, call 메서드는 인자를 하나씩 받는다.

```javascript
const yeonuk = {
  name: "Yeonuk",
}

function sayMessage(message) {
  console.log(`${message} -by ${this.name}-`)
}

sayMessage() // 'undefined -by -'

sayMessage.apply(yeonuk, ["Hello"]) // 'Hello -by Yeonuk-'

sayMessage.call(yeonuk, "Hello") // 'Hello -by Yeonuk-'
```

sayMessage 함수를 일반 함수로 호출한 경우에는 this에 전역객체가 바인딩되었으며
apply와 call을 통해서 간접 호출한 경우에는 첫번째 인자인 this로 사용할 객체로 yeonuk 객체를 전달했으므로
yeonuk의 메서드로서 호출한 것이 아님에도 yeonuk을 this로 인식한다.

apply 메서드는 인자를 배열형태로 담아서 전달하며, call 메서드는 일반 함수에 인자를 전달하는 방식과 동일하다.
만약 인자를 여러개 전달하고자 한다면 apply 메서드는 배열안의 요소의 개수를 늘리면되고,
call 메서드는 일반 함수에 인자를 추가하듯이 `,`로 구분하면서 인자를 추가적으로 전달하면 된다.

```javascript
const yeonuk = {
  name: "Yeonuk",
}

function printNum(num1, num2, num3) {
  console.log(num1, num2, num3)
}

printNum.apply(null, [1, 2, 3]) // 1 2 3
printNum.call(null, 1, 2, 3) // 1 2 3
```

apply와 call 메서드는 일반적으로 중첩함수에서 외부함수의 this를 내부함수에도 일치시켜주기 위해서,
또는 외부함수에서 받은 인자들을 내부함수에 그대로 넘겨주는 상황에서 유용하게 사용된다.

```javascript
const yeonuk = {
  name: "Yeonuk",
  foo() {
    function bar() {
      console.log(this)
    }
    bar()
  },
}

yeonuk.foo() // window

// this 일치
const yeonuk = {
  name: "Yeonuk",
  foo() {
    function bar() {
      console.log(this)
    }
    bar.call(this)
  },
}

yeonuk.foo() // { name: 'Yeonuk', foo: ƒ foo() }
```

```javascript
// 외부함수에서 받은 인자를 그대로 콜백함수에 전달
function delayCall(callback, ...rest) {
  setTimeout(() => callback.apply(null, rest), 1000)
}

function add(num1, num2) {
  console.log(num1 + num2)
}

delayCall(add, 3, 5)
```

2.bind 메서드

bind 메서드를 사용해서 함수를 호출하면 this값이 정적으로 바인딩된 새로운 함수가 리턴된다.

```javascript
const yeonuk = {
  name: "Yeonuk",
}

function getName() {
  console.log(this.name)
}

const getNameOfYeonuk = getName.bind(yeonuk)

getNameOfYeonuk() // "Yeonuk"

const otherPeople = {
  name: "Other",
  getName: getNameOfYeonuk,
}

otherPeople.getName() // "Yeonuk"

console.log(getNameOfYeonuk.name) // bound getName()
```

위 코드에서 getName 함수를 선언했고 그 안에서 this를 사용하고 있다.

getName함수를 bind 메서드를 통해서 호출하면 this가 bind 메서드의 인자로 전달한 yeonuk객체로 정적으로 바인딩된 새로운 함수가 리턴되었다. 이 함수를 getNameOfYeonuk이라는 변수에 할당했다.

이 getNameOfYeonuk이라는 함수는 일반함수로 호출하든, 아니면 다른 객체의 메서드로서 호출되든 this값이 yeonuk이라는 객체로 정적으로 바인딩 되어있다.

bind 메서드의 리턴값으로 나온 함수를 콘솔을 출력해보면 이렇게 특정 객체에 바운딩된 함수라는 표시를 해주기 위해서 `bound ${원본함수 이름}`형태의 name 속성을 갖는다.

apply,call, 그리고 bind 메서드는 모두 Function.prototype이 가지고 있는 메서드로서 함수를 간접적으로 호출할 수 있게 해준다.
apply와 call 메서드는 함수의 호출결과를 리턴하고, bind 메서드는 this가 정적으로 바인딩된 새로운 함수를 리턴해준다.
이 3가지 메서드를 통해서 함수가 바라봐야 하는 this값을 인자로 전달한 객체로 설정해줄 수 있다.

## 결론

Javascript에서의 this는 다른 여타 언어들과는 다르게 런타임에서 동적으로 결정되므로 많은 개발자들에게 혼란을 일으키는 존재이다.
더글라스 크랙포드는 이러한 이유로 this 키워드 없이 프로그램을 짜자는 주장을 하기도 한다.

하지만, Javascript가 그 방식의 옳고 그름에 대한 의견과 상관없이 이런 방식을 채택한 이유는 분명히 존재한다.

Javascript의 설계 의도에 대해서 고민해보고, 동작 원리를 이해할 수 있다면 그때서야 비로소 코드에 대한 견해를 가진 좋은 개발자로 성장할 수 있다고 생각된다.

### 참고자료

[코어 자바스크립트](https://books.google.co.kr/books?id=RyyZzQEACAAJ&dq=%EC%BD%94%EC%96%B4%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8&hl=ko&sa=X&redir_esc=y)  
[모던 자바스크립트 Deep dive](https://books.google.co.kr/books?id=g4fazQEACAAJ&dq=%EB%AA%A8%EB%8D%98+%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+deep+dive&hl=ko&sa=X&redir_esc=y)  
[자바스크립트는 왜 그모양일까?](https://books.google.co.kr/books?id=YzyQzQEACAAJ&dq=javascript%EB%8A%94+%EC%99%9C+%EA%B7%B8%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C&hl=ko&sa=X&redir_esc=y)

### 각주

[^1]: MDN-상속과 프로토타입. [URL](https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#%EB%A9%94%EC%86%8C%EB%93%9C_%EC%83%81%EC%86%8D)

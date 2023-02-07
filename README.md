# Project-YelpCamp

- MongoDB를 이용한 데이터 관리

- Bootstrap을 이용한 styling

- Unsplash Source API를 이용해서 랜덤 이미지 출력

- ejs-mate 패키지를 이용해 레이아웃 분할

  - ejs 기본 문법 `<%-include('경로입력')%>` 활용 <br><br>

- HTTP 메소드에 수행할 동작을 명시, REAT API (RESTful 하게 개발)

- `form`에 기본 클라이언트 측 유효성 검사 추가하기

  - html5 required 속성을 추가하기 (브라우저에 의존하기 때문에 표준화 되어있지 않음)

  - 부스트트랩으 유효성 검사 (https://getbootstrap.kr/docs/5.2/forms/validation/) <br><br>

- Joi를 이용한 스키마 유효성 검사 (사용자가 입력한 데이터가 유효한지 검사하는 유효성 검사 라이브러리)

- `const router = express.Router();` 라우터로 라우트 정리

  - `const router = express.Router({ mergeParams: true });`의 의미는, 라우터에서 URL 파라미터(parameters)를 상위 라우터에서 전달 받을 수 있도록 하는 것을 의미. mergeParams 옵션을 true로 설정하면, 하위 라우터에서 URL 파라미터를 사용할 수 있다.

- static assets service

  - `app.use(express.static("public"))`
  - "정적 assets 서비스"는 웹 어플리케이션에서 정적 파일(static files), 즉 동적으로 변경되지 않는 파일들(CSS, JavaScript, 이미지 등)을 제공하는 것을 의미한다.
  - 정적 assets은 웹 어플리케이션을 요청할 때마다 매번 새로 로드되지 않으므로, 웹 사이트의 속도와 성능을 향상시킬 수 있다.
  - 정적 assets은 공용(public) 디렉토리에 저장되어 있으며, Express 라우터를 통해 클라이언트에게 제공될 수 있다.

- session config
  - create flash message
  - add authentication

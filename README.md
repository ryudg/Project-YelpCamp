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

- `const router = express.Router();` 라우터로 라우트별 정리

  - `const router = express.Router({ mergeParams: true });`의 의미는, 라우터에서 URL 파라미터(parameters)를 상위 라우터에서 전달 받을 수 있도록 하는 것을 의미.
  - mergeParams 옵션을 true로 설정하면, 하위 라우터에서 URL 파라미터를 사용할 수 있다.

- static assets service

  - `app.use(express.static("public"))`
  - "정적 assets 서비스"는 웹 어플리케이션에서 정적 파일(static files), 즉 동적으로 변경되지 않는 파일들(CSS, JavaScript, 이미지 등)을 제공하는 것을 의미한다.
  - 정적 assets은 웹 어플리케이션을 요청할 때마다 매번 새로 로드되지 않으므로, 웹 사이트의 속도와 성능을 향상시킬 수 있다.
  - 정적 assets은 공용(public) 디렉토리에 저장되어 있으며, Express 라우터를 통해 클라이언트에게 제공될 수 있다.

- session config

  - create flash message

- Passport

  - user password hashing
  - passport를 이용해 local 인증 전략 구현
  - session Author 인증과 인증된 author에게 권한 부여
  - reivew, new campground, delete & edit 인증된 사용자에게만 권한 부여

- controller

  - controller 디렉터리에 분할, 라우터 파일에는 라우트만 컨트롤러 파일엔 로직
  - Express.js 에서 controller 는 애플리케이션의 비즈니스 로직을 처리하는 부분을 담당하는 객체이다.
  - 사용자의 요청을 받아서 그에 따른 데이터를 모델에서 가져와서, 그 데이터를 기반으로 결과를 만들어 뷰에 보여준다.
  - 즉, 애플리케이션의 비즈니스 로직과 데이터의 흐름을 제어하는 역할을 한다.

- MVC(Model-View-Controller) - 웹 애플리케이션을 개발할 때 사용되는 아키텍처 패턴

  - Model : 데이터들의 집합, 모델 안에 데이터가 있다.
  - View : 사용자에게 보이는 레이아 웃
  - Controller : 앱의 핵심을 구성하는 역할, 로직이 컨트롤러로 들어오면 뷰를 렌더링하고 모델에서 작업함.

- router.route("경로")를 이용해서 리팩터링

- [Starability](https://github.com/LunarLogic/starability)를 이용한 별점 표시

  - starability-coinFlip

- [Multer](https://github.com/expressjs/multer)를 이용한 이미지 삽입

  ```bash
  > npm i multer
  ```

  ```javascript
  const multer = require("multer");
  ```

  - Express에 적용하고 `multipart/form-data`를 파싱하고 다룬다. 주로 파일을 업로드할 때 사용함.
  - `.post(upload.single("image"), (req, res) => console.log(req.body, req.file));` multer middleware를 사용한 결과

    - <img width="360" alt="스크린샷 2023-02-11 오전 11 23 40" src="https://user-images.githubusercontent.com/103430498/218234235-4a3764ce-2719-43a6-95be-ee4505fcd3b1.png">

  - HTML 폼은 서버에 파일을 보낼수 없다.(파일을 보내려면 폼을 바꿔야함)

    - 인코딩 타입 속성과 관련(`app.use(express.urlencoded({ extended: true }));` : url 인코딩)
    - 파일을 업로드 하기 위해서는 인코딩 타입을 설정해야함(`enctype` 속성을 `multipart/form-data`로 지정)
      - HTML 폼의 전송 방식을 지정하는 속성, 이 속성은 폼 데이터를 어떻게 인코딩할지를 지정
      - `multipart/form-data`
        - 폼의 데이터가 다중 파트 형식으로 인코딩된다는 것을 뜻함.
        - 이 형식은 텍스트 데이터와 파일 데이터를 포함할 수 있어서, 폼에서 텍스트 입력과 파일 업로드 등을 동시에 할 수 있다.
      - 이 속성을 사용하지 않으면, 기본적으로 `application/x-www-form-urlencoded` 형식으로 인코딩.
        - 이 형식은 폼 데이터를 URL 인코딩 형식으로 전송하는데, 파일 업로드를 포함할 수 없습니다.

  - 사진을 저장해야 하는데 MongoDB에는 저장할 수 없다.
    (BSON 문서 용량은 16mb 제한이지만 GridFS를 이용해서 용량이 큰 파일을 저장할 수 있다.)
  - [Cloudinary](https://cloudinary.com/)를 사용
    - 클라우드 기반의 이미지 및 비디오 관리 서비스
    - 작업 과정
      1. 파일을 보낼 수 있게 폼을 만듬
      2. 서버에 들어가서 폼 제출, 라우트인 엔드포인트에 넣음
      3. 파일을가져옴, 파일에 정보가 있음(폼에서 가져온 정보 즉, 데이터)
      4. 데이터를 Cloudinary에 저장함(Cloudinary에 보냄), Cloudinary에서 Url을 받을 수 있게됨
      5. Url을 가져와서 MongoDB에 저장, DB에는 여러 Url이 있고 각각의 Url들은 Cloudinary에 저장한 사진과 일치
    - 회원가입 후 [dot.env](https://www.npmjs.com/package/dotenv) install
      - api 크리덴셜(자격증명)이나 비밀 키를 비밀 파일에 저장(즉, github에 코드를 제출할 때 파일 포함하지 않기 `.env`)
      ```bash
      > npm i dotenv
      ```
  - `Multer`-`Cloudinary` 연동
    - ```bash
      > npm i cloudinary multer-storage-cloudinary
      ```

- Mapbox

  > npm i @mapbox/mapbox-sdk

  - [Mapbox geocoding](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#examples-41)
  - marker 기능
  - clusters
    - 지도 정보가 많으면 분할

- express-mongo-sanitize : 입력값을 검증하여 NoSQL Injection 공격을 방지하기 위한 기능
  - NoSQL Injection은 사용자 입력값을 이용하여 데이터베이스에 악의적인 쿼리를 삽입하는 공격 기법
    - 이러한 공격으로부터 데이터베이스를 보호하기 위해서는 입력값 검증이 필요
  - express-mongo-sanitize는 사용자 입력값에 대해서 MongoDB 쿼리 문자열을 필터링하여 쿼리 문자열에서 불필요한 문자열을 제거
    - 이를 통해 사용자 입력값으로부터 MongoDB 쿼리 인젝션을 방지
  - 즉, express-mongo-sanitize는 Express 애플리케이션에서 사용자 입력값을 처리할 때 보안상의 위협을 줄이기 위한 미들웨어

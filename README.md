# Project-YelpCamp

![스크린샷 2023-02-17 오전 1 34](https://user-images.githubusercontent.com/103430498/219429939-0de124c1-6e79-49b9-9cf1-3e4ca83031ae.png)
<img width="2056" alt="스크린샷 2023-02-17 오전 1 35 25" src="https://user-images.githubusercontent.com/103430498/219429986-98515a2f-edaa-4199-81a5-7251dcb48f04.png">


 ~~# Link :https://mighty-anchorage-14187.herokuapp.com/~~
# Link : https://port-0-yelpcamp-4uvg2mleggcds3.sel3.cloudtype.app/campgrounds

## 1. MongoDB를 이용한 데이터 관리

## 2. Bootstrap을 이용한 styling

## ~~3. Unsplash Source API를 이용해서 랜덤 이미지 출력~~

## 3. ejs-mate 패키지를 이용해 레이아웃 분할

- ejs 기본 문법 `<%-include('경로입력')%>` 활용 <br><br>

## 4. HTTP 메소드에 수행할 동작을 명시, REAT API (RESTful)

## 5. `form`에 기본 클라이언트 측 유효성 검사 추가하기

- html5 required 속성을 추가하기 (브라우저에 의존하기 때문에 표준화 되어있지 않음)
- 부스트트랩 유효성 검사 (https://getbootstrap.kr/docs/5.2/forms/validation/)

## 6. Joi를 이용한 스키마 유효성 검사 (사용자가 입력한 데이터가 유효한지 검사하는 유효성 검사 라이브러리)

## 7. `const router = express.Router();` 라우터로 라우트별 정리

- `const router = express.Router({ mergeParams: true });`
  - 라우터에서 URL 파라미터(parameters)를 상위 라우터에서 전달 받을 수 있도록 함.
- mergeParams 옵션을 true로 설정하면, 하위 라우터에서 URL 파라미터를 사용할 수 있다.

## 8. static assets service

- `app.use(express.static("public"))`
- "정적 assets 서비스"는 웹 어플리케이션에서 정적 파일(static files), 즉 동적으로 변경되지 않는 파일들(CSS, JavaScript, 이미지 등)을 제공하는 것을 의미한다.
- 정적 assets은 웹 어플리케이션을 요청할 때마다 매번 새로 로드되지 않으므로, 웹 사이트의 속도와 성능을 향상시킬 수 있다.
- 정적 assets은 공용(public) 디렉토리에 저장되어 있으며, Express 라우터를 통해 클라이언트에게 제공될 수 있다.

## 9. session config

- create flash message

## 10. Passport

- user password hashing
- passport를 이용해 local 인증 전략 구현
- session Author 인증과 인증된 author에게 권한 부여
- reivew, new campground, delete & edit 인증된 사용자에게만 권한 부여

## 11. controller

- controller 디렉터리에 분할, 라우터 파일에는 라우트만 컨트롤러 파일엔 로직
- Express.js 에서 controller 는 애플리케이션의 비즈니스 로직을 처리하는 부분을 담당하는 객체이다.
- 사용자의 요청을 받아서 그에 따른 데이터를 모델에서 가져와서, 그 데이터를 기반으로 결과를 만들어 뷰에 보여준다.
- 즉, 애플리케이션의 비즈니스 로직과 데이터의 흐름을 제어하는 역할을 한다.

## 12. MVC(Model-View-Controller) - 웹 애플리케이션을 개발할 때 사용되는 아키텍처 패턴

- Model : 데이터들의 집합, 모델 안에 데이터가 있다.
- View : 사용자에게 보이는 레이아 웃
- Controller : 앱의 핵심을 구성하는 역할, 로직이 컨트롤러로 들어오면 뷰를 렌더링하고 모델에서 작업함.

## 13. [Starability](https://github.com/LunarLogic/starability)를 이용한 별점 표시

- starability-coinFlip

## 14. [Multer](https://github.com/expressjs/multer)를 이용한 이미지 삽입

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

## 15. Mapbox : 지도 출력

```bash
  > npm i @mapbox/mapbox-sdk
```

- [Mapbox geocoding](https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#examples-41)
- marker 기능
- clusters
  - 지도 정보가 많으면 분할

## 16. express-mongo-sanitize : 입력값을 검증하여 NoSQL Injection 공격을 방지하기 위한 기능

- NoSQL Injection은 사용자 입력값을 이용하여 데이터베이스에 악의적인 쿼리를 삽입하는 공격 기법
  - 이러한 공격으로부터 데이터베이스를 보호하기 위해서는 입력값 검증이 필요
- express-mongo-sanitize는 사용자 입력값에 대해서 MongoDB 쿼리 문자열을 필터링하여 쿼리 문자열에서 불필요한 문자열을 제거
  - 이를 통해 사용자 입력값으로부터 MongoDB 쿼리 인젝션을 방지
- 즉, express-mongo-sanitize는 Express 애플리케이션에서 사용자 입력값을 처리할 때 보안상의 위협을 줄이기 위한 미들웨어

## 17. Cross Site Scripting (XSS) : 웹 어플리케이션에서 발생하는 취약점 중 하나로, 공격자가 악의적인 스크립트를 웹사이트에 삽입하여 사용자의 브라우저에서 실행시키는 공격

- XSS 공격은 일반적으로 웹사이트에서 입력 폼을 통해 사용자가 입력한 내용을 서버에서 받아오고, 이를 다시 웹페이지에 출력할 때 발생
- 이때 입력한 내용에 악성 스크립트를 함께 삽입하면, 해당 스크립트가 사용자의 브라우저에서 실행되어 사용자의 정보를 탈취하거나, 웹사이트를 조작하는 등의 악의적인 행동을 수행할 수 있다.
  - 예를 들어, 공격자가 웹사이트의 검색 폼에 `<script>alert('해킹당했습니다!');</script>`와 같은 스크립트를 삽입하면, 검색 결과 페이지를 열람하는 모든 사용자가 해당 스크립트가 실행되면서 경고창이 뜨는 상황이 발생
- XSS 공격은 웹 어플리케이션에서 매우 일반적으로 발생하는 취약점 중 하나이며, 이를 방지하기 위해서는 사용자 입력값 검증, 특수문자 필터링, 쿠키 보호, HTTPS 등 다양한 보안 방법을 적용할 수 있다.

## 18. [helmet](https://helmetjs.github.io/) : 보안 관련 HTTP 헤더를 설정해주는 Node.js 패키지

```bash
> npm i helmet
```

- 웹 앱을 개발할 때, 사용자들이 보낸 HTTP 요청에 대해 다양한 보안 취약점이 존재할 수 있다.
- helmet은 이러한 취약점을 방지하기 위해, HTTP 헤더를 설정하여 다양한 보안 문제를 해결한다.
- helmet 패키지가 설정하는 대표적 HTTP 헤더

  1. `X-Content-Type-Options`: MIME 스니핑 공격을 방지하기 위해 브라우저에서 리소스 유형을 스니핑하지 않도록 한다. 이 헤더를 설정하면 브라우저가 리소스의 MIME 유형을 검사하지 않도록 하므로, MIME 타입 공격을 예방할 수 있다.
  2. `X-Frame-Options`: Clickjacking 공격을 방지하기 위해, 해당 페이지가 iframe으로 렌더링되지 않도록 설정한다. 이 헤더를 설정하면 해당 페이지를 iframe으로 렌더링하는 것을 방지할 수 있다.
  3. `Strict-Transport-Security`: HTTPS 연결을 강제하기 위해, HTTPS 프로토콜을 사용하는 경우에만 해당 페이지에 접근할 수 있도록 설정한다. 이 헤더를 설정하면 HTTPS 프로토콜을 사용하지 않는 경우, 페이지에 접근할 수 없다.
  4. `X-XSS-Protection`: Cross-site scripting (XSS) 공격을 방지하기 위해, 브라우저에서 내장된 XSS 필터링을 활성화한다. 이 헤더를 설정하면 브라우저에서 자동으로 XSS 공격에 대한 필터링을 적용할 수 있으므로, XSS 공격을 예방할 수 있다.

## 19. MongoDB Atlas : MongoDB에서 제공하는 클라우드 호스팅 서비스

- MongoDB 데이터베이스를 클라우드에서 쉽게 관리할 수 있다.
- MongoDB의 집약적인 데이터베이스 관리 작업을 단순화함.
- 데이터베이스의 프로비저닝, 설정, 보안, 모니터링 등과 같은 다양한 작업을 수행하지 않아도 됨
- 대부분의 관리 작업을 대신 처리하고, 필요에 따라 데이터베이스를 자동으로 확장할 수 있도록 설계되어 있다.
- 데이터베이스를 클라우드에서 호스팅하기 때문에 사용자는 데이터베이스 서버를 직접 관리할 필요가 없다.
  - 비용과 유지보수 시간을 절약할 수 있으며, 보안 및 확장성에 대한 걱정도 덜어줌.

## 20. [connect-mongo](https://github.com/jdesboeufs/connect-mongo#readme) : 세션 관리 미들웨어

```bash
> npm i connect-mongo
```

- Express.js는 기본적으로 세션 관리를 위해 메모리를 사용한다.
- 그러나 이렇게 사용하는 경우, 서버가 재시작될 때 세션 데이터가 모두 삭제되기 때문에 실제 운영 환경에서는 사용하기 어렵다.
- connect-mongo를 사용하면 세션 데이터를 MongoDB에 저장하므로 이런 문제를 해결할 수 있다.
- connect-mongo는 Express.js의 기본 세션 미들웨어와 함께 사용할 수 있다.
- 기본적으로 세션 데이터는 MongoDB의 sessions 컬렉션에 저장된다. 이를 통해 서버의 메모리 사용량을 줄이고, 클러스터링 및 부하 분산과 같은 확장성 문제를 해결할 수 있다.
- 또한 connect-mongo는 세션 만료 및 삭제를 자동으로 처리하기 때문에 개발자가 수동으로 관리할 필요가 없다. 이를 통해 세션 관리에 대한 부담을 덜어주고, 보안성을 향상시킬 수 있다.

## ~~21. heroku 배포~~

1. Install the Heroku CLI
2. heroku login

```bash
❯ heroku login
```

3. heroku create (터미널 경로가 최상위 파일에 있는지 확인)

```bash
> heroku create
Creating app... done, ⬢ mighty-anchorage-14187
https://mighty-anchorage-14187.herokuapp.com/ | https://git.heroku.com/mighty-anchorage-14187.git
```

4. 경로 수정 app.js `dbUrl`

```javascsript
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
```

5. 배포

```bash
> git remote -v
> git add .
> git commit -m "ready to try deploying"
## > git push heroku master ## error
> git push heroku HEAD:master ## 디폴트 브랜치인 마스터에서 코드를 올림
```

6. error 확인

```bash
> heroku logs --tail
```

- `Starting process with command npm start`, define heroku app start

```json
// package.json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node app.js"
},
```

- heroku port `const port = process.env.PORT || 3000;`

- `Error: Cannot create a client without an access token`, 환경변수 설정

```bash
> heroku config:set SECRET=keyvalue
```

- `MongoNetworkError: connection <monitor> to 52.72.138.16:27017 closed`
  - MongoDB Atlas cluster server에 연결할 수 없음.
  - 화이트 리스트에 포함되지 않은 IP의 데이터베이스에 접근 불가
  - Atlas Network Access > ADD IP ADDRESS > ALLOW ACESS FROM ANYWHERE

7. heroku restart

```bash
> heroku restart
```
## 21. Cloudtype 배포
link : https://port-0-yelpcamp-4uvg2mleggcds3.sel3.cloudtype.app/campgrounds

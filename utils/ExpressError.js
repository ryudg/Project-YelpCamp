class ExpressError extends Error {
  constructor(message, statusCode) {
    super(); // Error 생성자(constructor) 호출
    this.message = message; // this.message가 전달되는 Error 메시지와 동등하게 만듦
    this.statusCode = statusCode; // this.statusCode 전달되는 Error 상태코드와 동등하게 만듦
  }
}

module.exports = ExpressError;

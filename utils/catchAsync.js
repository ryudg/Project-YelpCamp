// async Error 검출 기능 즉, 래퍼 함수
// 함수 받아들이기
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

import request from "@/utils/request.js";
/**
 * 查询题库题目
 * 
 */
export function getQuestionList (data) {
  return request.get('exam/bank/question/list', data, {
    noAuth: true
  });
}
/**
 * 查询题库详情
 * 
 */
export function getExamBank (id) {
  return request.get('exam/bank/' + id, {}, {
    noAuth: true
  });
}
/**
 * 查询试卷题库详情
 * 
 */
export function getExamBankPaperInfo (data) {
  return request.get('exam/bank/paper/info', data, {
    noAuth: true
  });
}
/**
 * 开始答题
 * 
 */
export function answerBegin (data) {
  return request.post('exam/bank/answer/begin', data);
}
/**
 * 答题
 * 
 */
export function questionAnswer (data) {
  return request.post('exam/bank/question/answer', data);
}
import request from "@/utils/request.js";
/**
 * 课程列表
 *
 */
export function getCourseList (data) {
  return request.get("course/list", data, {
    noAuth: true
  });
}
/**
 * 课程详情
 *
 */
export function getCourseInfo (number) {
  return request.get("course/info/" + number, {}, {
    noAuth: true
  });
}
/**
 * 课程章节
 *
 */
export function getCourseChapterLabel (number) {
  return request.get("course/chapter/label/" + number, {}, {
    noAuth: true
  });
}
/**
 * 章节下的课程
 *
 */
export function getCourseChapterCatalog (data) {
  return request.get("course/chapter/catalog", data, {
    noAuth: true
  });
}
/**
 * 课程分类
 *
 */
export function getCourseCategoryList (data) {
  return request.get("course/category/list", data, {
    noAuth: true
  });
}
/**
 * 查询app直播详情
 *
 */
export function getLiveData (number) {
  return request.get("course/appLive/" + number, "", {
  });
}
/**
 * 查询app回放详情
 *
 */
export function getLiveBackData (number) {
  return request.get("course/appLiveBack/" + number, "", {
  });
}
/**
 * 评论列表
 *
 */
export function getCourseReplyList (data) {
  return request.get("course/reply/list", data, { noAuth: true });
}
/**
 * 套餐详情
 *
 */
export function getSetmealList (number) {
  return request.get("course/setmeal/" + number, "", {
    noAuth: true
  });
}
/**
 * 发表评论
 * 
 */
export function courseReply (data) {
  return request.post("course/reply", data, {
    noAuth: true
  });
}
/**
 * 老师详情
 * 
 */
export function teacherInfo (number) {
  return request.get("teacher/" + number, "", {
    noAuth: true
  });
}
/**
 * 学习动作
 * 
 */
export function courseStudy (data) {
  return request.post("course/study", data, {
    noAuth: true
  });
}
/**
 * 最近学习
 */
export function getCourseStudyRecent (data) {
  return request.get("course/study/recent", data, {
    noAuth: true
  });
}
/**
 * 获取H5直播信息
 */
export function getH5Live (data) {
  return request.post("app/live/getH5Live", data, {
    noAuth: true
  });
}
/**
 * 获取H5回放信息
 */
export function getBackPlayer (data) {
  return request.post("app/live/getBackPlayer", data, {
    noAuth: true
  });
}
/**
 * 最近学习
 */
export function getCourseSearch (data) {
  return request.get("course/search", data, {
    noAuth: true
  });
}
/**
 * 登录校验
 */
export function loginCheck () {
  return request.get("loginCheck", {}, {
    noAuth: true
  });
}
/**
 * 点击播放上报+1播放量
 */
export function incrActualHits (data) {
  return request.get("course/incrActualHits", data, {
    noAuth: true
  });
}
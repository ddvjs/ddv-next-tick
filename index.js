// 导出模块
module.exports = nextTick
// 下一进程队列
var nextTickQueue = []
// 系统下一进程运行
var nextTickSys = (function () {
  var fnc
  if (typeof process !== 'undefined' && isFunction(process.nextTick)) {
    fnc = process.nextTick
  } else {
    if (typeof window !== 'undefined') {
      'r webkitR mozR msR oR'.split(' ').forEach(function (prefixes) {
        if (isFunction(fnc)) {
          return false
        }
        fnc = window[prefixes + 'equestAnimationFrame']
      })
    }
    fnc = (fnc && fnc.bind && fnc.bind(window)) || window.setImmediate
    if (!isFunction(fnc)) {
      if (typeof window === 'undefined' || window.ActiveXObject || !window.postMessage) {
        fnc = function (f) {
          setTimeout(f, 0)
        }
      } else {
        window.addEventListener('message', function () {
          var i = 0
          while (i < nextTickQueue.length) {
            try {
              nextTickQueue[i++]()
            } catch (e) {
              nextTickQueue.splice(0, i)
              window.postMessage('nextTick!', '*')
              throw e
            }
          }
          nextTickQueue.length = 0
        }, true)
        fnc = function (fn) {
          if (!nextTickQueue.length) {
            window.postMessage('nextTick!', '*')
          }
          nextTickQueue.push(fn)
        }
      }
    }
  }
  return fnc
}())
// 下一进程访问
function nextTick (fn) {
  var self = this
  nextTickSys(function () {
    if (isFunction(fn)) {
      fn.call(self)
    }
    self = fn = void 0
  })
  setTimeout(function () {
    if (isFunction(fn)) {
      fn.call(self)
    }
    self = fn = void 0
  }, 0)
}
nextTick.isFunction = isFunction
function isFunction (fn) {
  return typeof fn === 'function'
}

/** last changed: 2020.5.3 */

/** States **/
const Shuang = {
  resource: {
    dict: {},
    otto传世语录: [],
    schemeList: {},
    scheme: {},
    emoji: {
      right: '✅', wrong: '❎'
    }
  },
  core: {
    model: {},
    current: {},
    otto_cache: [],
    otto_sub : 0,
    order: {
      shengIndex: 0,
      yunIndex: 0
    },
    history: []
  },
  app: {
    setting: {
      config: {},
      reload() { }
    },
    staticJS: 0,
    modeList: [],
    action: {}
  }
}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function importJS(src = '', onload = () => { Shuang.app.staticJS++ }) {
  src = `build/${src}.min.js`
  const newScript = document.createElement('script')
  Object.assign(newScript, { src, onload })
  document.body.appendChild(newScript)
}

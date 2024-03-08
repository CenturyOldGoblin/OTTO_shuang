/** last changed: 2020.5.3 */

/** States **/
const Shuang = {
  resource: {
    dict: {},
    otto传世语录: [],
    allin_audio:[],
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
    otto_sub: 0,
    allin_mode: {
      point:0,
      accuracy: 1,
      tot_ju: 0,
      cur_ju:0,
      allin: false,
      mode: "",
      max_p: 0,
      Timer:undefined
    },
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

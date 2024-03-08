/** last changed: 2019.8.23 */
// const { pinyin } = require('pinyin-pro');
// import {pinyin} from 'pinyin-pro'
Shuang.core.model = class Model {
  constructor(sheng = '', yun = '', word = '') {
    this.sheng = sheng.toLowerCase()
    this.yun = yun.toLowerCase()
    this.is_char = false
    if (word !== '') {
      this.dict = word
      if (/^[a-zA-Z]*$/.test(word)) {
        this.is_char=true
      }
    }
    else this.dict = Shuang.resource.dict[this.sheng][this.yun]
    this.scheme = new Set()
    this.view = {
      sheng: this.sheng.toUpperCase().slice(0, 1) + this.sheng.slice(1),
      yun: this.yun
    }
  }
  
  beforeJudge() {
    this.scheme.clear()
    if (this.is_char) {
      this.scheme.add(this.dict + this.dict)
      return
    }
    const schemeName = Shuang.app.setting.config.scheme
    const schemeDetail = Shuang.resource.scheme[schemeName].detail
    const pinyin = this.sheng + this.yun
    if (schemeDetail.other[pinyin]) {
      if (Array.isArray(schemeDetail.other[pinyin])) {
        schemeDetail.other[pinyin].forEach(other => this.scheme.add(other))
      } else {
        this.scheme.add(schemeDetail.other[pinyin])
      }
    } else {
      for (const s of schemeDetail.sheng[this.sheng]) {
        for (const y of schemeDetail.yun[this.yun]) {
          this.scheme.add(s + y)
        }
      }
      if (this.yun === 'u' && 'jqxy'.includes(this.sheng)) {
        for (const s of schemeDetail.sheng[this.sheng]) {
          for (const y of schemeDetail.yun.v) {
            this.scheme.add(s + y)
          }
        }
      }
    }
  }
  
  judge(sheng = '', yun = '') {
    this.beforeJudge()
    return this.scheme.has(sheng.toLowerCase() + yun.toLowerCase())
  }
  
  static getRandom() {
    const sheng = Shuang.resource.dict.list[Math.floor(Math.random() * Shuang.resource.dict.list.length)]
    const yun = Shuang.resource.dict[sheng].list[Math.floor(Math.random() * Shuang.resource.dict[sheng].list.length)]
    const instance = new Model(sheng, yun)
    return Model.isSame(instance, Shuang.core.current) ? Model.getRandom() : instance
  }
  
  static getHardRandom() {
    let instance = undefined
    do {
      instance = Model.getRandom()
    } while (instance.sheng === '' || instance.yun.length === 1)
    return instance
  }
  
  static getByOrder() {
    while (true) {
      const sheng = Shuang.resource.dict.list[Shuang.core.order.shengIndex]
      if (sheng !== undefined) {
        const yun = Shuang.resource.dict[sheng].list[Shuang.core.order.yunIndex]
        if (yun) {
          Shuang.core.order.yunIndex++
          return new Model(sheng, yun)
        }
      }
      if (Shuang.core.order.yunIndex === 0) {
        Shuang.core.order.shengIndex = 0
      } else {
        Shuang.core.order.shengIndex++
        Shuang.core.order.yunIndex = 0
      }
    }
  }
  
  static otto_random_get() {
    var word = ""
    var cur_s = Shuang.core.otto_cache[0][1]
    if (Shuang.core.otto_sub < cur_s.length) {
      word = cur_s[Shuang.core.otto_sub]
      Shuang.core.otto_sub += 1
      var { pinyin } = pinyinPro;
      var shen = pinyin(word, { pattern: 'initial' }); // ["h", "y", "p", "y"]
      var yun = pinyin(word, { pattern: 'final', toneType: 'none' })
      return new Model(shen, yun, word)
    }
    else {
      Shuang.core.allin_mode.cur_ju += 1;
      if (Shuang.core.allin_mode.cur_ju >= Shuang.core.allin_mode.tot_ju) {
        Shuang.app.action.allin_off()
        console.log("再见了, 所有的阿米诺手.")
      }

      Shuang.core.otto_cache[0][2].play()
      Shuang.core.otto_cache.shift()
      Shuang.core.otto_sub = 0
      var in_sub = Shuang.core.otto_cache.map(element => element[0])
      do {
        var sub = no_repeat_random()
      } while(sub in in_sub)
      this.otto_load(sub)
      return this.otto_random_get()
    }
  }
  static async otto_load(sub) {
    var audio = await fetch('src/otto_audio/' + sub + '.mp3')
      .then(response => response.blob())
      .then(blob => {
        // 创建一个audio元素
        const audio = new Audio();
        // 设置audio的src为音频文件的Blob URL
        audio.src = URL.createObjectURL(blob);
        // 播放音频
        return audio;
      })
      .catch(error => console.error('发生错误:', error))
    Shuang.core.otto_cache.push([sub, Shuang.resource.otto传世语录[sub], audio])
  }
  static isSame(a, b) {
    return a.sheng === b.sheng && a.yun === b.yun
  }

  // makes playing audio return a promise
  static async Load_audio() {

  }

}

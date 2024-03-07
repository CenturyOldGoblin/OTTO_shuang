/** last changed: 2019.8.23 */
// const { pinyin } = require('pinyin-pro');
Shuang.core.model = class Model {
  constructor(sheng = '', yun = '') {
    this.sheng = sheng.toLowerCase()
    this.yun = yun.toLowerCase()
    this.dict = Shuang.resource.dict[this.sheng][this.yun]
    this.scheme = new Set()
    this.view = {
      sheng: this.sheng.toUpperCase().slice(0, 1) + this.sheng.slice(1),
      yun: this.yun
    }
  }
  
  beforeJudge() {
    this.scheme.clear()
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
    console.log(cur_s.length);
    if (Shuang.core.otto_sub < cur_s.length) {
      word = cur_s[Shuang.core.otto_sub]
      Shuang.core.otto_sub += 1
      var shen = pinyin(word, { pattern: 'initial' }); // ["h", "y", "p", "y"]
      var yun = pinyin(word, { pattern: 'final', toneType: 'none' })
      return new Model(shen, yun)
    }
    else {
      Shuang.core.otto_cache[0][2].play()
      Shuang.core.otto_cache.shift()
      var in_sub = Shuang.core.otto_cache.map(element => element[0])
      do {
        var sub = Math.floor(Math.random() * Shuang.resource.otto传世语录.length)
      } while(sub in in_sub)
      this.otto_load(sub)
      return this.otto_random_get()
    }
  }
  static otto_load(sub) {
    Shuang.core.otto_cache.push([sub, Shuang.resource.otto传世语录[sub],
    fetch('src/otto_audio/' + sub + '.mp3')
      .then(response => response.blob())
      .then(blob => {
        // 创建一个audio元素
        const audio = new Audio();
        // 设置audio的src为音频文件的Blob URL
        audio.src = URL.createObjectURL(blob);
        // 播放音频
        return audio;
      })
      .catch(error => console.error('发生错误:', error))])
  }
  static isSame(a, b) {
    return a.sheng === b.sheng && a.yun === b.yun
  }

  // makes playing audio return a promise
  static async Load_audio() {

  }

}

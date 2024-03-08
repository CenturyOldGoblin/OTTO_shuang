/** last changed: 2022.3.6 */
var rand_l = []
var rand_cnt = -1
function n_no_repeat_random(n) {
  var l = []
  while (n > 0) {
    l.push(no_repeat_random())
    n--
  }
  return l
}
function no_repeat_random(){
  if (rand_cnt >= rand_l.length || rand_cnt == -1) {
    rand_l = pseudoRandomArray(Shuang.resource.otto传世语录.length)
    rand_cnt = 0
  }
  return rand_l[rand_cnt++]
}
function pseudoRandomArray(lenh) {
  const array = Array.from({ length: lenh }, (_, index) => index);

  // Fisher-Yates 洗牌算法
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}


Shuang.app.action = {
  async init() {
    /** Update Resources **/
    if (navigator && navigator.userAgent && /windows|linux/i.test(navigator.userAgent)) {
      Shuang.resource.emoji = { right: '✔️', wrong: '❌' }
    }

    /** Rendering **/
    function renderSelect(target, options, callback) {
      options.forEach(option => {
        const opt = document.createElement('option')
        if (option.disabled) opt.setAttribute('disabled', 'disabled')
        opt.innerText = option.text || option
        target.appendChild(opt)
      })
      target.onchange = e => {
        callback(e.target.value)
      }
    }

    const schemeList = Object.values(Shuang.resource.schemeList)
    const schemes = {
      common: schemeList.filter(scheme => !scheme.endsWith('*')),
      uncommon: schemeList
        .filter(scheme => scheme.endsWith('*') && !scheme.endsWith('**'))
        .map(scheme => scheme.slice(0, -1))
      ,
      rare: schemeList
        .filter(scheme => scheme.endsWith('**'))
        .map(scheme => scheme.slice(0, -2))
    }
    const schemeOptions = [
      { disabled: true, text: '常见' },
      ...schemes.common,
      { disabled: true, text: '小众' },
      ...schemes.uncommon,
      { disabled: true, text: '爱好者' },
      ...schemes.rare,
    ]

    renderSelect($('#scheme-select'), schemeOptions, value => {
      Shuang.app.setting.setScheme(value)
    })
    renderSelect($('#mode-select'), Object.values(Shuang.app.modeList).map(mode => mode.name), value => {
      Shuang.app.setting.setMode(value)
      this.next()
    })

    /** Setting First Question **/
    // Shuang.core.current = new Shuang.core.model('sh', 'uang')
    // $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    // $('#dict').innerText = Shuang.core.current.dict

    var subs = n_no_repeat_random(3)
    async function load_allin_audio() {
      for (var i = 1; i <= 3; i++) {
        var audio = await fetch('src/otto_audio/allin/' + i + '.mp3')
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
        audio.addEventListener('ended', () => {
          $("#daoli_1").hidden = true
          $("#daoli_2").hidden = true
          $("#daoli_3").hidden = true
        });
        Shuang.resource.allin_audio.push(audio)
      }
    }
    load_allin_audio()
    async function ini_load() {
      for (var i = 0; i < 3;i++) {
        await Shuang.core.model.otto_load(subs[i])
      }
    }
    await ini_load();
    /** Reset Configs **/
    Shuang.core.current = Shuang.core.model.otto_random_get();
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict
    Shuang.app.setting.reload()
    // this.next()
    /** Listen Events **/
    document.addEventListener('keydown', e => {
      if (['Tab', 'Enter', ' '].includes(e.key)) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          // event.returnValue = false
        }
      }
    })
    document.addEventListener('keyup', e => {
      this.keyPressed(e)
    })
    $('#pic-switcher').addEventListener('change', e => {
      Shuang.app.setting.setPicVisible(e.target.checked)
    })
    $('#dark-mode-switcher').addEventListener('change', e => {
      Shuang.app.setting.setDarkMode(e.target.checked)
    })
    $('#auto-next-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoNext(e.target.checked)
    })
    $('#auto-clear-switcher').addEventListener('change', e => {
      Shuang.app.setting.setAutoClear(e.target.checked)
    })
    $('#show-keys').addEventListener('change', e => {
      Shuang.app.setting.setShowKeys(e.target.checked)
    })
    $('#show-pressed-key').addEventListener('change', e => {
      Shuang.app.setting.setShowPressedKey(e.target.checked)
    })
    $('#disable-mobile-keyboard').addEventListener('change', e => {
      Shuang.app.setting.setDisableMobileKeyboard(e.target.checked)
    })
    $('.pay-name#alipay').addEventListener('mouseover', () => {
      Shuang.app.action.qrShow('alipay-qr')
    })
    $('#alipay-qr').addEventListener('click', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#alipay-qr').addEventListener('mouseout', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('.pay-name#wxpay').addEventListener('mouseover', () => {
      Shuang.app.action.qrShow('wxpay-qr')
    })
    $('#wxpay-qr').addEventListener('click', e => {
      Shuang.app.action.qrHide(e.target)
    })
    $('#wxpay-qr').addEventListener('mouseout', e => {
      Shuang.app.action.qrHide(e.target)
    })
    // $('#wx-name').addEventListener('mouseover', () => {
    //   Shuang.app.action.qrShow('wx-qr')
    // })
    // $('#wx-qr').addEventListener('click', e => {
    //   Shuang.app.action.qrHide(e.target)
    // })
    // $('#wx-qr').addEventListener('mouseout', e => {
    //   Shuang.app.action.qrHide(e.target)
    // })
    $('#dict').addEventListener('click', () => {
      Shuang.core.current.beforeJudge()
      $('#a').value = Shuang.core.current.scheme.values().next().value
      this.judge()
    })
    $('#allin_button').addEventListener('click', () => {
      if (!Shuang.core.allin_mode.allin) {
        var v = $("#allin_v").value
        if (0 <= v && v <= 100) {
          Shuang.core.allin_mode.tot_ju = v
          Shuang.core.allin_mode.cur_ju = 0
          this.allin_on($("#allin_select").value)
        }
        $('#allin_button').innerText = "关闭allin模式"
      }
      else {
        Shuang.app.action.allin_off()
      }

    })
    window.addEventListener('resize', Shuang.app.setting.updateKeysHintLayoutRatio)
    window.resizeTo(window.outerWidth, window.outerHeight)

    /** Simulate Keyboard */
    const keys = $$('.key')
    const qwerty = 'qwertyuiopasdfghjkl;zxcvbnm'
    for (let i = 0; i < keys.length; i++) {
      keys[i].addEventListener('click', () => {
        const event = new KeyboardEvent('keyup', { key: qwerty[i].toUpperCase()})
        event.simulated = true
        document.dispatchEvent(event)
      })
    }

    /** All Done **/
    this.redo()
  },
  keyPressed(e) {
    switch (e.key) {
      case 'Backspace':
        this.redo()
        break
      case 'Tab':
        Shuang.core.current.beforeJudge()
        $('#a').value = Shuang.core.current.scheme.values().next().value
        this.judge()
        break
      case 'Enter':
      case ' ':
        if (this.judge()) {
          this.next()
        } else {
          this.redo()
        }
        break
      default:
        if (e.simulated) {
          $('#a').value += e.key.toLowerCase()
        }
        $('#a').value = $('#a').value
          .slice(0, 2)
          .replace(/[^a-zA-Z;]/g, '')
          .split('')
          .map((c, i) => i === 0 ? c.toUpperCase() : c.toLowerCase())
          .join('')
        Shuang.app.setting.updatePressedKeyHint(e.key)
        const canAuto = $('#a').value.length === 2
        const isRight = this.judge()
        if (canAuto) {
          if (Shuang.core.allin_mode.allin) this.allin_judge(isRight)
          if (isRight && Shuang.app.setting.config.autoNext === 'true') {
            this.next(e.simulated)
          } else if (!isRight && Shuang.app.setting.config.autoClear === 'true') {
            this.redo(e.simulated)
          }
        }
    }
  },
  judge() {
    const input = $('#a')
    const btn = $('#btn')
    const [sheng, yun] = input.value
    if (yun && Shuang.core.current.judge(sheng, yun)) {
      btn.onclick = () => this.next(true)
      btn.innerText = Shuang.resource.emoji.right
      return true
    } else {
      btn.onclick = () => this.redo(true)
      btn.innerText = Shuang.resource.emoji.wrong
      return false
    }
  },
  allin_on(mode) {
    Shuang.core.allin_mode.mode = mode
    Shuang.core.allin_mode.allin = true
    Shuang.core.allin_mode.max_p = Shuang.core.allin_mode.point= 100+Shuang.core.allin_mode.tot_ju*9
    
    this.allin_check()
    Shuang.core.allin_mode.Timer = setInterval(this.allin_check, 200);
    switch (mode) {
      case "癌症晚期":
        // $("#show-keys").checked = Shuang.app.setting.config.showKeys = 'false';
        Shuang.app.setting.setShowKeys(false)
        $("#show-keys").hidden = true
        $("#daoli_1").hidden = false
        $("#daoli_2").hidden = false
        break
      case "癌症早期":
        Shuang.app.setting.setShowKeys(false)
        $("#show-keys").hidden = true
        $('#q').style.display = 'none'//pinyin
        $("#daoli_1").hidden = false
        $("#daoli_2").hidden = false
        break
      case "钻一":
        Shuang.app.setting.setShowKeys(false)
        $("#show-keys").hidden = true
        $('#q').style.display = 'none'//pinyin
        $("#daoli_1").hidden = false
        $("#daoli_2").hidden = false
        $("#daoli_3").hidden = false
        Shuang.app.setting.setPicVisible(false)
        $("#pic-switcher").hidden = true
        break
    }
  },
  allin_check() {
    if (Shuang.core.allin_mode.point >= 75) {
      $("#daoli_1").src = "img/otto/3.webp"
      $("#daoli_2").src = "img/otto/3.webp"
      $("#daoli_3").src = "img/otto/3.webp"
    }
    else if (Shuang.core.allin_mode.point >= 20) {
      $("#daoli_1").src = "img/otto/2.webp"
      $("#daoli_2").src = "img/otto/2.webp"
      $("#daoli_3").src = "img/otto/2.webp"
    }
    else {
      $("#daoli_1").src = "img/otto/1.webp"
      $("#daoli_2").src = "img/otto/1.webp"
      $("#daoli_3").src = "img/otto/1.webp"
    }
    switch (Shuang.core.allin_mode.mode) {
      case "癌症晚期":
        Shuang.core.allin_mode.point -= 3 / 5
        break
      case "癌症早期":
        Shuang.core.allin_mode.point -= 6 / 5
        break
      case "钻一":
        Shuang.core.allin_mode.point -= 10 / 5
        break
    }
    Shuang.core.allin_mode.point = Math.max(0, Shuang.core.allin_mode.point)
    console.log(Shuang.core.allin_mode.point)

  }
  ,
  allin_off() {
    clearInterval(Shuang.core.allin_mode.Timer)
    Shuang.core.allin_mode.allin = false
    $('#allin_button').innerText = "allin模式"
    switch (Shuang.core.allin_mode.mode) {
      case "癌症晚期":
        // $("#show-keys").checked = Shuang.app.setting.config.showKeys = 'false';
        Shuang.app.setting.setShowKeys(true)
        $("#show-keys").hidden = false

        break
      case "癌症早期":
        Shuang.app.setting.setShowKeys(true)
        $("#show-keys").hidden = false
        $('#q').style.display = 'block'//pinyin

        break
      case "钻一":
        Shuang.app.setting.setShowKeys(true)
        $("#show-keys").hidden = false
        $('#q').style.display = 'block'//pinyin

        Shuang.app.setting.setPicVisible(true)
        $("#pic-switcher").hidden = false
        break
    }
    var audio
    var score = Shuang.core.allin_mode.point / Shuang.core.allin_mode.max_p * 100
    if (Shuang.core.allin_mode.point >= 75) {
      audio = Shuang.resource.allin_audio[2]
      // alert("呵呵呵呵哈哈哈\n" + score + "%")
      createToast("success", "呵呵呵呵哈哈哈\n" + score + "%", true, 5)
    }
    else if (Shuang.core.allin_mode.point >= 20) {
      audio = Shuang.resource.allin_audio[1]
      
      createToast("info", "怎么大伙都挺猛的到你这拉了胯呢?\n" + score + "%", true, 5)
    }
    else {
      audio = Shuang.resource.allin_audio[0]

      createToast("warning", "铸币吧怎么这么菜啊?\n" + score + "%", true, 5)
    }
    audio.play()

    

  }
  ,
  allin_judge(res) {
    var v = 0
    if (res) {
      Shuang.core.allin_mode.point = Math.min(Shuang.core.allin_mode.max_p, Shuang.core.allin_mode.point +
        (100 / (Shuang.core.allin_mode.tot_ju * 14)) * Math.exp((100 - (Shuang.core.allin_mode.point)) / 60))
      // console.log(Shuang.core.allin_mode.cur_ju)
    }
    else {
      Shuang.core.allin_mode.point -= 50 / (Shuang.core.allin_mode.tot_ju * 14)
    }
    Shuang.core.allin_mode.point = Math.max(0, Shuang.core.allin_mode.point)
  }
  ,
  redo(noFocus) {
    $('#a').value = ''
    if (!noFocus) $('#a').focus()
    $('#btn').onclick = () => this.redo(noFocus)
    $('#btn').innerText = Shuang.resource.emoji.wrong
  },
  next(noFocus) {
    this.redo(noFocus)
    switch (Shuang.app.setting.config.mode) {
      case 'all-random':
        Shuang.core.current = Shuang.core.model.getRandom()
        break
      case 'all-order':
        Shuang.core.current = Shuang.core.model.getByOrder()
        break
      case 'hard-random':
        Shuang.core.current = Shuang.core.model.getHardRandom()
        break
      case 'hard-random-without-pinyin':
        do {
          Shuang.core.current = Shuang.core.model.getHardRandom()
        } while (Array.isArray(Shuang.core.current.dict))
        break
      case 'otto':
        Shuang.core.current = Shuang.core.model.otto_random_get();
        console.log("冲刺冲刺");
        break;
    }
    // if (Shuang.core.history.includes(Shuang.core.current.sheng + Shuang.core.current.yun)) this.next()
    // else Shuang.core.history = [...Shuang.core.history, Shuang.core.current.sheng + Shuang.core.current.yun].slice(-100)
    $('#q').innerText = Shuang.core.current.view.sheng + Shuang.core.current.view.yun
    $('#dict').innerText = Shuang.core.current.dict

    // Update Keys Hint
    Shuang.core.current.beforeJudge()
    Shuang.app.setting.updateKeysHint()
  },
  qrShow(targetId) {
    $('#' + targetId).style.display = 'block'
  },
  qrHide(target) {
    target.style.display = 'none'
  }
}

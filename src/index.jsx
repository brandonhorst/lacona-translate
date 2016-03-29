/** @jsx createElement */

import _ from 'lodash'
import { URL } from 'elliptical-url'
import { String } from 'elliptical-string'
import { createElement } from 'elliptical'
import { openURL } from 'lacona-api'
import { Command } from 'lacona-command'
import demoExecute from './demo'
import languages from './languages'

const Language = {
  describe () {
    const items = _.map(languages, ({name, code}) => ({
      text: name,
      value: {name, code}
    }))

    return (
      <label text='language'>
        <list limit={10} items={items} />
      </label>
    )
  }
}

const Translate = {
  extends: [Command],
  demoExecute,
  execute (result) {
    result = _.defaults({}, result, {
      to: [{name: 'English', code: 'en'}],
      from: {name: 'Auto', code: 'auto'}
    })

    _.forEach(result.to, (to) => {
      let url
      if (result.phrase) {
        url = `https://translate.google.com/#${result.from.code}/${to.code}/${encodeURIComponent(result.phrase)}`
      } else if (result.url) {
        url = `https://translate.google.com/translate?sl=${result.from.code}&tl=${to.code}&u=${encodeURIComponent(result.url)}`
      }

      openURL({url})
    })
  },
  
  describe () {
    return (
      <sequence>
        <literal text='translate ' category='action' />
        <choice merge={true}>
          <URL id='url' splitOn=' ' />
          <String argument='phrase' id='phrase' limit={1} splitOn=' ' />
        </choice>
        <sequence optional={true} merge={true}>
          <literal text=' from ' category='conjunction' />
          <Language id='from' />
        </sequence>
        <sequence optional={true} merge={true}>
          <literal text=' to ' />
          <repeat separator={<list items={[', ', ' and ', ', and ']} category='conjunction' limit={1} />} id='to' unique>
            <Language />
          </repeat>
        </sequence>
      </sequence>
    )
  }
}

export const extensions = [Translate]

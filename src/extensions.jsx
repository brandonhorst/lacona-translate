/** @jsx createElement */

import { createElement } from 'elliptical'
import { openURL } from 'lacona-api'

import _ from 'lodash'
import { URL, String, Command } from 'lacona-phrases'
import demoExecute from './demo'
import languages from './languages'

const Language = {
  describe () {
    const items = _.map(languages, ({name, code}) => ({
      text: name,
      value: {name, code}
    }))

    return (
      <placeholder argument='language'>
        <list limit={10} items={items} />
      </placeholder>
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
        <literal text='translate ' />
        <choice merge={true}>
          <URL argument='URL' id='url' splitOn='' />
          <String label='phrase' id='phrase' limit={1} splitOn=' ' />
        </choice>
        <sequence optional={true} merge={true}>
          <literal text=' from ' />
          <Language id='from' />
        </sequence>
        <sequence optional={true} merge={true}>
          <literal text=' to ' />
          <repeat separator={<list items={[', ', ' and ', ', and ']} limit={1} />} id='to' unique>
            <Language />
          </repeat>
        </sequence>
      </sequence>
    )
  }
}

export default [Translate]

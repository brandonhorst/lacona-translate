/** @jsx createElement */

import _ from 'lodash'
import { URL } from 'lacona-phrase-url'
import { String } from 'lacona-phrase-string'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { openURL } from 'lacona-api'
import { Command } from 'lacona-command'

class Languages extends Source {
  data = [
    {name: 'Afrikaans', code: 'af'},
    {name: 'Albanian', code: 'sq'},
    {name: 'Arabic', code: 'ar'},
    {name: 'Armenian', code: 'hy'},
    {name: 'Azerbaijani', code: 'az'},
    {name: 'Basque', code: 'eu'},
    {name: 'Belarusian', code: 'be'},
    {name: 'Bengali', code: 'bn'},
    {name: 'Bosnian', code: 'bs'},
    {name: 'Bulgarian', code: 'bg'},
    {name: 'Burmese', code: 'my'},
    {name: 'Catalan', code: 'ca'},
    {name: 'Cebuano', code: 'ceb'},
    {name: 'Chichewa', code: 'ny'},
    {name: 'Chinese', code: 'zh-CN'},
    {name: 'Chinese (Simplified)', code: 'zh-CN'},
    {name: 'Chinese (Traditional)', code: 'zh-TW'},
    {name: 'Creole', code: 'ht'},
    {name: 'Croatian', code: 'hr'},
    {name: 'Czech', code: 'cs'},
    {name: 'Danish', code: 'da'},
    {name: 'Dutch', code: 'nl'},
    {name: 'English', code: 'en'},
    {name: 'Esperanto', code: 'eo'},
    {name: 'Estonian', code: 'et'},
    {name: 'Filipino', code: 'tl'},
    {name: 'Finnish', code: 'fi'},
    {name: 'French', code: 'fr'},
    {name: 'Galician', code: 'gl'},
    {name: 'Georgian', code: 'ka'},
    {name: 'German', code: 'de'},
    {name: 'Greek', code: 'el'},
    {name: 'Gujarati', code: 'gu'},
    {name: 'Haitian Creole', code: 'ht'},
    {name: 'Hausa', code: 'ha'},
    {name: 'Hebrew', code: 'iw'},
    {name: 'Hindi', code: 'hi'},
    {name: 'Hmong', code: 'hmn'},
    {name: 'Hungarian', code: 'hu'},
    {name: 'Farsi', code: 'fa'},
    {name: 'Icelandic', code: 'is'},
    {name: 'Igbo', code: 'ig'},
    {name: 'Indonesian', code: 'id'},
    {name: 'Irish', code: 'ga'},
    {name: 'Italian', code: 'it'},
    {name: 'Japanese', code: 'ja'},
    {name: 'Javanese', code: 'jw'},
    {name: 'Kannada', code: 'kn'},
    {name: 'Kazakh', code: 'kk'},
    {name: 'Khmer', code: 'km'},
    {name: 'Korean', code: 'ko'},
    {name: 'Lao', code: 'lo'},
    {name: 'Latin', code: 'la'},
    {name: 'Latvian', code: 'lv'},
    {name: 'Lithuanian', code: 'lt'},
    {name: 'Macedonian', code: 'mk'},
    {name: 'Malagasy', code: 'mg'},
    {name: 'Malay', code: 'ms'},
    {name: 'Malayalam', code: 'ml'},
    {name: 'Maltese', code: 'mt'},
    {name: 'Maori', code: 'mi'},
    {name: 'Marathi', code: 'mr'},
    {name: 'Mongolian', code: 'mn'},
    {name: 'Myanmar', code: 'my'},
    {name: 'Nepali', code: 'ne'},
    {name: 'Norwegian', code: 'no'},
    {name: 'Persian', code: 'fa'},
    {name: 'Polish', code: 'pl'},
    {name: 'Portuguese', code: 'pt'},
    {name: 'Punjabi', code: 'pa'},
    {name: 'Romanian', code: 'ro'},
    {name: 'Russian', code: 'ru'},
    {name: 'Serbian', code: 'sr'},
    {name: 'Sesotho', code: 'st'},
    {name: 'Simplified Chinese', code: 'zh-CN'},
    {name: 'Sinhala', code: 'si'},
    {name: 'Slovak', code: 'sk'},
    {name: 'Slovenian', code: 'sl'},
    {name: 'Somali', code: 'so'},
    {name: 'Spanish', code: 'es'},
    {name: 'Sundanese', code: 'su'},
    {name: 'Swahili', code: 'sw'},
    {name: 'Swedish', code: 'sv'},
    {name: 'Tajik', code: 'tg'},
    {name: 'Tamil', code: 'ta'},
    {name: 'Telugu', code: 'te'},
    {name: 'Traditional Chinese', code: 'zh-TW'},
    {name: 'Thai', code: 'th'},
    {name: 'Turkish', code: 'tr'},
    {name: 'Ukrainian', code: 'uk'},
    {name: 'Urdu', code: 'ur'},
    {name: 'Uzbek', code: 'uz'},
    {name: 'Vietnamese', code: 'vi'},
    {name: 'Welsh', code: 'cy'},
    {name: 'Yiddish', code: 'yi'},
    {name: 'Yoruba', code: 'yo'},
    {name: 'Zulu', code: 'zu'} 
  ]
}

class Language extends Phrase {
  observe () {
    return <Languages />
  }

  describe () {
    const sourceItems = _.map(this.source.data, ({name, code}) => ({
      text: name,
      value: {name, code}
    }))

    return (
      <label text='language'>
        <list limit={10} items={sourceItems} />
      </label>
    )
  }
}

function andify (array, separator = ',') {
  if (array.length === 1) {
    return {text: array[0].name, argument: 'language'}
  } else {
    return _.chain(array)
      .slice(0, -2)
      .map(item => [{text: item.name, argument: 'language'}, {text: ', '}])
      .flatten()
      .concat({text: _.slice(array, -2, -1)[0].name, argument: 'language'})
      .concat({text: ' and '})
      .concat({text: _.slice(array, -1)[0].name, argument: 'language'})
      .value()
  }
}

class CommandObject {
  constructor ({
      to = [{name: 'English', code: 'en'}],
      from = {name: 'an automatically detected language', code: 'auto'},
      phrase,
      url}) {
    this.to = to
    this.from = from
    this.phrase = phrase
    this.url = url
  }

  _demoExecute () {
    let result

    if (this.to.length === 1) {
      if (this.phrase) {
        result = [
          {text: 'a Google translation of '},
          {text: this.phrase, argument: 'phrase'}
        ]
      } else if (this.url) {
        result = [
          {text: 'version of '},
          {text: this.url, argument: 'url'},
          {text: ' Google translated'}
        ]
      }
    } else {
      if (this.phrase) {
        result = [
          {text: 'Google translations of '},
          {text: this.phrase, argument: 'phrase'}
        ]
      } else if (this.url) {
        result = [
          {text: 'Google translated versions of '},
          {text: this.url, argument: 'url'}
        ]
      }
    }

    return _.flatten([
      {text: 'open ', category: 'action'},
      result,
      {text: ' from '},
      {text: this.from.name, argument: 'language'},
      {text: ' to '},
      andify(this.to),
      {text: ' in '},
      {text: 'the default browser', argument: 'application'}
    ])
  }

  execute () {
    _.forEach(this.to, (to) => {
      let url
      if (this.phrase) {
        url = `https://translate.google.com/#${this.from.code}/${to.code}/${encodeURIComponent(this.phrase)}`
      } else if (this.url) {
        url = `https://translate.google.com/translate?sl=${this.from.code}&tl=${to.code}&u=${encodeURIComponent(this.url)}`
      }

      openURL({url})
    })
  }
}

export class Translate extends Phrase {
  static extends = [Command]

  describe () {
    return (
      <map function={result => new CommandObject(result)}>
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
      </map>
    )
  }
}

export const extensions = [Translate]

import _ from 'lodash'

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

export default function demoExecute (result) {
  let message
  result = _.defaults({}, result, {
    to: [{name: 'English', code: 'en'}],
    from: {name: 'an automatically detected language', code: 'auto'}
  })
  
  if (result.to.length === 1) {
    if (result.phrase) {
      message = [
        {text: 'a Google translation of '},
        {text: result.phrase, argument: 'phrase'}
      ]
    } else if (result.url) {
      message = [
        {text: 'version of '},
        {text: result.url, argument: 'url'},
        {text: ' Google translated'}
      ]
    }
  } else {
    if (result.phrase) {
      message = [
        {text: 'Google translations of '},
        {text: result.phrase, argument: 'phrase'}
      ]
    } else if (result.url) {
      message = [
        {text: 'Google translated versions of '},
        {text: result.url, argument: 'url'}
      ]
    }
  }

  return _.flatten([
    {text: 'open ', category: 'action'},
    message,
    {text: ' from '},
    {text: result.from.name, argument: 'language'},
    {text: ' to '},
    andify(result.to),
    {text: ' in '},
    {text: 'the default browser', argument: 'application'}
  ])
}
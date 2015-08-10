/* global describe, it */

var assert = require('assert')
var typeforce = require('../src')

var generate = require('./__generate')
var fixtures = require('./fixtures')

describe('typeforce', function () {
  fixtures.valid.forEach(function (f) {
    var type = generate.types[f.typeId] || f.type
    var value = generate.values[f.valueId] || f.value
    var typeDescription = JSON.stringify(type)
    var valueDescription = JSON.stringify(value)

    it('passes ' + typeDescription + ' with ' + valueDescription, function () {
      typeforce(type, value, f.strict)
    })

    it('passes ' + typeDescription + ' (compiled) with ' + valueDescription, function () {
      typeforce(typeforce.compile(type), value, f.strict)
    })
  })

  fixtures.invalid.forEach(function (f) {
    assert(f.exception)
    var type = generate.types[f.typeId] || f.type
    var value = generate.values[f.valueId] || f.value
    var typeDescription = JSON.stringify(type)
    var valueDescription = JSON.stringify(value)
    var exception = f.exception.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$&')

    it('throws "' + exception + '" for type ' + typeDescription + ' with value of ' + valueDescription, function () {
      assert.throws(function () {
        typeforce(type, value, f.strict)
      }, new RegExp(exception))
    })

    it('throws "' + exception + '" for (compiled) type ' + typeDescription + ' with value of ' + valueDescription, function () {
      assert.throws(function () {
        typeforce(typeforce.compile(type), value, f.strict)
      }, new RegExp(exception))
    })
  })
})

describe('typeforce.compile', function () {
  fixtures.valid.forEach(function (f) {
    var type = generate.types[f.typeId] || f.type
    var typeDescription = JSON.stringify(type)

    it('when compiled with ' + typeDescription + ', toJSON\'s the same', function () {
      assert.equal(JSON.stringify(typeforce.compile(type)), typeDescription)
    })
  })
})

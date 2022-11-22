import { shapeOptions } from './Shape'
import Effect from './Effect'
import { scale, rotate, circle } from '../common/geometry'
import { evaluate } from 'mathjs'

const options = {
  ...shapeOptions,
  ...{
    numLoops: {
      title: 'Number of loops',
      min: 1
    },
    transformMethod: {
      title: 'When transforming shape',
      type: 'togglebutton',
      choices: ['smear', 'intact'],
    },
    growEnabled: {
      title: 'Scale',
      type: 'checkbox',
    },
    growValue: {
      title: 'Scale (+/-)',
    },
    growMethod: {
      title: 'Scale by',
      type: 'togglebutton',
      choices: ['constant', 'function']
    },
    growMathInput: {
      title: 'Scale function (i)',
      type: 'text',
      isVisible: state => { return state.growMethod === 'function' },
    },
    growMath: {
      isVisible: state => { return false }
    },
    spinEnabled: {
      title: 'Spin',
      type: 'checkbox'
    },
    spinValue: {
      title: 'Spin (+/-)',
      step: 0.1,
    },
    spinMethod: {
      title: 'Spin by',
      type: 'togglebutton',
      choices: ['constant', 'function']
    },
    spinMathInput: {
      title: 'Spin function (i)',
      type: 'text',
      isVisible: state => { return state.spinMethod === 'function' },
    },
    spinMath: {
      isVisible: state => { return false }
    },
    spinSwitchbacks: {
      title: 'Switchbacks',
      isVisible: state => { return state.spinMethod === 'constant'},
    },
  }
}

export default class Loop extends Effect {
  constructor() {
    super('Loop')
  }

  getInitialState() {
    return {
      ...super.getInitialState(),
      ...{
        // Inherited
        type: 'loop',
        selectGroup: 'effects',
        canTransform: false,
        canChangeSize: false,
        canRotate: false,
        canMove: false,
        effect: true,

        // Loop Options
        transformMethod: 'smear',
        numLoops: 10,

        // Grow options
        growEnabled: true,
        growValue: 100,
        growMethod: 'constant',
        growMathInput: 'i+cos(i/2)',
        growMath: 'i+cos(i/2)',

        // Spin Options
        spinEnabled: false,
        spinValue: 2,
        spinMethod: 'constant',
        spinMathInput: '10*sin(i/4)',
        spinMath: '10*sin(i/4)',
        spinSwitchbacks: 0,
      }
    }
  }

  getVertices(state) {
    // TODO Make this more reasonable
    return circle(25)
  }

  applyEffect(effect, layer, vertices) {

    let outputVertices = []

    for (var i=0; i<effect.numLoops; i++) {
      for (var j=0; j<vertices.length; j++) {
        let transformedVertex = vertices[j]
        let amount = effect.transformMethod === 'smear' ? i + j/vertices.length : i

        if (effect.growEnabled) {
          let growAmount = 100
          if (effect.growMethod === 'function') {
            try {
              growAmount = effect.growValue * evaluate(effect.growMath, {i: amount})
            }
            catch (err) {
              console.log("Error parsing grow function: " + err)
              growAmount = 200
            }
          } else {
            growAmount = 100.0 + (effect.growValue * amount)
          }

          // Actually do the growing
          transformedVertex = scale(transformedVertex, growAmount)
        }

        if (effect.spinEnabled) {
          let spinAmount = 0
          if (effect.spinMethod === 'function') {
            try {
              spinAmount = effect.spinValue * evaluate(effect.spinMath, {i: amount})
            }
            catch (err) {
              console.log("Error parsing spin function: " + err)
              spinAmount = 0
            }
          } else {
            const loopPeriod = effect.numLoops / (parseInt(effect.spinSwitchbacks) + 1)
            const stage = amount/loopPeriod
            const direction = (stage % 2 < 1 ? 1.0 : -1.0)
            spinAmount = direction * (amount % loopPeriod) * effect.spinValue
            // Add in the amount it goes positive to the negatives, so they start at the same place.
            if (direction < 0.0) {
              spinAmount += loopPeriod * effect.spinValue
            }
          }
          transformedVertex = rotate(transformedVertex, spinAmount)
        }

        outputVertices.push(transformedVertex)
      }
    }

    return outputVertices
  }

  getOptions() {
    return options
  }
}

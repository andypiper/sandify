import React, { Component } from 'react'
import Select from 'react-select'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap'
import { connect } from 'react-redux'

import { registeredModels, getShapeSelectOptions, getModelFromType } from '../../config/models'
import { addLayer } from '../layers/layersSlice'

// Initialize these from local storage, or reasonable defaults
let initialLayerType = localStorage.getItem('currentShape') || 'polygon'
if (initialLayerType === 'undefined') {
  initialLayerType = 'polygon'
}
const initialLayerName = getModelFromType(initialLayerType).type.toLowerCase()

const customStyles = {
  control: base => ({
    ...base,
    height: 55,
    minHeight: 55
  })
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectOptions: getShapeSelectOptions(),
    showModal: ownProps.showModal
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLayerAdded: (type, name) => {
      const state = registeredModels[type].getInitialState()
      state.name = name
      dispatch(addLayer(state))
    },
    toggleModal: () => {
      ownProps.toggleModal()
    }
  }
}

class NewLayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newLayerType: initialLayerType,
      newLayerName: initialLayerName,
    }
  }

  render() {
    const {
      toggleModal, showModal, selectOptions, onLayerAdded
    } = this.props
    const selectedShape = getModelFromType(this.state.newLayerType)
    const selectedOption = { value: selectedShape.id, label: selectedShape.type }

    return <Modal
      show={showModal}
      onHide={toggleModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create new layer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="align-items-center">
          <Col sm={5}>
            Type
          </Col>
          <Col sm={7}>
            <Select
              value={selectedOption}
              onChange={this.onChangeNewType.bind(this)}
              styles={customStyles}
              maxMenuHeight={305}
              options={selectOptions} />
          </Col>
        </Row>
        <Row className="align-items-center mt-2">
          <Col sm={5}>
            Name
          </Col>
          <Col sm={7}>
            <Form.Control
              value={this.state.newLayerName}
              onFocus={this.handleNameFocus}
              onChange={this.onChangeNewName.bind(this)}
            />
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          id="new-layer-close"
          variant="light"
          onClick={toggleModal}
        >
          Cancel
        </Button>
        <Button
          id="new-layer-add"
          variant="primary"
          onClick={() => {
            onLayerAdded(this.state.newLayerType, this.state.newLayerName)
            toggleModal()
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  }

  handleNameFocus(event) {
    event.target.select()
  }

  onChangeNewType(selected) {
    const shape = getModelFromType(selected.value)
    this.setState(
      {
        newLayerType: selected.value,
        newLayerName: shape.type.toLowerCase()
      })
  }
  onChangeNewName(event) {
    this.setState(
      {
        newLayerName: event.target.value
      })
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(NewLayer)

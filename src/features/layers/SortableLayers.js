import React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Button, ListGroup } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const SortableLayer = SortableElement((
  {
    active,
    numLayers,
    layer,
    onLayerSelected,
    onEffectMoved,
    onToggleLayerOpen,
    onToggleLayerVisible
  }) => {
    const { name, id, visible } = layer
    const activeClass = active ? 'active' : ''
    const dragClass = numLayers > 1 ? 'cursor-move' : ''
    const visibleClass = visible ? '' : 'layer-hidden'

    return <ListGroup.Item
      className={[activeClass, dragClass,  visibleClass, 'layer p-0'].join(' ')}
      key={id}
      id={id}
    >
      <div
        className={[`layer-${activeClass}`, 'd-flex align-items-center'].join(' ')}
        onClick={onLayerSelected}
      >
        <div className="layer-left">
          <Button
            className="layer-button"
            variant="light"
            data-id={id}
            onClick={onToggleLayerVisible.bind(this, id)}
          >
            {visible && <FaEye size="0.8em" />}
            {!visible && <FaEyeSlash size="0.8em" />}
          </Button>
        </div>

        <div className="no-select">
           {name}
        </div>
      </div>
    </ListGroup.Item>
  }
)

const SortableLayers = SortableContainer((props) => {
  const {
    layers,
    currentLayer,
    ...other
  } = props

  return (
    <ListGroup
      variant="flush"
      style={{maxHeight: "240px"}}
      className="border overflow-auto"
      id="playlist-group"
    >
      {layers.map((layer, index) => {
        return (
          <SortableLayer
            key={layer.id}
            id={layer.id}
            index={index}
            active={currentLayer.id === layer.id}
            layer={layer}
            {...other}
          />
        )
      })}
    </ListGroup>
  )
})

export default SortableLayers

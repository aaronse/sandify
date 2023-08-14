import React, { useState } from "react"
import { Button } from "react-bootstrap"
import { Tooltip } from "react-tooltip"
import { useSelector, useDispatch } from "react-redux"
import { Card, Accordion } from "react-bootstrap"
import { FaTrash, FaCopy, FaPlusSquare } from "react-icons/fa"
import {
  selectSelectedLayer,
  deleteEffect,
  selectLayerEffects,
} from "@/features/layers/layersSlice"
import { selectCurrentEffect } from "./effectsSlice"
import EffectEditor from "./EffectEditor"
import EffectList from "./EffectList"
import NewEffect from "./NewEffect"

const EffectManager = () => {
  const dispatch = useDispatch()
  const selectedLayer = useSelector(selectSelectedLayer)
  const currentEffect = useSelector(selectCurrentEffect)
  const effects = useSelector((state) =>
    selectLayerEffects(state, selectedLayer.id),
  )
  const numEffects = effects.length
  const [showNewEffect, setShowNewEffect] = useState(false)
  const toggleNewEffectModal = () => setShowNewEffect(!showNewEffect)

  const handleEffectDeleted = (id) => {
    dispatch(
      deleteEffect({
        id: selectedLayer.id,
        effectId: currentEffect.id,
      }),
    )
  }

  return (
    <div>
      <NewEffect
        showModal={showNewEffect}
        toggleModal={toggleNewEffectModal}
      />

      {numEffects == 0 && (
        <Button
          className="mt-3"
          variant="secondary"
          onClick={toggleNewEffectModal}
        >
          Add effect
        </Button>
      )}
      {numEffects > 0 && (
        <Accordion
          key={3}
          defaultActiveKey={3}
          className="mt-3"
        >
          <Card>
            <Card.Header className="d-flex">
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey={3}
              >
                Effects
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={3}>
              <Card.Body className="p-0">
                <EffectList
                  effects={effects}
                  currentEffect={currentEffect}
                  selectedLayer={selectedLayer}
                />
                <div className="d-flex align-items-center border-left border-right border-bottom">
                  <Tooltip id="tooltip-new-effect" />
                  <Button
                    className="ml-2 layer-button"
                    variant="light"
                    size="sm"
                    data-tooltip-content="Create new effect"
                    data-tooltip-id="tooltip-new-layer"
                    onClick={toggleNewEffectModal}
                  >
                    <FaPlusSquare />
                  </Button>
                  <div className="ml-auto">
                    <Tooltip id="tooltip-delete-effect" />
                    <Button
                      className="layer-button"
                      variant="light"
                      data-tooltip-content="Delete effect"
                      data-tooltip-id="tooltip-delete-layer"
                      onClick={handleEffectDeleted}
                    >
                      <FaTrash />
                    </Button>
                    <Tooltip id="tooltip-copy-effect" />
                    <Button
                      className="layer-button"
                      variant="light"
                      data-tip="Copy effect"
                      data-tooltip-content="Copy effect"
                      data-tooltip-id="tooltip-copy-layer"
                      // onClick={toggleCopyEffect}
                    >
                      <FaCopy />
                    </Button>
                  </div>
                </div>
                <div className="px-3 pb-3 pt-2">
                  <EffectEditor />
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )}
    </div>
  )
}

export default EffectManager

import React, { useState, useEffect } from "react"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import debounce from "lodash/debounce"

const InputOption = ({
  data,
  options,
  optionKey,
  onChange,
  model,
  inputRef,
  focusOnSelect = false,
  label = true,
}) => {
  const [value, setValue] = useState(data[optionKey])

  useEffect(() => {
    setValue(data[optionKey])
  }, [data, optionKey])

  const option = options[optionKey]
  const { delayKey } = option
  const optionType = option.type || "number"
  const minimum =
    typeof option.min === "function" ? option.min(data) : parseFloat(option.min)
  const maximum =
    typeof option.max === "function" ? option.max(data) : parseFloat(option.max)
  const visible =
    option.isVisible === undefined ? true : option.isVisible(model, data)
  const title =
    typeof option.title === "function"
      ? option.title(model, data)
      : option.title
  const inputWidth = optionType === "text" ? "auto" : "132px"

  if (!visible) {
    return null
  }

  const delayedSet = debounce((value, key, onChange) => {
    let attrs = {}
    attrs[key] = value
    onChange(attrs)
  }, 1500)

  const handleChange = (event) => {
    let newValue = event.target.value

    if (optionType === "number") {
      newValue = newValue === "" ? "" : parseFloat(newValue)
    }

    setValue(newValue)

    let attrs = {}
    attrs[optionKey] = newValue

    if (option.onChange !== undefined) {
      attrs = option.onChange(model, attrs, data)
    }
    onChange(attrs)

    if (delayKey) {
      delayedSet(newValue, delayKey, onChange)
    }
  }

  const handleFocus = (event) => {
    if (focusOnSelect) {
      event.target.select()
    }
  }

  const renderedInput = (
    <Form.Control
      as={optionType === "textarea" ? "textarea" : "input"}
      name={`option-${optionKey}`}
      type={optionType}
      step={option.step ? option.step : 1}
      min={!isNaN(minimum) ? minimum : ""}
      max={!isNaN(maximum) ? maximum : ""}
      value={value}
      autoComplete="off"
      ref={inputRef}
      plaintext={option.plainText}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  )
  if (!option.inline) {
    return (
      <Row className={"align-items-center" + (visible ? "" : " d-none")}>
        <Col
          sm={5}
          className="mb-1"
        >
          {label && (
            <Form.Label
              htmlFor={`option-${optionKey}`}
              className="mb-0"
            >
              {title}
            </Form.Label>
          )}
        </Col>
        <Col
          sm={7}
          className="mb-1"
        >
          <div style={{ width: inputWidth }}>{renderedInput}</div>
        </Col>
      </Row>
    )
  } else {
    return (
      <div className="d-flex align-items-center">
        {label && (
          <Form.Label
            htmlFor={`option-${optionKey}`}
            className="me-2 mb-0"
            style={{ width: "22px" }}
          >
            {title}
          </Form.Label>
        )}
        {renderedInput}
      </div>
    )
  }
}
export default InputOption

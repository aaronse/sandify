import Exporter from './Exporter'
import { path } from 'd3'

export default class SvgExporter extends Exporter {
  constructor(props) {
    super(props)
    this.fileExtension = '.svg'
    this.label = 'SVG'
    this.indentLevel = 2
  }

  exportCode(vertices) {
    var centeredVertices = vertices.map( (vertex) => {
      return {
        ...vertex,
        x: vertex.x + this.props.width / 2,
        y: this.props.height - (vertex.y + this.props.height / 2),
      }
    })

    let svg = path()
    if (centeredVertices.length > 0) {
      const firstPoint = centeredVertices[0]
      svg.moveTo(firstPoint.x, firstPoint.y)
    }
    centeredVertices.forEach(vertex => svg.lineTo(vertex.x, vertex.y))
    this.line("    <desc>pwidth:" + this.props.width + ";pheight:" + this.props.height + ";</desc>")
    this.line("    <path stroke=\"#000000\" stroke-width=\"0.4mm\" fill=\"none\" d=\"" + svg.toString() + "\"/>")
  }

  header() {
    this.line("<?xml version=\"1.0\" standalone=\"no\"?>")
    this.line("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">")
    this.line("<svg width=\"" + this.props.width + "\"" +
                  " height=\"" + this.props.height + "\"" +
                  " title=\"polygons\"" +
                  " version=\"1.1\"" +
                  " viewBox=\"0 0 " + this.props.width + " " + this.props.height + "\"" +
                  " xmlns=\"http://www.w3.org/2000/svg\"" +
                  " class=\"svg-paper\">")

    this.line("  <g>")
  }

  footer() {
    this.line("  </g>")
    this.line("</svg>")
  }

  line(content='', add=true) {
    if (add) {
      let padding = ''
      if (this.commenting) {
        padding = ''
        for (let i=0; i<this.indentLevel; i++) {
          padding += '  '
        }
        if (content) {
          this.lines.push(padding + "<!-- " + content + " -->")
        } else {
          this.lines.push("")
        }
      } else {
        this.lines.push(content)
      }
    }
  }
}

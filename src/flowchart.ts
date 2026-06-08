import type { Direction, NodeShape, ArrowType, NodeConfig, EdgeConfig, SubgraphConfig } from './types'

const SHAPE_WRAP: Record<NodeShape, [string, string]> = {
  box: ['[', ']'],
  round: ['(', ')'],
  stadium: ['([', '])'],
  cylinder: ['[(', ')]'],
  circle: ['((', '))'],
  diamond: ['{', '}'],
  hexagon: ['{{', '}}'],
}

export class Flowchart {
  private direction: Direction = 'TB'
  private nodes: NodeConfig[] = []
  private edges: EdgeConfig[] = []
  private subgraphs: SubgraphConfig[] = []
  private styles: Map<string, string> = new Map()

  static create(direction: Direction = 'TB'): Flowchart {
    const f = new Flowchart()
    f.direction = direction
    return f
  }

  node(id: string, label?: string, shape: NodeShape = 'box'): this {
    this.nodes.push({ id, label: label ?? id, shape })
    return this
  }

  styledNode(id: string, label: string, shape: NodeShape, style: NonNullable<NodeConfig['style']>): this {
    this.nodes.push({ id, label, shape, style })
    const parts: string[] = []
    if (style.fill) parts.push(`fill:${style.fill}`)
    if (style.stroke) parts.push(`stroke:${style.stroke}`)
    if (style.color) parts.push(`color:${style.color}`)
    if (parts.length) this.styles.set(id, parts.join(','))
    return this
  }

  edge(from: string, to: string, arrow: ArrowType = '-->', label?: string): this {
    this.edges.push({ from, to, arrow, label })
    return this
  }

  subgraph(id: string, label: string, nodes: string[]): this {
    this.subgraphs.push({ id, label, nodes })
    return this
  }

  render(): string {
    const lines: string[] = [`graph ${this.direction}`]

    for (const node of this.nodes) {
      const [open, close] = SHAPE_WRAP[node.shape]
      lines.push(`    ${node.id}${open}"${node.label}"${close}`)
    }

    for (const edge of this.edges) {
      const label = edge.label ? `|"${edge.label}"|` : ''
      lines.push(`    ${edge.from} ${edge.arrow}${label} ${edge.to}`)
    }

    for (const sg of this.subgraphs) {
      lines.push(`    subgraph ${sg.id}["${sg.label}"]`)
      for (const nodeId of sg.nodes) {
        lines.push(`        ${nodeId}`)
      }
      lines.push(`    end`)
    }

    for (const [id, style] of this.styles) {
      lines.push(`    style ${id} ${style}`)
    }

    return lines.join('\n')
  }

  toMarkdown(): string {
    return '```mermaid\n' + this.render() + '\n```'
  }
}

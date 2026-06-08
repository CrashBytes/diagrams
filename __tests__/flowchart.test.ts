import { describe, it, expect } from 'vitest'
import { Flowchart } from '../src'

describe('Flowchart', () => {
  it('creates a simple flowchart', () => {
    const result = Flowchart.create('TB')
      .node('A', 'Start')
      .node('B', 'End')
      .edge('A', 'B')
      .render()

    expect(result).toContain('graph TB')
    expect(result).toContain('A["Start"]')
    expect(result).toContain('B["End"]')
    expect(result).toContain('A --> B')
  })

  it('supports different directions', () => {
    expect(Flowchart.create('LR').render()).toContain('graph LR')
  })

  it('supports node shapes', () => {
    const result = Flowchart.create()
      .node('A', 'Round', 'round')
      .node('B', 'Diamond', 'diamond')
      .node('C', 'Stadium', 'stadium')
      .node('D', 'Circle', 'circle')
      .node('E', 'Cylinder', 'cylinder')
      .node('F', 'Hexagon', 'hexagon')
      .render()

    expect(result).toContain('A("Round")')
    expect(result).toContain('B{"Diamond"}')
    expect(result).toContain('C(["Stadium"])')
    expect(result).toContain('D(("Circle"))')
    expect(result).toContain('E[("Cylinder")]')
    expect(result).toContain('F{{"Hexagon"}}')
  })

  it('supports edge labels', () => {
    const result = Flowchart.create()
      .node('A', 'A')
      .node('B', 'B')
      .edge('A', 'B', '-->', 'yes')
      .render()

    expect(result).toContain('A -->|"yes"| B')
  })

  it('supports different arrow types', () => {
    const result = Flowchart.create()
      .edge('A', 'B', '---')
      .edge('A', 'C', '-..->')
      .edge('A', 'D', '==>')
      .render()

    expect(result).toContain('A --- B')
    expect(result).toContain('A -..-> C')
    expect(result).toContain('A ==> D')
  })

  it('supports subgraphs', () => {
    const result = Flowchart.create()
      .node('A', 'A')
      .node('B', 'B')
      .subgraph('sg1', 'My Group', ['A', 'B'])
      .render()

    expect(result).toContain('subgraph sg1["My Group"]')
    expect(result).toContain('end')
  })

  it('supports styled nodes', () => {
    const result = Flowchart.create()
      .styledNode('A', 'Styled', 'box', { fill: '#f00', stroke: '#000', color: '#fff' })
      .render()

    expect(result).toContain('style A fill:#f00,stroke:#000,color:#fff')
  })

  it('renders to markdown', () => {
    const result = Flowchart.create()
      .node('A', 'Start')
      .toMarkdown()

    expect(result).toMatch(/^```mermaid\n/)
    expect(result).toMatch(/\n```$/)
  })

  it('defaults node label to id', () => {
    const result = Flowchart.create().node('MyNode').render()
    expect(result).toContain('MyNode["MyNode"]')
  })
})

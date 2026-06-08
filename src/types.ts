export type Direction = 'TB' | 'BT' | 'LR' | 'RL'
export type NodeShape = 'box' | 'round' | 'stadium' | 'cylinder' | 'circle' | 'diamond' | 'hexagon'
export type ArrowType = '-->' | '---' | '-..->' | '==>' | '--o' | '--x'
export type LineStyle = 'solid' | 'dotted' | 'thick'

export interface NodeConfig {
  id: string
  label: string
  shape: NodeShape
  style?: { fill?: string; stroke?: string; color?: string }
}

export interface EdgeConfig {
  from: string
  to: string
  arrow: ArrowType
  label?: string
}

export interface SubgraphConfig {
  id: string
  label: string
  nodes: string[]
}

export interface SequenceParticipant {
  id: string
  label?: string
  type: 'participant' | 'actor'
}

export type SequenceArrow = '->>' | '-->>' | '->' | '-->'

export interface SequenceMessage {
  from: string
  to: string
  arrow: SequenceArrow
  text: string
}

export interface SequenceNote {
  position: 'over' | 'left of' | 'right of'
  participant: string
  text: string
}

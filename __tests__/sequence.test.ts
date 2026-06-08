import { describe, it, expect } from 'vitest'
import { Sequence } from '../src'

describe('Sequence', () => {
  it('creates a simple sequence diagram', () => {
    const result = Sequence.create()
      .participant('A', 'Alice')
      .participant('B', 'Bob')
      .message('A', 'B', 'Hello')
      .reply('B', 'A', 'Hi')
      .render()

    expect(result).toContain('sequenceDiagram')
    expect(result).toContain('participant A as Alice')
    expect(result).toContain('A->>B: Hello')
    expect(result).toContain('B-->>A: Hi')
  })

  it('supports title', () => {
    const result = Sequence.create('My Diagram').render()
    expect(result).toContain('title My Diagram')
  })

  it('supports actors', () => {
    const result = Sequence.create()
      .actor('U', 'User')
      .render()
    expect(result).toContain('actor U as User')
  })

  it('supports notes', () => {
    const result = Sequence.create()
      .participant('A')
      .note('over', 'A', 'Important')
      .render()
    expect(result).toContain('Note over A: Important')
  })

  it('supports activate/deactivate', () => {
    const result = Sequence.create()
      .participant('A')
      .participant('B')
      .activate('B')
      .message('A', 'B', 'Request')
      .deactivate('B')
      .render()

    expect(result).toContain('activate B')
    expect(result).toContain('deactivate B')
  })

  it('supports loop blocks', () => {
    const result = Sequence.create()
      .participant('A')
      .participant('B')
      .loop('Every minute', (s) => {
        s.message('A', 'B', 'ping')
      })
      .render()

    expect(result).toContain('loop Every minute')
    expect(result).toContain('A->>B: ping')
    expect(result).toContain('end')
  })

  it('supports alt/else blocks', () => {
    const result = Sequence.create()
      .participant('A')
      .participant('B')
      .alt('Success', (s) => {
        s.message('A', 'B', 'OK')
        s.elseBlock('Failure', (s2) => {
          s2.message('A', 'B', 'Error')
        })
      })
      .render()

    expect(result).toContain('alt Success')
    expect(result).toContain('else Failure')
    expect(result).toContain('end')
  })

  it('renders to markdown', () => {
    const result = Sequence.create()
      .participant('A')
      .toMarkdown()

    expect(result).toMatch(/^```mermaid\n/)
    expect(result).toMatch(/\n```$/)
  })

  it('participant without label', () => {
    const result = Sequence.create()
      .participant('Alice')
      .render()
    expect(result).toContain('participant Alice')
    expect(result).not.toContain(' as ')
  })

  it('supports different arrow types', () => {
    const result = Sequence.create()
      .message('A', 'B', 'sync', '->')
      .message('A', 'B', 'async', '->>')
      .message('A', 'B', 'dashed', '-->')
      .message('A', 'B', 'dashedAsync', '-->>')
      .render()

    expect(result).toContain('A->B: sync')
    expect(result).toContain('A->>B: async')
    expect(result).toContain('A-->B: dashed')
    expect(result).toContain('A-->>B: dashedAsync')
  })
})

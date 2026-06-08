import type { SequenceParticipant, SequenceArrow, SequenceMessage, SequenceNote } from './types'

type SequenceEntry =
  | { type: 'message'; data: SequenceMessage }
  | { type: 'note'; data: SequenceNote }
  | { type: 'activate'; participant: string }
  | { type: 'deactivate'; participant: string }
  | { type: 'loop'; label: string; start: true }
  | { type: 'loop'; start: false }
  | { type: 'alt'; label: string; start: true }
  | { type: 'else'; label: string }
  | { type: 'alt'; start: false }

export class Sequence {
  private title?: string
  private participants: SequenceParticipant[] = []
  private entries: SequenceEntry[] = []

  static create(title?: string): Sequence {
    const s = new Sequence()
    s.title = title
    return s
  }

  participant(id: string, label?: string): this {
    this.participants.push({ id, label, type: 'participant' })
    return this
  }

  actor(id: string, label?: string): this {
    this.participants.push({ id, label, type: 'actor' })
    return this
  }

  message(from: string, to: string, text: string, arrow: SequenceArrow = '->>'): this {
    this.entries.push({ type: 'message', data: { from, to, text, arrow } })
    return this
  }

  reply(from: string, to: string, text: string): this {
    this.entries.push({ type: 'message', data: { from, to, text, arrow: '-->>' } })
    return this
  }

  note(position: SequenceNote['position'], participant: string, text: string): this {
    this.entries.push({ type: 'note', data: { position, participant, text } })
    return this
  }

  activate(participant: string): this {
    this.entries.push({ type: 'activate', participant })
    return this
  }

  deactivate(participant: string): this {
    this.entries.push({ type: 'deactivate', participant })
    return this
  }

  loop(label: string, buildFn: (seq: this) => void): this {
    this.entries.push({ type: 'loop', label, start: true })
    buildFn(this)
    this.entries.push({ type: 'loop', start: false })
    return this
  }

  alt(label: string, buildFn: (seq: this) => void): this {
    this.entries.push({ type: 'alt', label, start: true })
    buildFn(this)
    this.entries.push({ type: 'alt', start: false })
    return this
  }

  elseBlock(label: string, buildFn: (seq: this) => void): this {
    this.entries.push({ type: 'else', label })
    buildFn(this)
    return this
  }

  render(): string {
    const lines: string[] = ['sequenceDiagram']

    if (this.title) {
      lines.push(`    title ${this.title}`)
    }

    for (const p of this.participants) {
      const label = p.label ? ` as ${p.label}` : ''
      lines.push(`    ${p.type} ${p.id}${label}`)
    }

    for (const entry of this.entries) {
      switch (entry.type) {
        case 'message':
          lines.push(`    ${entry.data.from}${entry.data.arrow}${entry.data.to}: ${entry.data.text}`)
          break
        case 'note':
          lines.push(`    Note ${entry.data.position} ${entry.data.participant}: ${entry.data.text}`)
          break
        case 'activate':
          lines.push(`    activate ${entry.participant}`)
          break
        case 'deactivate':
          lines.push(`    deactivate ${entry.participant}`)
          break
        case 'loop':
          lines.push(entry.start ? `    loop ${entry.label}` : `    end`)
          break
        case 'alt':
          lines.push(entry.start ? `    alt ${entry.label}` : `    end`)
          break
        case 'else':
          lines.push(`    else ${entry.label}`)
          break
      }
    }

    return lines.join('\n')
  }

  toMarkdown(): string {
    return '```mermaid\n' + this.render() + '\n```'
  }
}

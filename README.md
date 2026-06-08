# @crashbytes/diagrams

[![npm version](https://img.shields.io/npm/v/@crashbytes/diagrams)](https://www.npmjs.com/package/@crashbytes/diagrams)
[![npm downloads](https://img.shields.io/npm/dm/@crashbytes/diagrams)](https://www.npmjs.com/package/@crashbytes/diagrams)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Programmatic text-to-diagram generation with a fluent TypeScript API. Renders to Mermaid markdown. Zero dependencies.

## Installation

```bash
npm install @crashbytes/diagrams
```

## Features

- Fluent, chainable TypeScript API
- Flowchart diagrams with nodes, edges, subgraphs, and styling
- Sequence diagrams with participants, messages, loops, and alt/else blocks
- Renders to Mermaid-compatible markdown
- Full type safety with TypeScript strict mode
- Zero runtime dependencies
- CJS and ESM support

## Usage

### Flowchart

```typescript
import { Flowchart } from '@crashbytes/diagrams'

const diagram = Flowchart.create('TB')
  .node('A', 'Start', 'stadium')
  .node('B', 'Process', 'box')
  .node('C', 'Decision', 'diamond')
  .node('D', 'End', 'stadium')
  .edge('A', 'B')
  .edge('B', 'C')
  .edge('C', 'D', '-->', 'yes')
  .edge('C', 'B', '-..->', 'no')
  .render()

console.log(diagram)
```

Output:

```
graph TB
    A(["Start"])
    B["Process"]
    C{"Decision"}
    D(["End"])
    A --> B
    B --> C
    C -->|"yes"| D
    C -..->|"no"| B
```

#### Node Shapes

| Shape      | Syntax      | Example          |
|------------|-------------|------------------|
| `box`      | `[text]`    | Rectangle        |
| `round`    | `(text)`    | Rounded          |
| `stadium`  | `([text])`  | Stadium          |
| `cylinder` | `[(text)]`  | Cylinder         |
| `circle`   | `((text))`  | Circle           |
| `diamond`  | `{text}`    | Diamond          |
| `hexagon`  | `{{text}}`  | Hexagon          |

#### Arrow Types

| Type    | Description       |
|---------|-------------------|
| `-->`   | Solid arrow       |
| `---`   | Solid line        |
| `-..->` | Dotted arrow      |
| `==>`   | Thick arrow       |
| `--o`   | Circle end        |
| `--x`   | Cross end         |

#### Styled Nodes

```typescript
Flowchart.create()
  .styledNode('A', 'Important', 'box', { fill: '#f00', stroke: '#000', color: '#fff' })
  .render()
```

#### Subgraphs

```typescript
Flowchart.create()
  .node('A', 'Service A')
  .node('B', 'Service B')
  .subgraph('backend', 'Backend Services', ['A', 'B'])
  .render()
```

#### Markdown Output

```typescript
const markdown = Flowchart.create()
  .node('A', 'Hello')
  .toMarkdown()

// Returns:
// ```mermaid
// graph TB
//     A["Hello"]
// ```
```

### Sequence Diagram

```typescript
import { Sequence } from '@crashbytes/diagrams'

const diagram = Sequence.create('Authentication Flow')
  .participant('C', 'Client')
  .participant('S', 'Server')
  .participant('DB', 'Database')
  .message('C', 'S', 'POST /login')
  .activate('S')
  .message('S', 'DB', 'Query user')
  .reply('DB', 'S', 'User data')
  .alt('Valid credentials', (s) => {
    s.reply('S', 'C', '200 OK + token')
    s.elseBlock('Invalid', (s2) => {
      s2.reply('S', 'C', '401 Unauthorized')
    })
  })
  .deactivate('S')
  .render()
```

Output:

```
sequenceDiagram
    title Authentication Flow
    participant C as Client
    participant S as Server
    participant DB as Database
    C->>S: POST /login
    activate S
    S->>DB: Query user
    DB-->>S: User data
    alt Valid credentials
    S-->>C: 200 OK + token
    else Invalid
    S-->>C: 401 Unauthorized
    end
    deactivate S
```

#### Participants and Actors

```typescript
Sequence.create()
  .actor('U', 'User')        // Stick figure
  .participant('S', 'System') // Box
```

#### Loops

```typescript
Sequence.create()
  .participant('A')
  .participant('B')
  .loop('Every 5s', (s) => {
    s.message('A', 'B', 'heartbeat')
    s.reply('B', 'A', 'ack')
  })
```

#### Notes

```typescript
Sequence.create()
  .participant('A')
  .note('over', 'A', 'This is important')
  .note('right of', 'A', 'Side note')
```

## API Reference

### `Flowchart`

| Method | Description |
|--------|-------------|
| `Flowchart.create(direction?)` | Create a new flowchart (`'TB'`, `'BT'`, `'LR'`, `'RL'`) |
| `.node(id, label?, shape?)` | Add a node |
| `.styledNode(id, label, shape, style)` | Add a styled node |
| `.edge(from, to, arrow?, label?)` | Add an edge |
| `.subgraph(id, label, nodes)` | Add a subgraph |
| `.render()` | Render as Mermaid string |
| `.toMarkdown()` | Render wrapped in markdown code fence |

### `Sequence`

| Method | Description |
|--------|-------------|
| `Sequence.create(title?)` | Create a new sequence diagram |
| `.participant(id, label?)` | Add a participant |
| `.actor(id, label?)` | Add an actor |
| `.message(from, to, text, arrow?)` | Add a message |
| `.reply(from, to, text)` | Add a reply (dashed async arrow) |
| `.note(position, participant, text)` | Add a note |
| `.activate(participant)` | Activate a participant |
| `.deactivate(participant)` | Deactivate a participant |
| `.loop(label, buildFn)` | Add a loop block |
| `.alt(label, buildFn)` | Add an alt block |
| `.elseBlock(label, buildFn)` | Add an else branch (inside alt) |
| `.render()` | Render as Mermaid string |
| `.toMarkdown()` | Render wrapped in markdown code fence |

## License

MIT - see [LICENSE](./LICENSE)

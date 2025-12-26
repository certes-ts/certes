# @certes/ordo

Data-Oriented Design primitives for TypeScript with explicit memory layout control, cache-friendly struct definitions, and high-performance dynamic arrays built on TypedArrays.

## Installation

```bash
npm install @certes/ordo
```

## Overview

`@certes/ordo` provides low-level primitives for building cache-friendly, performance-critical applications in TypeScript.

### Key Features

- **Explicit Memory Layout**: Define structs with C-like memory layout control
- **Automatic Field Alignment**: Handles padding and alignment automatically based on field types
- **Cache-Friendly Structures**: Minimize cache misses through contiguous memory allocation
- **Zero-Copy Views**: Work with data without intermediate object allocation
- **TypedArray Foundation**: Built on JavaScript's native TypedArrays for performance
- **Type-Safe API**: Full TypeScript support with type inference

### When to Use This Library

Use `@certes/ordo` when you need:

- High-performance data processing with predictable memory layout
- Efficient data transfer to WebGL, WebGPU, or Web Workers
- Large collections of structured data (particles, entities, vertices)
- Cache-friendly iteration over homogeneous data
- Memory-efficient data structures with minimal overhead

### What This Library Provides

**Struct System**:
- `struct()` - Define fixed-layout structs with primitive and complex fields
- `structView()` - Create views into single structs
- `structArray()` - Fixed-capacity arrays of structs
- `dynamicStructArray()` - Auto-growing arrays of structs

**Field Types**:
- Primitives: `int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `float32`, `float64`
- Arrays: `array(type, length)` - Fixed-size typed arrays
- Strings: `utf8(byteLength)` - Fixed-size UTF-8 strings
- Circular Buffers: `circular(type, capacity)` - Embedded FIFO queues

**Dynamic Collections**:
- `dynamicArray()` - Auto-growing typed arrays
- `sparseArray()` - Arrays that grow but never shrink (stable indices)
- `circularBuffer()` - Standalone FIFO buffers

## Quick Start

### Basic Struct Definition

```typescript
import { struct, uint32, float32, array } from '@certes/ordo';

// Define a particle struct
const ParticleDef = struct({
  id: uint32,
  position: array('f32', 3),  // [x, y, z]
  velocity: array('f32', 3),  // [vx, vy, vz]
  lifetime: float32
});

// Create a fixed-capacity array
const particles = structArray(ParticleDef, 1000);

// Add a particle
const idx = particles.push();
const particle = particles.at(idx);

particle.set('id', 42);
particle.set('lifetime', 10.0);

// Access array fields - returns TypedArray view
const pos = particle.get('position');
pos[0] = 100.5;
pos[1] = 200.3;
pos[2] = 50.0;
```

### Memory Layout Inspection

```typescript
ParticleDef.inspect();
```

**Output:**
```
Field                Offset   Size
-------------------- -------- --------
id                   0        4
position[3]          4        12
velocity[3]          16       12
lifetime             28       4

Total size: 32 bytes
Actual data: 32 bytes
Wasted: 0 bytes
Efficiency: 100.0%
```

### Field Ordering Matters

Just like in C, field ordering significantly impacts memory usage due to alignment requirements. Compare these equivalent C and TypeScript struct definitions:

#### C Structs

```c
struct BadEntity {
  double   timestamp;
  uint8_t  isActive;
  double   position[3];
  uint8_t  team;
  double   rotation[4];
  float    damage;
  float    velocity[3];
  uint8_t  flags;
  uint16_t health;
  char     name[16];
};

struct GoodEntity {
  double   timestamp;
  double   position[3];
  double   rotation[4];
  float    damage;
  float    velocity[3];
  uint16_t health;
  uint8_t  isActive;
  uint8_t  team;
  uint8_t  flags;
  char     name[16];
};
```

**C Output:**
```
=== BAD CASE (Poor Field Ordering) ===
Total size: 120 bytes
Alignment:  8 bytes

Field           Offset   Size
-----           ------   ----
timestamp       0        8
isActive        8        1
[PADDING]       9        7       ← Wasted!
position[3]     16       24
team            40       1
[PADDING]       41       7       ← Wasted!
rotation[4]     48       32
damage          80       4
velocity[3]     84       12
flags           96       1
[PADDING]       97       1       ← Wasted!
health          98       2
name[16]        100      16
[PADDING]       116      4       ← Wasted!

Actual data: 101 bytes, Wasted: 19 bytes

=== GOOD CASE (Optimal Field Ordering) ===
Total size: 104 bytes
Alignment:  8 bytes

Field           Offset   Size
-----           ------   ----
timestamp       0        8
position[3]     8        24
rotation[4]     32       32
damage          64       4
velocity[3]     68       12
health          80       2
isActive        82       1
team            83       1
flags           84       1
name[16]        85       16
[PADDING]       101      3       ← Minimal!

Actual data: 101 bytes, Wasted: 3 bytes
```

#### TypeScript Equivalent

```typescript
const badCaseDef = struct({
  timestamp: float64,
  isActive: uint8,
  position: array('f64', 3),
  team: uint8,
  rotation: array('f64', 4),
  damage: float32,
  velocity: array('f32', 3),
  flags: uint8,
  health: uint16,
  name: utf8(16),
});

badCaseDef.inspect();

const goodCaseDef = struct({
  timestamp: float64,
  position: array('f64', 3),
  rotation: array('f64', 4),
  damage: float32,
  velocity: array('f32', 3),
  health: uint16,
  isActive: uint8,
  team: uint8,
  flags: uint8,
  name: utf8(16),
});

goodCaseDef.inspect();
```

**TypeScript Output:**
```
=== BAD CASE (Poor Field Ordering) ===
Field                Offset   Size
-------------------- -------- --------
timestamp            0        8
isActive             8        1
[PADDING]            9        7       ← Wasted!
position[3]          16       24
team                 40       1
[PADDING]            41       7       ← Wasted!
rotation[4]          48       32
damage               80       4
velocity[3]          84       12
flags                96       1
[PADDING]            97       1       ← Wasted!
health               98       2
name[16]             100      16
[PADDING]            116      4       ← Wasted!

Total size: 120 bytes
Actual data: 101 bytes
Wasted: 19 bytes
Efficiency: 84.2%

=== GOOD CASE (Optimal Field Ordering) ===
Field                Offset   Size
-------------------- -------- --------
timestamp            0        8
position[3]          8        24
rotation[4]          32       32
damage               64       4
velocity[3]          68       12
health               80       2
isActive             82       1
team                 83       1
flags                84       1
name[16]             85       16
[PADDING]            101      3       ← Minimal!

Total size: 104 bytes
Actual data: 101 bytes
Wasted: 3 bytes
Efficiency: 97.1%
```

**Result: Identical memory layout to C - 16 bytes saved per struct (13.3% reduction)**

The TypeScript implementation produces **exactly the same memory layout** as C, demonstrating that this library provides true control over data structure layout, not just a JavaScript abstraction.

**Struct Size and Padding:**
- Keep structs under 64 bytes when possible (fits in single cache line)
- Order fields largest-to-smallest to minimize padding
- Use `inspect()` to verify memory layout

## API Reference

### Struct System

#### `struct(schema)`

Define a struct with explicit memory layout.

```typescript
import { struct, uint32, float64, array, utf8 } from '@certes/ordo';

const EntityDef = struct({
  id: uint32,
  name: utf8(32),
  position: array('f64', 3),
  health: float32
});
```

#### `structView(def)`

Create a view into a single struct's memory.

```typescript
const entity = structView(EntityDef);

entity.set('id', 1);
entity.set('health', 100.0);

const nameField = entity.get('name');
nameField.set('Player');

const pos = entity.get('position');
pos[0] = 10.0;
```

#### `structArray(def, capacity)`

Create a fixed-capacity array of structs.

```typescript
const entities = structArray(EntityDef, 1000);

const idx = entities.push();
entities.set(idx, 'health', 100.0);

// Or get a view for multiple operations
const entity = entities.at(idx);
entity.set('health', 100.0);
```

#### `dynamicStructArray(def, initialCapacity)`

Create an auto-growing array of structs.

```typescript
const entities = dynamicStructArray(EntityDef, 100);

// Automatically grows as needed
for (let i = 0; i < 1000; i++) {
  entities.push({ id: i, health: 100.0 });
}

// Automatic downsizing when removing elements
entities.remove(5);
```

### Field Types

#### Primitive Types

All primitive types are little-endian:

- `int8` - 8-bit signed integer (1 byte, 1-byte alignment)
- `uint8` - 8-bit unsigned integer (1 byte, 1-byte alignment)
- `int16` - 16-bit signed integer (2 bytes, 2-byte alignment)
- `uint16` - 16-bit unsigned integer (2 bytes, 2-byte alignment)
- `int32` - 32-bit signed integer (4 bytes, 4-byte alignment)
- `uint32` - 32-bit unsigned integer (4 bytes, 4-byte alignment)
- `float32` - 32-bit floating point (4 bytes, 4-byte alignment)
- `float64` - 64-bit floating point (8 bytes, 8-byte alignment)

#### `array(arrayType, length)`

Fixed-size typed array embedded in the struct.

```typescript
const TransformDef = struct({
  position: array('f32', 3),    // [x, y, z]
  rotation: array('f32', 4),    // [x, y, z, w] quaternion
  scale: array('f32', 3),       // [x, y, z]
  matrix: array('f64', 16)      // 4x4 matrix
});

const transform = structView(TransformDef);

const pos = transform.get('position');
pos[0] = 100;
pos[1] = 200;
pos[2] = 50;

const mat = transform.get('matrix');
// Identity matrix
mat[0] = 1; mat[5] = 1; mat[10] = 1; mat[15] = 1;
```

Available array types: `'i8'`, `'u8'`, `'i16'`, `'u16'`, `'i32'`, `'u32'`, `'f32'`, `'f64'`, `'i64'`, `'u64'`

#### `utf8(byteLength)`

Fixed-size UTF-8 string field.

```typescript
const PlayerDef = struct({
  id: uint32,
  name: utf8(32),      // 32-byte string
  tag: utf8(8)         // 8-byte string
});

const player = structView(PlayerDef);

const nameField = player.get('name');
nameField.set('PlayerOne');
console.log(nameField.get());  // "PlayerOne"

// Truncates if too long
nameField.set('VeryLongPlayerNameThatExceeds32Bytes');
```

#### `circular(arrayType, capacity)`

Embedded circular buffer (FIFO queue).

```typescript
const SensorDef = struct({
  sensorId: uint32,
  readings: circular('f32', 10),  // Last 10 readings
  avgReading: float32
});

const sensor = structView(SensorDef);
sensor.set('sensorId', 101);

const readings = sensor.get('readings');

// Add readings
for (let i = 0; i < 15; i++) {
  readings.enqueue(Math.random() * 100);
}

console.log(readings.size());     // 10 (capacity)
console.log(readings.toArray());  // Last 10 readings

// Calculate average
const avg = readings.toArray().reduce((a, b) => a + b, 0) / readings.size();
sensor.set('avgReading', avg);
```

### Dynamic Collections

#### `dynamicArray(arrayType, initialSize)`

Auto-growing typed array.

```typescript
import { dynamicArray } from '@certes/ordo';

const positions = dynamicArray('f32', 100);

positions.push(10.5);
positions.push(20.3);
positions.push(30.1);

console.log(positions.at(0));  // 10.5
console.log(positions.size()); // 3

// Automatically grows
for (let i = 0; i < 1000; i++) {
  positions.push(i * 0.1);
}

// Remove and shift
positions.remove(5);  // O(n) operation

// Automatically shrinks when size drops
```

#### `sparseArray(arrayType, initialSize)`

Array that grows but never shrinks. Useful for stable indices.

```typescript
import { sparseArray } from '@certes/ordo';

const entityIds = sparseArray('u32', 100);

const id1 = entityIds.push(42);
const id2 = entityIds.push(43);

// Remove doesn't shift - just sets to 0
entityIds.remove(id1);

console.log(entityIds.at(id1));  // 0
console.log(entityIds.at(id2));  // 43 (index unchanged)
```

#### `circularBuffer(arrayType, capacity)`

Standalone FIFO circular buffer.

```typescript
import { circularBuffer } from '@certes/ordo';

const frameTimes = circularBuffer('f64', 60);

// Add frame times
for (let i = 0; i < 100; i++) {
  frameTimes.enqueue(16.67);  // ~60 FPS
}

// Automatically overwrites oldest when full
console.log(frameTimes.size());  // 60

// Get oldest
const oldest = frameTimes.dequeue();

// Calculate average
const avg = frameTimes.toArray().reduce((a, b) => a + b, 0) / frameTimes.size();
console.log(`Average frame time: ${avg.toFixed(2)}ms`);
```

## Usage Patterns

### Particle System

```typescript
import {
  struct,
  structArray,
  uint32,
  uint8,
  float32,
  array,
  circular
} from '@certes/ordo';

const ParticleDef = struct({
  id: uint32,
  position: array('f32', 3),
  velocity: array('f32', 3),
  color: array('u8', 4),           // RGBA
  lifetime: float32,
  active: uint8,
  velocityHistory: circular('f32', 5)  // Last 5 velocity samples
});

const particles = structArray(ParticleDef, 10000);

// Spawn particle
const spawnParticle = (x: number, y: number, z: number) => {
  const idx = particles.push();
  const particle = particles.at(idx);

  particle.set('id', idx);
  particle.set('lifetime', 10.0);
  particle.set('active', 1);

  const pos = particle.get('position');
  pos[0] = x;
  pos[1] = y;
  pos[2] = z;

  const vel = particle.get('velocity');
  vel[0] = (Math.random() - 0.5) * 2;
  vel[1] = (Math.random() - 0.5) * 2;
  vel[2] = (Math.random() - 0.5) * 2;

  const color = particle.get('color');
  color[0] = 255;
  color[1] = 128;
  color[2] = 64;
  color[3] = 255;

  return idx;
};

// Update loop - cache-friendly iteration
const updateParticles = (dt: number) => {
  for (let i = 0; i < particles.length; i++) {
    if (particles.get(i, 'active') === 0) continue;

    const particle = particles.at(i);

    const pos = particle.get('position');
    const vel = particle.get('velocity');

    // Update position
    pos[0] += vel[0] * dt;
    pos[1] += vel[1] * dt;
    pos[2] += vel[2] * dt;

    // Update lifetime
    const lifetime = particle.get('lifetime');
    particle.set('lifetime', lifetime - dt);

    if (lifetime <= 0) {
      particle.set('active', 0);
    }

    // Track velocity magnitude
    const speed = Math.sqrt(vel[0]**2 + vel[1]**2 + vel[2]**2);
    const velHistory = particle.get('velocityHistory');
    velHistory.enqueue(speed);
  }
};
```

### Entity Component System (ECS)

```typescript
import {
  struct,
  dynamicStructArray,
  uint32,
  uint8,
  float32,
  float64,
  array,
  utf8
} from '@certes/ordo';

// Component definitions
const TransformDef = struct({
  position: array('f64', 3),
  rotation: array('f64', 4),  // Quaternion
  scale: array('f64', 3)
});

const RenderableDef = struct({
  meshId: uint32,
  materialId: uint32,
  visible: uint8
});

const PhysicsDef = struct({
  velocity: array('f32', 3),
  acceleration: array('f32', 3),
  mass: float32,
  friction: float32
});

// Component arrays
const transforms = dynamicStructArray(TransformDef, 1000);
const renderables = dynamicStructArray(RenderableDef, 1000);
const physics = dynamicStructArray(PhysicsDef, 1000);

// Create entity
const createEntity = () => {
  const transformIdx = transforms.push();
  const renderableIdx = renderables.push();
  const physicsIdx = physics.push();

  // Initialize transform
  const transform = transforms.at(transformIdx);

  const pos = transform.get('position');
  pos[0] = 0; pos[1] = 0; pos[2] = 0;

  const rot = transform.get('rotation');
  rot[0] = 0; rot[1] = 0; rot[2] = 0; rot[3] = 1;

  const scale = transform.get('scale');
  scale[0] = 1; scale[1] = 1; scale[2] = 1;

  return { transformIdx, renderableIdx, physicsIdx };
};

// Physics system - processes only entities with physics
const physicsSystem = (dt: number) => {
  for (let i = 0; i < physics.length; i++) {
    const phys = physics.at(i);
    const transform = transforms.at(i);

    const vel = phys.get('velocity');
    const acc = phys.get('acceleration');
    const pos = transform.get('position');

    // Update velocity
    vel[0] += acc[0] * dt;
    vel[1] += acc[1] * dt;
    vel[2] += acc[2] * dt;

    // Update position
    pos[0] += vel[0] * dt;
    pos[1] += vel[1] * dt;
    pos[2] += vel[2] * dt;
  }
};
```

## Design Philosophy

### Data-Oriented vs Object-Oriented

**Object-Oriented (typical JavaScript):**
```typescript
class Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  lifetime: number;
}

const particles: Particle[] = [];
for (let i = 0; i < 10000; i++) {
  particles.push(new Particle());
}

// Memory layout: scattered across heap
// Cache misses: high
// GC pressure: high
```

**Data-Oriented (this library):**
```typescript
const ParticleDef = struct({
  position: array('f32', 3),
  velocity: array('f32', 3),
  lifetime: float32
});

const particles = structArray(ParticleDef, 10000);

// Memory layout: contiguous
// Cache misses: minimal
// GC pressure: zero (after allocation)
```

### When NOT to Use This Library

Don't use `@certes/ordo` if:

- You have irregular, heterogeneous data structures
- You need frequent insertions/deletions in the middle of arrays
- Your data structures are small (<100 items)
- You need rich object behaviors and polymorphism
- Readability and maintainability trump performance

This library trades API convenience for performance. Use it where performance matters.

## Integration with @certes Ecosystem

`@certes/ordo` complements other @certes packages:

```typescript
import { pipe } from '@certes/composition';
import { filter, map } from '@certes/lazy';
import { struct, dynamicArray } from '@certes/ordo';

// Use lazy iterators with struct arrays
const ParticleDef = struct({
  lifetime: float32,
  active: uint8
});

const particles = structArray(ParticleDef, 1000);

// Functional pipeline over struct data
const activeParticleLifetimes = pipe(
  Array.from({ length: particles.length }, (_, i) => i),
  filter(i => particles.get(i, 'active') === 1),
  map(i => particles.get(i, 'lifetime'))
);

for (const lifetime of activeParticleLifetimes) {
  console.log(lifetime);
}
```

## TypeScript Support

Full type inference and type safety:

```typescript
const EntityDef = struct({
  id: uint32,
  position: array('f32', 3),
  name: utf8(32)
});

const entity = structView(EntityDef);

// ✅ Type-safe: returns number
const id: number = entity.get('id');

// ✅ Type-safe: returns Float32Array
const pos: Float32Array = entity.get('position');

// ✅ Type-safe: returns Utf8StructField
const nameField = entity.get('name');
const name: string = nameField.get();

// ❌ Compile error: unknown field
entity.get('unknown');

// ❌ Compile error: can't set complex field
entity.set('position', 123);  // Use entity.get('position')[0] = 123
```

## License

MIT

## Contributing

Part of the [@certes](https://github.com/certes-ts/certes) monorepo. See main repository for contribution guidelines.

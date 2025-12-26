import { DynamicStructArray } from './dynamic-struct-array';
import { Struct } from './struct';
import type { ExtendedFieldType } from './fields';
import type { StructArray } from './struct-array';
import type { StructView } from './struct-view';

/**
 * Defines a struct with explicit memory layout and field alignment.
 *
 * Creates a struct definition with C-like memory layout. Fields are aligned
 * according to their type requirements, with automatic padding insertion.
 * The struct definition can then be used to create single views or arrays.
 *
 * @template T - Record mapping field names to field types
 * @param schema - Object mapping field names to field type definitions
 * @returns A struct definition that can create views and arrays
 *
 * @remarks
 * **Field Ordering Matters:**
 * - Order fields largest-to-smallest to minimize padding
 * - 8-byte types (float64, f64 arrays) should come first
 * - 4-byte types (float32, uint32, f32 arrays) next
 * - 2-byte types (uint16) next
 * - 1-byte types (uint8, utf8) last
 *
 * Use `.inspect()` to visualize memory layout and padding.
 *
 * @example
 * ```typescript
 * // Define a particle struct
 * const ParticleDef = struct({
 *   id: uint32,
 *   position: array('f32', 3),
 *   velocity: array('f32', 3),
 *   lifetime: float32,
 *   active: uint8
 * });
 *
 * // Inspect memory layout
 * ParticleDef.inspect();
 *
 * // Create single view
 * const particle = structView(ParticleDef);
 * particle.set('id', 42);
 *
 * // Create array
 * const particles = structArray(ParticleDef, 1000);
 * ```
 *
 * @see {@link structView} for single struct views
 * @see {@link structArray} for fixed-capacity arrays
 * @see {@link dynamicStructArray} for auto-growing arrays
 */
export const struct = <T extends Record<string, ExtendedFieldType>>(
  schema: T,
): Struct<T> => {
  return new Struct(schema);
};

/**
 * Creates a view into a single struct's memory.
 *
 * StructView provides a temporary accessor into a struct's ArrayBuffer.
 * It's not a standalone object - changes to the view are written directly
 * to the underlying buffer.
 *
 * @template T - The struct schema type
 * @param def - The struct definition
 * @returns A view into a newly allocated struct buffer
 *
 * @remarks
 * Views are lightweight - creating multiple views into the same buffer
 * at different offsets is cheap. They don't copy data, just provide
 * typed access to memory.
 *
 * @example
 * ```typescript
 * const EntityDef = struct({
 *   id: uint32,
 *   position: array('f64', 3),
 *   name: utf8(32)
 * });
 *
 * const entity = structView(EntityDef);
 *
 * // Set primitive fields
 * entity.set('id', 1);
 *
 * // Access array fields
 * const pos = entity.get('position');
 * pos[0] = 10.0;
 * pos[1] = 20.0;
 * pos[2] = 30.0;
 *
 * // Access UTF-8 fields
 * const nameField = entity.get('name');
 * nameField.set('Player');
 * console.log(nameField.get());  // "Player"
 * ```
 */
export const structView = <T extends Record<string, ExtendedFieldType>>(
  def: Struct<T>,
): StructView<T> => {
  return def.create();
};

/**
 * Creates a fixed-capacity array of structs.
 *
 * StructArray allocates contiguous memory for a fixed number of structs.
 * It provides cache-friendly iteration and direct field access without
 * creating intermediate objects.
 *
 * @template T - The struct schema type
 * @param def - The struct definition
 * @param capacity - The maximum number of structs the array can hold
 * @returns A new fixed-capacity struct array
 * @throws {Error} When push() exceeds capacity
 *
 * @remarks
 * **Performance:**
 * - Use `get(index, field)` and `set(index, field, value)` for primitives
 * - Use `at(index)` when accessing multiple fields
 * - Sequential iteration is cache-friendly
 *
 * The array cannot grow beyond its capacity. Use DynamicStructArray
 * if you need auto-resizing.
 *
 * @example
 * ```typescript
 * const ParticleDef = struct({
 *   id: uint32,
 *   position: array('f32', 3),
 *   lifetime: float32
 * });
 *
 * const particles = structArray(ParticleDef, 10000);
 *
 * // Add particle
 * const idx = particles.push();
 *
 * // Fast primitive access
 * particles.set(idx, 'id', 42);
 * particles.set(idx, 'lifetime', 10.0);
 *
 * // Access complex fields via view
 * const pos = particles.at(idx).get('position');
 * pos[0] = 100.5;
 *
 * // Cache-friendly iteration
 * for (let i = 0; i < particles.length; i++) {
 *   const lifetime = particles.get(i, 'lifetime');
 *   particles.set(i, 'lifetime', lifetime - 0.016);
 * }
 * ```
 */
export const structArray = <T extends Record<string, ExtendedFieldType>>(
  def: Struct<T>,
  capacity: number,
): StructArray<T> => {
  return def.createArray(capacity);
};

/**
 * Creates an auto-growing array of structs.
 *
 * Similar to StructArray but automatically resizes (2x growth, 0.5x shrink)
 * when needed. Useful when the final size is unknown.
 *
 * @template T - The struct schema type
 * @param def - The struct definition
 * @param initialCapacity - The initial capacity (will grow as needed)
 * @returns A new dynamic struct array
 * @throws {Error} If initialCapacity is less than 1
 *
 * @remarks
 * **Growth Strategy:**
 * - Doubles capacity when full
 * - Halves capacity when size ≤ capacity/2
 * - Preserves data during resize via memory copy
 *
 * **Trade-offs vs StructArray:**
 * - No capacity limit
 * - Includes `pop()`, `remove()`, iterator
 * - Occasional resize overhead
 * - Slightly more complex
 *
 * @example
 * ```typescript
 * const EntityDef = struct({
 *   id: uint32,
 *   health: float32
 * });
 *
 * const entities = dynamicStructArray(EntityDef, 100);
 *
 * // Auto-grows as needed
 * for (let i = 0; i < 1000; i++) {
 *   entities.push({ id: i, health: 100.0 });
 * }
 *
 * console.log(entities.length);    // 1000
 * console.log(entities.capacity);  // 1024 (auto-grew)
 *
 * // Remove element (shifts remaining)
 * entities.remove(5);
 *
 * // Pop last element
 * const last = entities.pop();
 *
 * // Iterate
 * for (const entity of entities) {
 *   entity.set('health', entity.get('health') - 1);
 * }
 * ```
 */
export const dynamicStructArray = <T extends Record<string, ExtendedFieldType>>(
  def: Struct<T>,
  initialCapacity: number,
): DynamicStructArray<T> => {
  return new DynamicStructArray(def, initialCapacity);
};

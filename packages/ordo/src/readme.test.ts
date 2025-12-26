import { describe, expect, it } from 'vitest';
import {
  array,
  circular,
  circularBuffer,
  dynamicArray,
  dynamicStructArray,
  float32,
  float64,
  sparseArray,
  struct,
  structArray,
  structView,
  uint8,
  uint16,
  uint32,
  utf8,
} from './';

describe('README Examples', () => {
  describe('Quick Start', () => {
    it('should work with basic struct definitions', () => {
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3), // [x, y, z]
        velocity: array('f32', 3), // [vx, vy, vz]
        lifetime: float32,
      });

      const particles = structArray(ParticleDef, 1000);
      const idx = particles.push();
      const particle = particles.at(idx);

      particle.set('id', 42);
      particle.set('lifetime', 10.0);

      const pos = particle.get('position');

      pos[0] = 100.5;
      pos[1] = 200.3;
      pos[2] = 50.0;

      expect(particles.length).toBe(1);
      expect(particle.get('id')).toBe(42);
      expect(particle.get('lifetime')).toBe(10.0);
      expect(pos[0]).toBeCloseTo(100.5);
      expect(pos[1]).toBeCloseTo(200.3);
      expect(pos[2]).toBeCloseTo(50.0);
    });

    it('should call inspect without throwing', () => {
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3),
        velocity: array('f32', 3),
        lifetime: float32,
      });

      expect(() => ParticleDef.inspect()).not.toThrow();
    });

    it('should have the correct memory layout for the particle struct', () => {
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3),
        velocity: array('f32', 3),
        lifetime: float32,
      });

      const actualBytes = ParticleDef.layout.fields.reduce(
        (sum, f) => sum + f.type.size,
        0,
      );

      const wastedBytes = ParticleDef.layout.stride - actualBytes;

      expect(ParticleDef.layout.stride).toBe(32);
      expect(actualBytes).toBe(32);
      expect(wastedBytes).toBe(0);

      expect(ParticleDef.getField('id').offset).toBe(0);
      expect(ParticleDef.getField('position').offset).toBe(4);
      expect(ParticleDef.getField('velocity').offset).toBe(16);
      expect(ParticleDef.getField('lifetime').offset).toBe(28);
    });
  });

  describe('Field Ordering', () => {
    it('should match the bad case memory layout', () => {
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

      // Verify memory layout matches README
      expect(badCaseDef.layout.stride).toBe(120);

      const actualBytes = badCaseDef.layout.fields.reduce(
        (sum, f) => sum + f.type.size,
        0,
      );

      const wastedBytes = badCaseDef.layout.stride - actualBytes;

      expect(actualBytes).toBe(101);
      expect(wastedBytes).toBe(19);

      // Verify efficiency percentage
      const efficiency = (actualBytes / badCaseDef.layout.stride) * 100;
      expect(efficiency).toBeCloseTo(84.2, 1);

      // Verify specific field offsets from README
      expect(badCaseDef.getField('timestamp').offset).toBe(0);
      expect(badCaseDef.getField('isActive').offset).toBe(8);
      expect(badCaseDef.getField('position').offset).toBe(16);
      expect(badCaseDef.getField('team').offset).toBe(40);
      expect(badCaseDef.getField('rotation').offset).toBe(48);
      expect(badCaseDef.getField('damage').offset).toBe(80);
      expect(badCaseDef.getField('velocity').offset).toBe(84);
      expect(badCaseDef.getField('flags').offset).toBe(96);
      expect(badCaseDef.getField('health').offset).toBe(98);
      expect(badCaseDef.getField('name').offset).toBe(100);
    });

    it('should match the good case memory layout', () => {
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

      // Verify memory layout matches README
      expect(goodCaseDef.layout.stride).toBe(104);

      const actualBytes = goodCaseDef.layout.fields.reduce(
        (sum, f) => sum + f.type.size,
        0,
      );
      const wastedBytes = goodCaseDef.layout.stride - actualBytes;

      expect(actualBytes).toBe(101);
      expect(wastedBytes).toBe(3);

      // Verify efficiency percentage
      const efficiency = (actualBytes / goodCaseDef.layout.stride) * 100;
      expect(efficiency).toBeCloseTo(97.1, 1);

      // Verify specific field offsets from README
      expect(goodCaseDef.getField('timestamp').offset).toBe(0);
      expect(goodCaseDef.getField('position').offset).toBe(8);
      expect(goodCaseDef.getField('rotation').offset).toBe(32);
      expect(goodCaseDef.getField('damage').offset).toBe(64);
      expect(goodCaseDef.getField('velocity').offset).toBe(68);
      expect(goodCaseDef.getField('health').offset).toBe(80);
      expect(goodCaseDef.getField('isActive').offset).toBe(82);
      expect(goodCaseDef.getField('team').offset).toBe(83);
      expect(goodCaseDef.getField('flags').offset).toBe(84);
      expect(goodCaseDef.getField('name').offset).toBe(85);
    });

    it('should demonstrate 16 bytes saved with good ordering', () => {
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

      const bytesSaved = badCaseDef.layout.stride - goodCaseDef.layout.stride;
      const percentageReduction = (bytesSaved / badCaseDef.layout.stride) * 100;

      expect(bytesSaved).toBe(16);
      expect(percentageReduction).toBeCloseTo(13.3, 1);
    });
  });

  describe('API Reference', () => {
    it('structView - should work with the entity example', () => {
      const EntityDef = struct({
        id: uint32,
        name: utf8(32),
        position: array('f64', 3),
        health: float32,
      });

      const entity = structView(EntityDef);

      entity.set('id', 1);
      entity.set('health', 100.0);

      const nameField = entity.get('name');
      nameField.set('Player');

      const pos = entity.get('position');
      pos[0] = 10.0;

      expect(entity.get('id')).toBe(1);
      expect(entity.get('health')).toBe(100.0);
      expect(nameField.get()).toBe('Player');
      expect(pos[0]).toBe(10.0);
    });

    it('structArray - should work with entity array example', () => {
      const EntityDef = struct({
        id: uint32,
        name: utf8(32),
        position: array('f64', 3),
        health: float32,
      });

      const entities = structArray(EntityDef, 1000);

      const idx = entities.push();
      entities.set(idx, 'health', 100.0);

      const entity = entities.at(idx);
      entity.set('health', 100.0);

      expect(entities.length).toBe(1);
      expect(entities.get(idx, 'health')).toBe(100.0);
      expect(entity.get('health')).toBe(100.0);
    });

    it('dynamicStructArray - should work with auto-growing example', () => {
      const EntityDef = struct({
        id: uint32,
        name: utf8(32),
        position: array('f64', 3),
        health: float32,
      });

      const entities = dynamicStructArray(EntityDef, 100);

      for (let i = 0; i < 1000; i++) {
        entities.push({ id: i, health: 100.0 });
      }

      expect(entities.length).toBe(1000);
      expect(entities.capacity).toBeGreaterThan(100);

      entities.remove(5);

      expect(entities.length).toBe(999);
    });

    it('array field type - should work with transform example', () => {
      const TransformDef = struct({
        position: array('f32', 3), // [x, y, z]
        rotation: array('f32', 4), // [x, y, z, w] quaternion
        scale: array('f32', 3), // [x, y, z]
        matrix: array('f64', 16), // 4x4 matrix
      });

      const transform = structView(TransformDef);
      const pos = transform.get('position');
      pos[0] = 100;
      pos[1] = 200;
      pos[2] = 50;

      const mat = transform.get('matrix');
      // Identity matrix
      mat[0] = 1;
      mat[5] = 1;
      mat[10] = 1;
      mat[15] = 1;

      expect(pos[0]).toBe(100);
      expect(pos[1]).toBe(200);
      expect(pos[2]).toBe(50);
      expect(mat[0]).toBe(1);
      expect(mat[5]).toBe(1);
      expect(mat[10]).toBe(1);
      expect(mat[15]).toBe(1);
    });

    it('utf8 field type - should work with player example', () => {
      const PlayerDef = struct({
        id: uint32,
        name: utf8(32), // 32-byte string
        tag: utf8(8), // 8-byte string
      });

      const player = structView(PlayerDef);
      const nameField = player.get('name');
      nameField.set('PlayerOne');

      // Truncates if too long
      nameField.set('VeryLongPlayerNameThatExceeds32Bytes');

      expect(nameField.get()).toBeTruthy();
      expect(nameField.get().length).toBeLessThanOrEqual(32);
    });

    it('circular field type - should work with sensor example', () => {
      const SensorDef = struct({
        sensorId: uint32,
        readings: circular('f32', 10), // Last 10 readings
        avgReading: float32,
      });

      const sensor = structView(SensorDef);
      sensor.set('sensorId', 101);

      const readings = sensor.get('readings');

      for (let i = 0; i < 15; i++) {
        readings.enqueue(Math.random() * 100);
      }

      // Calculate average
      const avg =
        readings.toArray().reduce((a, b) => a + b, 0) / readings.size();

      sensor.set('avgReading', avg);

      expect(readings.size()).toBe(10); // capacity
      expect(readings.toArray().length).toBe(10); // Last 10 readings
      expect(sensor.get('sensorId')).toBe(101);
      expect(sensor.get('avgReading')).toBeGreaterThan(0);
    });

    it('dynamicArray - should work with positions example', () => {
      const positions = dynamicArray('f32', 100);

      positions.push(10.5);
      positions.push(20.3);
      positions.push(30.1);

      expect(positions.at(0)).toBe(10.5);
      expect(positions.size()).toBe(3);

      for (let i = 0; i < 1000; i++) {
        positions.push(i * 0.1);
      }

      expect(positions.size()).toBe(1003);

      positions.remove(5); // O(n) operation

      expect(positions.size()).toBe(1002);
    });

    it('sparseArray - should work with entity IDs example', () => {
      const entityIds = sparseArray('u32', 100);
      const id1 = entityIds.push(42);
      const id2 = entityIds.push(43);

      entityIds.remove(id1);

      expect(entityIds.at(id1)).toBe(0);
      expect(entityIds.at(id2)).toBe(43); // index unchanged
    });

    it('circularBuffer - should work with frame times example', () => {
      const frameTimes = circularBuffer('f64', 60);

      for (let i = 0; i < 100; i++) {
        frameTimes.enqueue(16.67); // ~60 FPS
      }

      expect(frameTimes.size()).toBe(60);

      const oldest = frameTimes.dequeue();

      expect(oldest).toBe(16.67);
      expect(frameTimes.size()).toBe(59);

      const avg =
        frameTimes.toArray().reduce((a, b) => a + b, 0) / frameTimes.size();

      expect(avg).toBeCloseTo(16.67, 2);
    });
  });

  describe('Particle System', () => {
    it('should create the particle system', () => {
      // Define particle struct
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3),
        velocity: array('f32', 3),
        color: array('u8', 4), // RGBA
        lifetime: float32,
        active: uint8,
        velocityHistory: circular('f32', 5), // Last 5 velocity samples
      });

      const particles = structArray(ParticleDef, 10000);

      // Spawn particle function
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

      const idx = spawnParticle(10, 20, 30);

      expect(particles.length).toBe(1);
      expect(particles.get(idx, 'id')).toBe(idx);
      expect(particles.get(idx, 'lifetime')).toBe(10.0);
      expect(particles.get(idx, 'active')).toBe(1);

      const particle = particles.at(idx);
      const pos = particle.get('position');
      expect(pos[0]).toBe(10);
      expect(pos[1]).toBe(20);
      expect(pos[2]).toBe(30);

      const color = particle.get('color');
      expect(color[0]).toBe(255);
      expect(color[1]).toBe(128);
      expect(color[2]).toBe(64);
      expect(color[3]).toBe(255);
    });

    it('should update the particles', () => {
      // Define particle struct
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3),
        velocity: array('f32', 3),
        color: array('u8', 4),
        lifetime: float32,
        active: uint8,
        velocityHistory: circular('f32', 5),
      });

      const particles = structArray(ParticleDef, 10000);

      // Create a particle
      const idx = particles.push();
      const particle = particles.at(idx);
      particle.set('active', 1);
      particle.set('lifetime', 10.0);

      const pos = particle.get('position');
      pos[0] = 0;
      pos[1] = 0;
      pos[2] = 0;

      const vel = particle.get('velocity');
      vel[0] = 1;
      vel[1] = 2;
      vel[2] = 3;

      // Update loop function
      const updateParticles = (dt: number) => {
        for (let i = 0; i < particles.length; i++) {
          if (particles.get(i, 'active') === 0) {
            continue;
          }

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
          const speed = Math.sqrt(vel[0] ** 2 + vel[1] ** 2 + vel[2] ** 2);
          const velHistory = particle.get('velocityHistory');
          velHistory.enqueue(speed);
        }
      };

      // Update with dt = 1.0
      const initialLifetime = particle.get('lifetime');
      updateParticles(1.0);

      expect(pos[0]).toBe(1); // 0 + 1*1.0
      expect(pos[1]).toBe(2); // 0 + 2*1.0
      expect(pos[2]).toBe(3); // 0 + 3*1.0
      expect(particle.get('lifetime')).toBe(initialLifetime - 1.0);

      const velHistory = particle.get('velocityHistory');
      expect(velHistory.size()).toBe(1); // One speed sample added

      // Update many times to deactivate
      for (let i = 0; i < 20; i++) {
        updateParticles(1.0);
      }

      // Particle should be deactivated
      expect(particle.get('active')).toBe(0);
      expect(velHistory.size()).toBe(5); // Circular buffer max capacity
    });

    it('should spawn multiple particles', () => {
      const ParticleDef = struct({
        id: uint32,
        position: array('f32', 3),
        velocity: array('f32', 3),
        color: array('u8', 4),
        lifetime: float32,
        active: uint8,
        velocityHistory: circular('f32', 5),
      });

      const particles = structArray(ParticleDef, 10000);

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

      // Spawn 100 particles
      const indices: number[] = [];
      for (let i = 0; i < 100; i++) {
        indices.push(spawnParticle(i * 10, i * 20, i * 30));
      }

      expect(particles.length).toBe(100);
      expect(indices.length).toBe(100);

      // Verify each particle has correct position
      for (let i = 0; i < 100; i++) {
        const particle = particles.at(indices[i]);
        const pos = particle.get('position');
        expect(pos[0]).toBe(i * 10);
        expect(pos[1]).toBe(i * 20);
        expect(pos[2]).toBe(i * 30);
      }
    });
  });

  describe('Entity Component System (ECS)', () => {
    it('should create component definitions', () => {
      const TransformDef = struct({
        position: array('f64', 3),
        rotation: array('f64', 4), // Quaternion
        scale: array('f64', 3),
      });

      const RenderableDef = struct({
        meshId: uint32,
        materialId: uint32,
        visible: uint8,
      });

      const PhysicsDef = struct({
        velocity: array('f32', 3),
        acceleration: array('f32', 3),
        mass: float32,
        friction: float32,
      });

      expect(TransformDef.layout.stride).toBeGreaterThan(0);
      expect(RenderableDef.layout.stride).toBeGreaterThan(0);
      expect(PhysicsDef.layout.stride).toBeGreaterThan(0);
    });

    it('should create an entity with components', () => {
      const TransformDef = struct({
        position: array('f64', 3),
        rotation: array('f64', 4), // Quaternion
        scale: array('f64', 3),
      });

      const RenderableDef = struct({
        meshId: uint32,
        materialId: uint32,
        visible: uint8,
      });

      const PhysicsDef = struct({
        velocity: array('f32', 3),
        acceleration: array('f32', 3),
        mass: float32,
        friction: float32,
      });

      // Component arrays
      const transforms = dynamicStructArray(TransformDef, 1000);
      const renderables = dynamicStructArray(RenderableDef, 1000);
      const physics = dynamicStructArray(PhysicsDef, 1000);

      // Create entity function
      const createEntity = () => {
        const transformIdx = transforms.push();
        const renderableIdx = renderables.push();
        const physicsIdx = physics.push();

        // Initialize transform
        const transform = transforms.at(transformIdx);

        const pos = transform.get('position');
        pos[0] = 0;
        pos[1] = 0;
        pos[2] = 0;

        const rot = transform.get('rotation');
        rot[0] = 0;
        rot[1] = 0;
        rot[2] = 0;
        rot[3] = 1;

        const scale = transform.get('scale');
        scale[0] = 1;
        scale[1] = 1;
        scale[2] = 1;

        return { transformIdx, renderableIdx, physicsIdx };
      };

      // Act
      const entity = createEntity();

      // Assert
      expect(transforms.length).toBe(1);
      expect(renderables.length).toBe(1);
      expect(physics.length).toBe(1);

      const transform = transforms.at(entity.transformIdx);
      const pos = transform.get('position');
      expect(pos[0]).toBe(0);
      expect(pos[1]).toBe(0);
      expect(pos[2]).toBe(0);

      const rot = transform.get('rotation');
      expect(rot[0]).toBe(0);
      expect(rot[1]).toBe(0);
      expect(rot[2]).toBe(0);
      expect(rot[3]).toBe(1);

      const scale = transform.get('scale');
      expect(scale[0]).toBe(1);
      expect(scale[1]).toBe(1);
      expect(scale[2]).toBe(1);
    });

    it('should run the physics system', () => {
      const TransformDef = struct({
        position: array('f64', 3),
        rotation: array('f64', 4),
        scale: array('f64', 3),
      });

      const PhysicsDef = struct({
        velocity: array('f32', 3),
        acceleration: array('f32', 3),
        mass: float32,
        friction: float32,
      });

      const transforms = dynamicStructArray(TransformDef, 1000);
      const physics = dynamicStructArray(PhysicsDef, 1000);

      // Create entity
      const transformIdx = transforms.push();
      const physicsIdx = physics.push();

      const transform = transforms.at(transformIdx);
      const pos = transform.get('position');
      pos[0] = 0;
      pos[1] = 0;
      pos[2] = 0;

      const phys = physics.at(physicsIdx);
      const vel = phys.get('velocity');
      vel[0] = 10;
      vel[1] = 20;
      vel[2] = 30;

      const acc = phys.get('acceleration');
      acc[0] = 1;
      acc[1] = 2;
      acc[2] = 3;

      // Physics system function
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

      // Run physics system with dt = 1.0
      physicsSystem(1.0);

      expect(vel[0]).toBe(11); // 10 + 1*1.0
      expect(vel[1]).toBe(22); // 20 + 2*1.0
      expect(vel[2]).toBe(33); // 30 + 3*1.0

      // Position updated
      expect(pos[0]).toBe(11); // 0 + 11*1.0
      expect(pos[1]).toBe(22); // 0 + 22*1.0
      expect(pos[2]).toBe(33); // 0 + 33*1.0

      // Run again
      physicsSystem(1.0);

      expect(vel[0]).toBe(12); // 11 + 1*1.0
      expect(vel[1]).toBe(24); // 22 + 2*1.0
      expect(vel[2]).toBe(36); // 33 + 3*1.0

      expect(pos[0]).toBe(23); // 11 + 12*1.0
      expect(pos[1]).toBe(46); // 22 + 24*1.0
      expect(pos[2]).toBe(69); // 33 + 36*1.0
    });

    it('should handle multiple entities in the ECS', () => {
      const TransformDef = struct({
        position: array('f64', 3),
        rotation: array('f64', 4),
        scale: array('f64', 3),
      });

      const RenderableDef = struct({
        meshId: uint32,
        materialId: uint32,
        visible: uint8,
      });

      const PhysicsDef = struct({
        velocity: array('f32', 3),
        acceleration: array('f32', 3),
        mass: float32,
        friction: float32,
      });

      const transforms = dynamicStructArray(TransformDef, 1000);
      const renderables = dynamicStructArray(RenderableDef, 1000);
      const physics = dynamicStructArray(PhysicsDef, 1000);

      const createEntity = () => {
        const transformIdx = transforms.push();
        const renderableIdx = renderables.push();
        const physicsIdx = physics.push();

        const transform = transforms.at(transformIdx);
        const pos = transform.get('position');
        pos[0] = 0;
        pos[1] = 0;
        pos[2] = 0;

        const rot = transform.get('rotation');
        rot[0] = 0;
        rot[1] = 0;
        rot[2] = 0;
        rot[3] = 1;

        const scale = transform.get('scale');
        scale[0] = 1;
        scale[1] = 1;
        scale[2] = 1;

        return { transformIdx, renderableIdx, physicsIdx };
      };

      const entities: Array<{
        transformIdx: number;
        renderableIdx: number;
        physicsIdx: number;
      }> = [];
      for (let i = 0; i < 100; i++) {
        entities.push(createEntity());
      }

      expect(transforms.length).toBe(100);
      expect(renderables.length).toBe(100);
      expect(physics.length).toBe(100);

      for (let i = 0; i < 100; i++) {
        const transform = transforms.at(entities[i].transformIdx);
        const rot = transform.get('rotation');
        expect(rot[3]).toBe(1); // Quaternion w component
      }
    });
  });
});

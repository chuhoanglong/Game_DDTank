import Matter from 'matter-js';

export default Physics = (entities, { touches, time }) => {

    let engine = entities.physics.engine;
    let bird = entities.Tank.body;

    touches.filter(t => {
        return t.type === 'press';
    }).forEach(t => {
        Matter.Body.applyForce(bird, bird.position, { x: 0.0, y: -0.01 });
    })

    // Matter.Engine.update(engine, time.delta);

    return entities;
}
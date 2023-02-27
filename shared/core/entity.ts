import EntityError from './errors/entity-error'

export class EntityCreationError extends EntityError {}

abstract class Entity {}

export default Entity

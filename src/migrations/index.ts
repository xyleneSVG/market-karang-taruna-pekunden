import * as migration_20250831_120736 from './20250831_120736';

export const migrations = [
  {
    up: migration_20250831_120736.up,
    down: migration_20250831_120736.down,
    name: '20250831_120736'
  },
];

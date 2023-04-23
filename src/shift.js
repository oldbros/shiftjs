import * as sync from './sync/index.js';
import * as async from './async/index.js';
import * as dataStructures from './persistent/index.js';
export default { async, ...sync, ...dataStructures };

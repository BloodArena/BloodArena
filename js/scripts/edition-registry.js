let _currentEditionId = "trouble_brewing";
const _editions = {};

export function registerEdition(id, editionModule) {
  _editions[id] = editionModule;
}

export function setCurrentEdition(id) {
  if (!_editions[id]) throw new Error(`Unknown edition: ${id}`);
  _currentEditionId = id;
}

export function getCurrentEdition() {
  return _editions[_currentEditionId];
}

export function getCurrentEditionId() {
  return _currentEditionId;
}

export function getEdition(id) {
  return _editions[id] || null;
}

export function listEditions() {
  return Object.keys(_editions).map(id => ({ id, name: _editions[id].name }));
}

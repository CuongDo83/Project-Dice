import { generateRuntimeLevel } from './level-generator.js';

async function loadBundledLevel(levelId) {
  const levelUrl = new URL(`./levels/${levelId}.json`, import.meta.url);
  const response = await fetch(levelUrl);

  if (!response.ok) {
    throw new Error(`Failed to load level ${levelId}: ${response.status}`);
  }

  return response.json();
}

export async function loadLevel(levelId = 'level-001', playtestPayload = null) {
  if (playtestPayload) {
    try {
      return generateRuntimeLevel(JSON.parse(playtestPayload));
    } catch (error) {
      console.warn('Ignoring invalid playtest map payload.', error);
    }
  }

  const authoredLevel = await loadBundledLevel(levelId);
  return generateRuntimeLevel(authoredLevel);
}

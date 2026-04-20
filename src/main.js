import { createGameController } from './state/game-controller.js';
import { renderApp } from './ui/app-ui.js';

async function bootstrap() {
  const root = document.getElementById('app');

  const controller = await createGameController((state, actions) => {
    renderApp(root, state, actions);
  });

  controller.renderState();
}

bootstrap().catch((error) => {
  console.error(error);
  const root = document.getElementById('app');
  root.textContent = `Bootstrap failed: ${error.message}`;
});

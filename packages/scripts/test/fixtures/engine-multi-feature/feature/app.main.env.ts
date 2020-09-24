import { MAIN } from '@fixture/3rd-party/3rd-party.feature';
import MyFeature from './app.feature';

MyFeature.setup(MAIN, ({ run, myConfig, mySlot }) => {
    run(() => {
        document.body.innerHTML = `
          <h1>App is running</h1>
          <h2>myConfig</h2>
          <pre id="myConfig">${JSON.stringify(myConfig)}</pre>
          <h2>mySlot</h2>
          <pre id="mySlot">${JSON.stringify([...mySlot])}</pre>
        `;
    });
});

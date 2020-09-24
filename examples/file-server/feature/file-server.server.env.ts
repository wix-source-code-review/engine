import { RUN_OPTIONS } from '@wixc3/engine-core';
import FileServer, { server } from './file-server.feature';
import { RemoteFilesAPI } from '../src/remote-files-api';

/**
 * setting up the server environment
 */
FileServer.setup(server, ({ [RUN_OPTIONS]: runOptions }, {}) => {
    /**
     * exposing the remoteFiles implementation of thje server side
     */
    const optionsProjectPath = runOptions.get('projectPath');

    const projectPath = (typeof optionsProjectPath !== 'boolean' ? optionsProjectPath : undefined) || process.cwd();

    return {
        remoteFiles: new RemoteFilesAPI(projectPath),
    };
});

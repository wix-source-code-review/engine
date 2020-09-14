import { Feature, Service, Environment, COM, Config, TopLevelConfig, Slot } from '@wixc3/engine-core';
import type { ApplicationProxyService } from '../src/application-proxy-service';
import type { LaunchEnvironmentMode, TopLevelConfigProvider } from '@wixc3/engine-scripts';
import { cwd } from 'process';
import type webpack from 'webpack';

export const devServerEnv = new Environment('dev-server', 'node', 'single');

export interface DevServerConfig {
    httpServerPort: number;
    featureName?: string;
    singleFeature?: boolean;
    configName?: string;
    publicPath?: string;
    title?: string;
    publicConfigsRoute: string;
    singleRun: boolean;
    inspect: boolean;
    autoLaunch: boolean;
    nodeEnvironmentsMode?: LaunchEnvironmentMode;
    basePath: string;
    mode: 'production' | 'development';
    overrideConfig: TopLevelConfig | TopLevelConfigProvider;
    defaultRuntimeOptions: Record<string, string | boolean>;
}

export interface DevServerActions {
    close: () => Promise<void>;
}

export interface ServerListeningParams {
    port: number;
    host: string;
}

export type ServerListeningHandler =
    | ((params: ServerListeningParams) => void)
    | ((params: ServerListeningParams) => Promise<void>);

export default new Feature({
    id: 'buildFeature',
    dependencies: [COM],
    api: {
        application: Service.withType<ApplicationProxyService>().defineEntity(devServerEnv).allowRemoteAccess(),
        devServerConfig: new Config<DevServerConfig>({
            httpServerPort: 3000,
            singleFeature: false,
            singleRun: false,
            inspect: false,
            autoLaunch: true,
            basePath: cwd(),
            mode: 'development',
            overrideConfig: [],
            defaultRuntimeOptions: {},
            publicConfigsRoute: 'configs/',
        }),
        serverListeningHandlerSlot: Slot.withType<ServerListeningHandler>().defineEntity(devServerEnv),
        engineerWebpackConfigs: Slot.withType<webpack.Configuration>().defineEntity(devServerEnv),
        devServerActions: Service.withType<DevServerActions>().defineEntity(devServerEnv),
    },
});

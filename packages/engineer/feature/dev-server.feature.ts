import { Feature, Service, Environment, COM, Config, TopLevelConfig, Slot } from '@wixc3/engine-core/src';
import type { ApplicationProxyService } from '../src/application-proxy-service';
import type {
    NodeEnvironmentsManager,
    LaunchEnvironmentMode,
    TopLevelConfigProvider,
    IRunFeatureOptions,
    IFeatureMessagePayload,
} from '@wixc3/engine-scripts/src';
import { cwd } from 'process';
import type webpack from 'webpack';
import type { OverrideConfig } from '@wixc3/engine-scripts/src/config-middleware';

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
    nodeEnvironmentsMode: LaunchEnvironmentMode;
    basePath: string;
    mode: 'production' | 'development';
    overrideConfig: TopLevelConfig | TopLevelConfigProvider;
    defaultRuntimeOptions: Record<string, string | boolean>;
}

export interface DevServerActions {
    runFeature: (
        options: IRunFeatureOptions
    ) => Promise<{
        featureName: string;
        configName: string | undefined;
        runningEnvironments: Record<string, number>;
    }>;
    closeFeature: ({ featureName, configName }: IFeatureMessagePayload) => Promise<void>;
    getMetrics: () => {
        marks: PerformanceMeasure[];
        measures: PerformanceMeasure[];
    };
    close: () => Promise<void>;
}

export interface BuildHooks {
    serverReady?: (() => Promise<void>) | (() => void);
}

export type ServerListeningHandler = (() => void) | (() => Promise<void>);

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
            nodeEnvironmentsMode: 'same-server',
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

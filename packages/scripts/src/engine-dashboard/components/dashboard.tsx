import React, { useEffect, useState } from 'react';
import { ServerState } from '../../server-types';

const fetchServerState = async () => (await fetch('/server-state')).json();

const formStyle: React.CSSProperties = { margin: 10 };

export const Dashboard: React.FC = () => {
    const [serverState, setServerState] = useState<ServerState>({
        runningNodeEnvironments: [],
        features: [],
        configs: []
    });

    useEffect(() => {
        fetchServerState()
            .then(({ data }) => setServerState(data))
            .catch(error => {
                // tslint:disable-next-line no-console
                console.error(error);
            });
    }, []);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        const featureName = (e.currentTarget.elements.namedItem('featureName') as HTMLSelectElement).value;
        if (featureName) {
            searchParams.append('feature', featureName);
        }
        const configName = (e.currentTarget.elements.namedItem('configName') as HTMLSelectElement).value;
        if (configName) {
            searchParams.append('config', configName);
        }
        window.open(`/main.html?${searchParams}`);
    };

    return (
        <>
            <h1>Engine Dashboard</h1>
            <form onSubmit={onSubmit}>
                <div style={formStyle}>
                    <label htmlFor="featureName">Feature: </label>
                    <select id="featureName" name="featureName">
                        {serverState.features.map(featureName => (
                            <option key={featureName} value={featureName}>
                                {featureName}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={formStyle}>
                    <label htmlFor="configName">Config: </label>
                    <select id="configName" name="configName">
                        {serverState.configs.map(configName => (
                            <option key={configName} value={configName}>
                                {configName}
                            </option>
                        ))}
                    </select>
                </div>
                <input style={formStyle} type="submit" value="Go" />
            </form>
        </>
    );
};

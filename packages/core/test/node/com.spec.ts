import { expect } from 'chai';
import { BaseHost } from '../../src/com/base-host';
import { Communication } from '../../src/com/communication';
import { Environment } from '@wixc3/engine-core/src';

describe('Communication', () => {
    it('single communication', async () => {
        interface EchoService {
            echo(s: string): string;
        }
        const host = new BaseHost();

        const main = new Communication(host, 'main');

        main.registerAPI(
            { id: 'echoService' },
            {
                echo(s: string) {
                    return s;
                }
            }
        );

        const proxy = main.apiProxy<EchoService>(Promise.resolve({ id: 'main' }), { id: 'echoService' });

        const res = await proxy.echo('Yoo!');

        expect(res).to.be.equal('Yoo!');
    });
    it('multi communication', async () => {
        interface EchoService {
            echo(s: string): string;
        }

        const host = new BaseHost();
        const main = new Communication(host, 'main');

        const host2 = host.open();
        const main2 = new Communication(host2, 'main2');

        main.registerEnv('main2', host2);

        main2.registerAPI(
            { id: 'echoService' },
            {
                echo(s: string) {
                    return s;
                }
            }
        );

        const proxy = main.apiProxy<EchoService>(Promise.resolve({ id: 'main2' }), { id: 'echoService' });

        const res = await proxy.echo('Yoo!');

        expect(res).to.be.equal('Yoo!');
    });

    it('should resolve web environment urls', () => {
        const host = new BaseHost();

        const main = new Communication(host, 'main');

        const envUrl = main.getEnvUrl(new Environment('test', 'iframe', 'single'));

        expect(envUrl).to.equal('/test.web.js');
    });

    it('should append global location.search', () => {
        const host = new BaseHost();
        (global as any).location = { search: '?test' };
        const main = new Communication(host, 'main');

        const envUrl = main.getEnvUrl(new Environment('test', 'iframe', 'single'));

        expect(envUrl).to.equal('/test.web.js?test');
    });

    
    it('should resolve worler env urls', () => {
        const host = new BaseHost();
        (global as any).location = { search: '?test' };
        const main = new Communication(host, 'main');

        const envUrl = main.getEnvUrl(new Environment('test', 'worker', 'single'));

        expect(envUrl).to.equal('/test.webworker.js?test');
    });

    
    it('should use topology publicPath', () => {
        const host = new BaseHost();
        (global as any).location = { search: '?test' };
        const main = new Communication(host, 'main', {publicPath: 'http://localhost/'});

        const envUrl = main.getEnvUrl(new Environment('test', 'worker', 'single'));

        expect(envUrl).to.equal('http://localhost/test.webworker.js?test');
    });
});

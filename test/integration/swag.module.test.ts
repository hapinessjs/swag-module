/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, HttpServerExt, Inject, OnStart, Server } from '@hapiness/core';

import { SwagModule } from '../../src';
import { ResponseObject } from 'shot';

@suite('- Integration LoggerModuleTest file')
class LoggerModuleTest {
    /**
     * Function executed before the suite
     */
    static before() {}

    /**
     * Function executed after the suite
     */
    static after() {}

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() {}

    /**
     * Function executed before each test
     */
    before() {}

    /**
     * Function executed after each test
     */
    after() {}

    @test('- Test route swagger.json exists')
    testRouteSwaggerJsonExists(done) {
        @HapinessModule({
            version: '1.0.0',
            imports: [
                SwagModule
            ]
        })
        class SwagModuleTest implements OnStart {
            constructor(@Inject(HttpServerExt) private _httpServer: Server) {}

            onStart(): void {
                this._httpServer.inject('/swagger.json', reply => {
                    unit
                        .object(reply.result)
                        .when(_ => Hapiness['extensions'].pop().value.stop().then(__ => done()));
                });
            }
        }

        Hapiness.bootstrap(SwagModuleTest, [HttpServerExt.setConfig({
            host: '0.0.0.0',
            port: 4443
        })]);
    }

    @test('- Test route /documentation exists')
    testRouteDocumentationExists(done) {
        @HapinessModule({
            version: '1.0.0',
            imports: [
                SwagModule
            ]
        })
        class SwagModuleTest implements OnStart {
            constructor(@Inject(HttpServerExt) private _httpServer: Server) {}

            onStart(): void {
                this._httpServer.inject('/documentation', reply => {
                    unit
                        .number(reply.statusCode)
                        .is(200)
                        .when(_ => Hapiness['extensions'].pop().value.stop().then(__ => done()));
                });
            }
        }

        Hapiness.bootstrap(SwagModuleTest, [HttpServerExt.setConfig({
            host: '0.0.0.0',
            port: 4443
        })]);
    }

    @test('- Test without giving a config')
    testSwagModuleWithoutConfig(done) {
        @HapinessModule({
            version: '1.0.0',
            imports: [
                SwagModule
            ]
        })
        class SwagModuleTest implements OnStart {
            constructor(@Inject(HttpServerExt) private _httpServer: Server) {}

            onStart(): void {
                this._httpServer.inject('/swagger.json', reply => {
                    const result: any = reply.result;
                    unit
                        .string(result.info.title)
                        .is('Module name')
                        .when(_ =>
                            unit
                                .string(result.info.version)
                                .is('1.0.0')
                                .when(__ => Hapiness['extensions'].pop().value.stop().then(___ => done())));
                });
            }
        }

        Hapiness.bootstrap(SwagModuleTest, [HttpServerExt.setConfig({
            host: '0.0.0.0',
            port: 4443
        })]);
    }

    @test('- If config is provided to the module, it has to be retrieve')
    testSwagModuleWithConfig(done) {
        @HapinessModule({
            version: '1.0.0',
            imports: [
                SwagModule.setConfig({ info: { title: 'TestTitle', version: 'x.x.y' } })
            ]
        })
        class SwagModuleTest implements OnStart {
            constructor(@Inject(HttpServerExt) private _httpServer: Server) {}

            onStart(): void {
                this._httpServer.inject('/swagger.json', reply => {
                    const result: any = reply.result;
                    unit
                        .string(result.info.title)
                        .is('TestTitle')
                        .when(_ =>
                            unit
                                .string(result.info.version)
                                .is('x.x.y')
                                .when(__ => Hapiness['extensions'].pop().value.stop().then(___ => done())));
                });
            }
        }

        Hapiness.bootstrap(SwagModuleTest, [HttpServerExt.setConfig({
            host: '0.0.0.0',
            port: 4443
        })]);
    }
}

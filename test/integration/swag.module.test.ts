/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, HttpServer, Route, OnStart, OnGet } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

// element to test
import { SwagModule } from '../../src';

@suite('- Integration SwagdModuleTest file')
class SwagdModuleTest {
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

    /**
     * Test if sayHello GET route returns `Hello World`
     */
    @test('- Check if `docs.json` GET route returns a non empty object')
    testSayHelloGetRoute(done) {
        @HapinessModule({
            version: '1.0.0',
            options: {
                host: '0.0.0.0',
                port: 4443
            },
            imports: [
                SwagModule
            ]
        })
        class SwagModuleTest implements OnStart {
            constructor(private _httpServer: HttpServer) {}

            onStart(): void {
                this
                    ._httpServer
                    .instance
                    .inject('/docs', reply => {
                        unit
                            .object(reply.result)
                            .when(_ => Hapiness.kill().subscribe(__ => done()));
                    });
            }
        }

        Hapiness.bootstrap(SwagModuleTest);
    }

    /**
     * Test there are multiple routes
     */
    @test('- GET `/docs` should be aware of all route inside the module')
    testMultipleRoutes(done) {
        @Route({
            method: 'GET',
            path: '/helloworld'
        })
        class HelloWorldRoute implements OnGet {
            onGet(request, reply) {
                reply('Hello world');
            }
        }

        @HapinessModule({
            version: '1.0.0',
            options: {
                host: '0.0.0.0',
                port: 4443
            },
            imports: [
                SwagModule
            ],
            declarations: [
                HelloWorldRoute
            ]
        })
        class HelloWorldModuleTest implements OnStart {
            constructor(private _httpServer: HttpServer) {}

            onStart(): void {
                this
                    ._httpServer
                    .instance
                    .inject('/docs', reply => {
                        console.log('LALALA ', JSON.stringify(reply.result, null, 2));
                        unit
                            .object(reply.result)
                            .when(_ => Hapiness.kill().subscribe(__ => done()));
                    });
            }
        }

        Hapiness.bootstrap(HelloWorldModuleTest);
    }

    // /**
    //  * Test if injected `HelloWorldService` as a `sayHello` function
    //  */
    // @test('- Injected `HelloWorldService` must have `sayHello` function')
    // testInjectableHelloWorldServiceSayHello(done) {
    //     @Lib()
    //     class HelloWorldLib {
    //         constructor(private _helloWorldService: HelloWorldService) {
    //             unit.function(this._helloWorldService.sayHello)
    //                 .when(_ => Hapiness.kill().subscribe(__ => done()));
    //         }
    //     }

    //     @HapinessModule({
    //         version: '1.0.0',
    //         options: {
    //             host: '0.0.0.0',
    //             port: 4443
    //         },
    //         imports: [
    //             HelloWorldModule
    //         ],
    //         declarations: [
    //             HelloWorldLib
    //         ]
    //     })
    //     class HelloWorldModuleTest {}

    //     Hapiness.bootstrap(HelloWorldModuleTest);
    // }

    // /**
    //  * Test if injected `HelloWorldService.sayHello()` function returns an Observable
    //  */
    // @test('- Injected `HelloWorldService.sayHello()` function must return an Observable')
    // testInjectableHelloWorldServiceSayHelloObservable(done) {
    //     @Lib()
    //     class HelloWorldLib {
    //         constructor(private _helloWorldService: HelloWorldService) {
    //             unit.object(this._helloWorldService.sayHello()).isInstanceOf(Observable)
    //                 .when(_ => Hapiness.kill().subscribe(__ => done()));
    //         }
    //     }

    //     @HapinessModule({
    //         version: '1.0.0',
    //         options: {
    //             host: '0.0.0.0',
    //             port: 4443
    //         },
    //         imports: [
    //             HelloWorldModule
    //         ],
    //         declarations: [
    //             HelloWorldLib
    //         ]
    //     })
    //     class HelloWorldModuleTest {}

    //     Hapiness.bootstrap(HelloWorldModuleTest);
    // }

    // /**
    //  * Test if injected `HelloWorldService.sayHello()` Observable returns 'Hello World'
    //  */
    // @test('- Injected `HelloWorldService.sayHello()` Observable function must return a string with `Hello World` value')
    // testInjectableHelloWorldServiceSayHelloObservableReturnString(done) {
    //     @Lib()
    //     class HelloWorldLib {
    //         constructor(private _helloWorldService: HelloWorldService) {
    //             this._helloWorldService.sayHello().subscribe(m => unit.string(m).is('Hello World')
    //                     .when(_ => Hapiness.kill().subscribe(__ => done())));
    //         }
    //     }

    //     @HapinessModule({
    //         version: '1.0.0',
    //         options: {
    //             host: '0.0.0.0',
    //             port: 4443
    //         },
    //         imports: [
    //             HelloWorldModule
    //         ],
    //         declarations: [
    //             HelloWorldLib
    //         ]
    //     })
    //     class HelloWorldModuleTest {}

    //     Hapiness.bootstrap(HelloWorldModuleTest);
    // }
}

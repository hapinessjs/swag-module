import * as HapiSwagger from '@reptilbud/hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';
import { Observable } from 'rxjs/Observable';
import {
    HapinessModule,
    Optional,
    Inject,
    CoreModuleWithProviders,
    HttpServerExt,
    InjectionToken,
    OnRegister,
    Server
} from '@hapiness/core';

const SWAG_MODULE_CONFIG = new InjectionToken('swag_module_config');

@HapinessModule({
    version: '1.1.0'
})
export class SwagModule implements OnRegister {

    static setConfig(config: any): CoreModuleWithProviders {
        return {
            module: SwagModule,
            providers: [{ provide: SWAG_MODULE_CONFIG, useValue: config }]
        };
    }

    constructor(@Inject(HttpServerExt) private server: Server,
                @Optional() @Inject(SWAG_MODULE_CONFIG) private config) {
    }

    onRegister() {
        // Add some default values (in case of no config were provided)
        this.config = Object.assign(
            {},
            {
                grouping: 'tags',
            },
            this.config,
            {
                info: Object.assign(
                    {},
                    {
                        title: 'Module name'
                    },
                    {
                        version: '1.0.0'
                    },
                    (this.config || {}).info
                )
            }
        );

        return Observable.fromPromise(this.server.register([
            Inert,
            Vision,
            {
                register: HapiSwagger,
                options: this.config
            }
        ]));
    }
}

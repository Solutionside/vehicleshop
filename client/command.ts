import { ConsoleCommander } from '@AthenaShared/utility/consoleCommander';
import alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

ConsoleCommander.registerConsoleCommand('/veh', async (model) => {
    await AthenaClient.utility.model.load(model);

    alt.log(model);

    native.createVehicle(
        alt.hash(model),
        -42.918338775634766,
        -1099.4906005859375,
        26.42234230041504,
        0,
        false,
        false,
        false,
    );
});

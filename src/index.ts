import "reflect-metadata";
import {Connection, createConnection} from 'typeorm';
import {Recorder} from './lib/node-rtsp-recorder/src';
import watch from 'node-watch';
import {Recording} from "./entity/Recording";

const config: {feed_url: string, id: number, args: string[]} = require('../appconfig.json');

void (async () => {
  let updatedPath: string = null;
  const connection: Connection = await createConnection();

  watch('/root/videos', {recursive: true}, async function (_evt, path) {

    if (updatedPath === null) {
      updatedPath = path;
    }

    if (updatedPath !== null && path !== updatedPath && updatedPath.includes(`cam${config.id}`)) {

      const recording = new Recording();
      recording.path = updatedPath;
      recording.camera = config.id;

      await connection
                .createQueryBuilder()
                .insert()
                .into(Recording)
                .values([recording])
                .execute();

      updatedPath = path;
    }
  });

  (new Recorder({
    args: config.args,
    url: config.feed_url,
    folder: 'videos',
    name: `cam${config.id}`,
    directoryPathFormat: '',
  })).startRecording();
})();

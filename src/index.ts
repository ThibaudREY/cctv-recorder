import "reflect-metadata";
import {Connection, createConnection, LessThan} from 'typeorm';
import {Recorder} from './lib/node-rtsp-recorder/src';
import watch from 'node-watch';
import {Recording} from "./entity/Recording";
import * as moment from "moment";
import * as fs from "fs";

const config: {feed_url: string, id: number, args: string[]} = require('../appconfig.json');

void (async () => {
  let updatedPath: string = null;
  const connection: Connection = await createConnection();
  const recordingRepository = connection.getRepository(Recording);

  watch('/root/videos', {recursive: true}, async function (_evt, path) {

    if (updatedPath === null) {
      updatedPath = path;
    }

    (await recordingRepository.find({
      date: LessThan(moment(moment.now()).subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss.SSSSSS'))
    })).forEach((r: Recording) => {
      fs.unlinkSync(r.path)
    });
    await recordingRepository.delete({
      date: LessThan(moment(moment.now()).subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss.SSSSSS'))
    });

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

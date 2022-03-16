import "reflect-metadata";
import {Connection, createConnection, LessThan} from 'typeorm';
import {Recorder} from './lib/node-rtsp-recorder/src';
import watch from 'node-watch';
import {Recording} from "./entity/Recording";
import * as moment from "moment";
import * as fs from "fs";

const config: {feed_url: string, id: number} = require('../appconfig.json');

void (async () => {
  let updatedPath: string = null;
  const connection: Connection = await createConnection();
  const recordingRepository = connection.getRepository(Recording);

  watch('/root/videos', {recursive: true}, async function (_evt, path) {

    if (updatedPath === null) {
      updatedPath = path;
    }

    if (updatedPath !== null && path !== updatedPath) {

      (await recordingRepository.find({
        date: LessThan(moment(moment.now()).subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss.SSSSSS'))
      })).forEach((r: Recording) => {
        fs.unlinkSync(`videos/${r.path}`)
      });
      await recordingRepository.delete({
          date: LessThan(moment(moment.now()).subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss.SSSSSS'))
      });

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
    url: config.feed_url,
    timeLimit: 60, // time in seconds for each segmented video file
    folder: 'videos',
    name: `cam${config.id}`,
    directoryPathFormat: '',
  })).startRecording();
})();

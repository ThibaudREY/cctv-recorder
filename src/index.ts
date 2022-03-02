import "reflect-metadata";
import {Connection, createConnection, LessThan} from 'typeorm';
import {Recorder} from 'node-rtsp-recorder';
import watch from 'node-watch';
import {Recording} from "./entity/Recording";
import * as moment from "moment";

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const config: {feed_url: string} = require('../appconfig.json');

void (async () => {
  let updatedPath: string = null;
  const connection: Connection = await createConnection();
  const recordingRepository = connection.getRepository(Recording);

  watch('videos', {recursive: true}, async function (_evt, path) {
    if (updatedPath === null) {
      updatedPath = path;
    }

    if (updatedPath !== null && path !== updatedPath) {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      const ago = moment(moment.now()).subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss.SSSSSS')
      await recordingRepository.delete({
          date: LessThan(ago)
      });

      const recording = new Recording();
      recording.path = updatedPath;
      recording.camera = 1;

      await recordingRepository.save(recording);

      updatedPath = path;
    }
  });

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  (new Recorder({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    url: config.feed_url,
    timeLimit: 60, // time in seconds for each segmented video file
    folder: 'videos',
    name: 'cam1',
    directoryPathFormat: '',
  })).startRecording();
})();

CREATE OR REPLACE FUNCTION	cctv_notify_func()	RETURNS trigger as	$$
BEGIN
		PERFORM	pg_notify('cctv', row_to_json(NEW)::text);
RETURN NEW;
END;
$$	LANGUAGE	plpgsql;

DROP TRIGGER IF EXISTS cctv_notify_trig ON recording;
CREATE TRIGGER cctv_notify_trig AFTER INSERT ON recording
FOR EACH ROW EXECUTE PROCEDURE	cctv_notify_func();

CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION citext;

CREATE DOMAIN textid AS citext
  CHECK ( value ~ '^[a-z0-9\-]+$' );
CREATE DOMAIN username AS citext
  CHECK ( value ~ '^[a-z][a-z0-9\-]{4,20}$' );
CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$' );

CREATE OR REPLACE FUNCTION slugify(value TEXT)
RETURNS TEXT AS $$
  select array_to_string(ARRAY(
    select word from (
      select UNNEST(regexp_split_to_array(regexp_replace(lower(unaccent(trim(value))), '[^a-z0-9 ]+', '', 'gi'), ' ')) as word) WORDS
      where length(word) > 1 limit 10
    ),
    '-'
   ) || '-' || substr(md5(random()::text), 1, 10);
$$ LANGUAGE SQL STRICT IMMUTABLE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS azdev;

CREATE TABLE IF NOT EXISTS azdev.redirects (
  idx serial PRIMARY KEY,
  path text NOT NULL UNIQUE,
  dest text NOT NULL
);

CREATE TABLE IF NOT EXISTS azdev.users (
  idx serial PRIMARY KEY,
  id textid NOT NULL DEFAULT md5((now()::text || '-'::text) || random()::text) UNIQUE,
  username username NOT NULL UNIQUE,
  email email NOT NULL UNIQUE,
  first_name text,
  last_name text,
  hashed_password text NOT NULL,
  hashed_auth_token text,
  hashed_renew_token text,
  access_level integer NOT NULL DEFAULT 1,
  auth_token_expires_at timestamp without time zone,
  renew_token_expires_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  CHECK (length(email) > 8)
);

CREATE TABLE IF NOT EXISTS azdev.tags (
  idx serial PRIMARY KEY,
  id textid NOT NULL DEFAULT md5((now()::text || '-'::text) || random()::text) UNIQUE,
  title text NOT NULL UNIQUE,
  created_by textid NOT NULL,
  use_counter integer NOT NULL DEFAULT 1,
  published_at timestamp without time zone,
  published_by textid,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (published_by) REFERENCES azdev.users(id),
  CHECK (length(title) > 2)
);

CREATE TABLE IF NOT EXISTS azdev.tasks (
  idx serial PRIMARY KEY,
  id textid NOT NULL UNIQUE,
  content text NOT NULL,
  is_private boolean NOT NULL DEFAULT FALSE,
  approach_count integer NOT NULL DEFAULT 0,
  sort_rank integer,
  created_by textid NOT NULL,
  published_at timestamp without time zone,
  published_by textid,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (published_by) REFERENCES azdev.users(id),
  CHECK (length(content) > 10)
);

CREATE TABLE IF NOT EXISTS azdev.task_tags (
  idx serial PRIMARY KEY,
  created_by textid NOT NULL,
  task_id textid NOT NULL,
  tag_id textid NOT NULL,
  published_at timestamp without time zone,
  published_by textid,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (published_by) REFERENCES azdev.users(id),
  FOREIGN KEY (task_id) REFERENCES azdev.tasks(id),
  FOREIGN KEY (tag_id) REFERENCES azdev.tags(id)
);

CREATE TABLE IF NOT EXISTS azdev.approaches (
  idx serial PRIMARY KEY,
  id textid NOT NULL DEFAULT md5((now()::text || '-'::text) || random()::text) UNIQUE,
  content text NOT NULL,
  task_id textid NOT NULL,
  vote_count integer NOT NULL DEFAULT 0,
  sort_rank integer,
  created_by textid NOT NULL,
  published_at timestamp without time zone,
  published_by textid,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (published_by) REFERENCES azdev.users(id),
  FOREIGN KEY (task_id) REFERENCES azdev.tasks(id),
  CHECK (length(content) > 10)
);

CREATE TABLE IF NOT EXISTS azdev.approach_details (
  idx serial PRIMARY KEY,
  id textid NOT NULL DEFAULT md5((now()::text || '-'::text) || random()::text) UNIQUE,
  approach_id textid NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  sort_rank integer,
  created_by textid NOT NULL,
  published_at timestamp without time zone,
  published_by textid,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (published_by) REFERENCES azdev.users(id),
  FOREIGN KEY (approach_id)  REFERENCES azdev.approaches(id),
  CHECK (length(content) > 10),
  CHECK (category in ('explanation', 'note', 'warning'))
);

CREATE TABLE IF NOT EXISTS azdev.approach_votes (
  idx serial PRIMARY KEY,
  id textid NOT NULL DEFAULT md5((now()::text || '-'::text) || random()::text) UNIQUE,
  approach_id textid NOT NULL,
  vote integer NOT NULL,
  created_by textid NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT (now() at time zone 'utc'),
  last_updated_at timestamp without time zone,

  FOREIGN KEY (created_by) REFERENCES azdev.users(id),
  FOREIGN KEY (approach_id)  REFERENCES azdev.approaches(id),
  CHECK (vote BETWEEN -1 AND 1),
  UNIQUE (approach_id, created_by)
);

/* last_update_at trigger */

CREATE OR REPLACE FUNCTION azdev.update_last_updated_at() RETURNS trigger AS $$
	BEGIN
	  NEW.last_updated_at = (now() at time zone 'utc');
	  RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_last_updated_at_trigger BEFORE INSERT OR UPDATE ON azdev.users
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_last_updated_at();

CREATE TRIGGER update_tasks_last_updated_at_trigger BEFORE INSERT OR UPDATE ON azdev.tasks
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_last_updated_at();

CREATE TRIGGER update_approaches_last_updated_at_trigger BEFORE INSERT OR UPDATE ON azdev.approaches
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_last_updated_at();

CREATE TRIGGER update_approach_details_last_updated_at_trigger BEFORE INSERT OR UPDATE ON azdev.approach_details
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_last_updated_at();

CREATE TRIGGER update_approach_votes_last_updated_at_trigger BEFORE INSERT OR UPDATE ON azdev.approach_votes
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_last_updated_at();

/* slugify id trigger for tasks */

CREATE OR REPLACE FUNCTION azdev.use_content_slug() RETURNS trigger AS $$
	BEGIN
	  NEW.id = slugify(NEW.content);
	  RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

CREATE TRIGGER use_default_task_slug_trigger BEFORE INSERT ON azdev.tasks
  FOR EACH ROW
  WHEN (NEW.id IS NULL)
  EXECUTE FUNCTION azdev.use_content_slug();

/* approach_count trigger */

CREATE OR REPLACE FUNCTION azdev.update_approach_count() RETURNS trigger AS $$
	BEGIN
    UPDATE azdev.tasks t
    SET approach_count = (
      SELECT count(*)
      FROM azdev.approaches
      WHERE task_id = t.id
    )
    where id = NEW.task_id;
    RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

CREATE TRIGGER update_approach_count_trigger AFTER INSERT OR DELETE ON azdev.approaches
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_approach_count();

/* vote_count trigger */

CREATE OR REPLACE FUNCTION azdev.update_vote_count() RETURNS trigger AS $$
	BEGIN
    UPDATE azdev.approaches a
    SET vote_count = (
      SELECT sum(vote)
      FROM azdev.approach_votes
      WHERE approach_id = a.id
    )
    where id = NEW.approach_id;
    RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_count_trigger AFTER INSERT OR UPDATE OR DELETE ON azdev.approach_votes
  FOR EACH ROW
  EXECUTE FUNCTION azdev.update_vote_count();

/* VIEWS */

CREATE VIEW azdev.task_tags_view AS
  SELECT tt.task_id, t.title
  FROM azdev.task_tags tt JOIN azdev.tags t ON (tt.tag_id = t.id);

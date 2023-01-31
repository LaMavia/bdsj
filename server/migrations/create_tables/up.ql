-- pgcrypto polyfill
begin;
create function gen_random_uuid()
    returns uuid
    language sql
    as 'SELECT uuid_in(overlay(overlay(md5(random()::text || '':'' || random()::text) placing ''4'' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring);';
end;

begin;
import('./src/tables.ql');
import('./src/session.ql');
import('./src/round.ql');

import('./src/validity.ql');

import('./data/mod.ql');
import('./helpers/update_id_seq.ql');
commit;

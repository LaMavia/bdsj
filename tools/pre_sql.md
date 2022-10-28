
## prefix substitution

```sql
create table tablename (
    @_field type
);
```
turns into
```sql
create table tablename (
    tablename_field type
);
```

## not null

```sql
create table table_name (
    field_name type!
);
```
turns into
```sql
create table table_name (
    field_name type not null
);
```

## reference arrow

```sql
create table table_name (
    @_ref_field integer -> other_table_id
);
```
turns into
```sql
create table table_name (
    table_name_ref_field integer 
        references other_table (other_table_id)
);
```

## mixins

### &id

expands `&id` into `@_id serial primary key`

### &ref

expands `&ref column_name type` 
into `@_column_name type -> column_name`



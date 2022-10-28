#!/usr/bin/env perl
=pod 

## prefix substitution

```
create table tablename (
    @_field type
);
```
turns into
```
create table tablename (
    tablename_field type
);
```

## not null

```
create table table_name (
    field_name type!
);
```
turns into
```
create table table_name (
    field_name type not null
);
```

## reference arrow

```
create table table_name (
    @_ref_field integer -> other_table_id
);
```
turns into
```
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


=cut

use strict;
use warnings;

my $file = $ARGV[0];

open(my $src, '<', $file) or die "Could not open $file: $!";

my $re_identifier = q/[^\s]+(?<!,)/;
my $re_type = q/[^\s]+(?<!,)/;

my $current_table_name = "";

while(my $line = <$src>)  {   
    my $indent;
    ($indent) = ($line =~ /^(\s*)/);

    # optional table creation
    if ($line =~ /create\s*table\?/) {
        $line =~ s/create\s*table\?/create table if not exists/g;
    }
    # setting current_table_name
    if ($line =~ /create\s*table(?:\s*if\s*not\s*exists)?\s*($re_identifier)\s*\(/) {
        $current_table_name = $1;
    } 
    # mixins
    if ($line =~ /&($re_identifier)/) {
        my $name = $1;

        # id shortcut
        if ($name =~ /id/i) {
            $line =~ s/&id/\@_id serial primary key/gi;
        } 
        # reference by the same column
        elsif ($name =~ /ref/i) {
            $line =~ s/&ref\s*($re_identifier)\s*($re_type)/\@_$1 $2 -> $1/gi;
        }
    }
    # table properties
    if ($line =~ /@/) {
        $line =~ s/@/$current_table_name/g;
    } 
    # not null
    if ($line =~ /!/) {
        $line =~ s/!/ not null/g;
    }
    # references
    if ($line =~ /->/) {
        $line =~ s/-> ($re_identifier)_($re_identifier)/\n${indent}${indent}references $1 ($1_$2)/g;
    }

    print $line;
}

close $src;

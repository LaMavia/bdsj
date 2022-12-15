#!/usr/bin/env perl
=pod 

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


=cut

use strict;
use warnings;

my $file = $ARGV[0];
my $out_file = ($file =~ s/\.ql//r);

open(my $src, '<', $file) or die "Could not open $file: $!";
open(my $out, '>', $out_file) or die $!;

my $re_identifier = q/[^\s]+(?<!,)/;
my $re_identifier_list = q/\((?:\s*[^\s\(\)]+,?\s*)*\)/;
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
        # primary key
        elsif ($name =~ /pk/i) {
            $line =~ s/&pk\s*($re_identifier_list)/primary key $1/gi;
        }
        #foreign key
        elsif ($name =~ /fk/i) {
            ( my $own_keys
            , my $foreign_table
            , my $foreign_keys
            ) = ($line =~ /&fk\s*($re_identifier_list)\s*->\s*($re_identifier)\s*($re_identifier_list)/gi);
            $foreign_keys =~ s/@/$foreign_table/gi;

            $line =~ s/&fk\s*$re_identifier_list\s*->\s*$re_identifier\s*$re_identifier_list/constraint \@_${foreign_table}_fk\n${indent}${indent}foreign key $own_keys\n${indent}${indent}references $foreign_table $foreign_keys/gi;
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
    # joins
    if ($line =~ /<\|>/) {
        $line =~ s/<\|>/inner join/gi;
    }
    if ($line =~ />\|</) {
        $line =~ s/>\|</join/gi;
    }
    if ($line =~ /\|>/) {
        $line =~ s/\|>/right join/gi;
    }
    if ($line =~ /<\|/) {
        $line =~ s/<\|/left join/gi;
    }

    print $out $line;
}

close $src;
close $out;

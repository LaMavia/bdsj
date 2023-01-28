#!/usr/bin/env perl

use strict;
use warnings;
use warnings FATAL => 'all';
use File::Spec::Functions 'catfile';
use File::Basename;

sub process_file {
    my ($file) = @_;
    my $out_file = ($file =~ s/\.ql/.sql/r);
    my $out = "";

    my(undef, $base_dir) = fileparse($file);
    open(my $src, '<', $file) or die "Could not open $file: $!";
    open(my $dist, '>', $out_file) or die $!;

    my $re_identifier = q/[^\s]+(?<!,)/;
    my $re_identifier_list = q/\((?:\s*[^\s\(\)]+,?\s*)*\)/;
    my $re_type = q/[^\s]+(?<!,)/;

    my $current_table_name = "";

    while(my $line = <$src>)  {   
        my $indent;
        ($indent) = ($line =~ /^(\s*)/);

        # imports
        if ($line =~ /import\s*\('([^']+)'\);/) {
            my $path = catfile($base_dir, $1);
            print $path . "\n";
            my $res = process_file($path);
            $line =~ s/import\s*\('([^']+)'\);/$res/;
        }

        # optional table creation
        if ($line =~ /create\s*table\?/) {
            $line =~ s/create\s*table\?/create table if not exists/g;
        }
        # setting current_table_name
        if ($line =~ /(?:create\s+table(?:\s*if\s*not\s*exists)?|insert\s+into\s+)\s*($re_identifier)\s*\(/) {
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

        # print $out $line;
        $out = $out . $line;
    }

    print $dist $out;

    close $src;
    close $dist;
    return $out;
};

process_file(@ARGV);

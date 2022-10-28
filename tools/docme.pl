#!/usr/bin/perl

use strict;
use warnings;

my $file = $ARGV[0];
my $out_file = ($file =~ s/\.\w+$/.md/r);

open(my $src, '<', $file) or die "Could not open $file: $!";
open(my $out, '>', $out_file) or die $!;

my $do_print = 0;

while (my $line = <$src>) {
    if ($line =~ /=pod/) {
        $do_print = 1;
        next;
    } 

    if ($line =~ /=cut/) {
        $do_print = 0;
    }

    if ($do_print) {
        print $out $line;
    }
}

close $src;
close $out;
